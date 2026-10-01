import assert from 'node:assert/strict'
import { createVideoSeekScheduler } from '../components/cinematic/cinematic-video-utils'

// Controlled media/event ordering, independent of local decoder speed.
const timers = new Map<number, () => void>()
let nextId = 0
Object.assign(globalThis, {
  window: {
    setTimeout(callback: () => void) { timers.set(++nextId, callback); return nextId },
    clearTimeout(id: number) { timers.delete(id) },
  },
})
class Observer {
  static latest: Observer
  constructor(public callback: () => void) { Observer.latest = this }
  observe() {}
  disconnect() {}
}
Object.assign(globalThis, { MutationObserver: Observer })

class Video extends EventTarget {
  dataset: Record<string, string> = {}
  readyState = 4
  duration = 6
  seeking = false
  src = 'desktop.mp4'
  time = 0
  assignments: number[] = []
  frames = new Map<number, (now: number, metadata: { mediaTime: number }) => void>()
  get currentTime() { return this.time }
  set currentTime(time: number) {
    this.time = time
    this.assignments.push(time)
    this.seeking = true
  }
  getAttribute() { return this.src }
  requestVideoFrameCallback(callback: (now: number, metadata: { mediaTime: number }) => void) {
    this.frames.set(++nextId, callback)
    return nextId
  }
  cancelVideoFrameCallback(id: number) { this.frames.delete(id) }
  settle(present = true) {
    this.seeking = false
    this.dispatchEvent(new Event('seeked'))
    if (present) {
      const callbacks = [...this.frames.values()]
      this.frames.clear()
      callbacks.forEach(callback => callback(0, { mediaTime: Math.floor(this.time * 24) / 24 }))
    }
  }
}
function fixture(fallback = false, confirmUnchangedFrames = false) {
  const video = new Video()
  if (fallback) Object.defineProperty(video, 'requestVideoFrameCallback', { value: undefined })
  let wakes = 0
  const scheduler = createVideoSeekScheduler(video as unknown as HTMLVideoElement, () => wakes++,
    1 / 48, { confirmUnchangedFrames })
  const target = (time: number) => { scheduler.setTarget(time); return scheduler.flush() }
  return { video, scheduler, target, wakes: () => wakes }
}

for (const fallback of [false, true]) {
  const { video, scheduler, target, wakes } = fixture(fallback)
  target(1)
  target(2); target(3); target(4)
  assert.deepEqual(video.assignments, [1])
  video.settle(); scheduler.flush()
  assert.deepEqual(video.assignments, [1, 4], 'Only newest pending target is assigned')
  video.settle(); assert.equal(scheduler.flush(), true)
  const stableWakes = wakes()
  for (let index = 0; index < 10; index++) assert.equal(target(4.01), true)
  assert.equal(wakes(), stableWakes, 'Equivalent targets do not schedule RAF')
  target(0.5); video.settle(); scheduler.flush()
  assert.equal(video.currentTime, 0.5, 'Reverse seek converges')
  scheduler.dispose()
  assert.equal(video.frames.size, 0)
  assert.equal(timers.size, 0)
}

{
  const { video, scheduler, target } = fixture(true)
  target(1); target(4)
  video.seeking = false // Deliberately omit seeked and any presentation callback.
  scheduler.flush()
  assert.deepEqual(video.assignments, [1, 4], 'A later RAF recovers a missed completion event')
  scheduler.dispose()
}
{
  const { video, scheduler, target } = fixture()
  target(2.08); video.settle(); scheduler.flush()
  target(5); video.settle(false); scheduler.flush()
  target(2.05)
  assert.deepEqual(video.assignments, [2.08, 5, 2.05], 'Older presented frame cannot satisfy a newer request')
  scheduler.dispose()
}
{
  const { video, scheduler, target } = fixture()
  target(2.08); video.settle(); scheduler.flush()
  target(2.025); target(2.08); target(2.03); target(2.08)
  assert.equal(video.assignments.length, 1, 'Confirmed frame suppresses equivalent jitter')
  scheduler.dispose()
}
{
  const { video, scheduler, target } = fixture()
  video.readyState = 0
  target(3)
  assert.equal(video.assignments.length, 0)
  video.src = 'mobile.mp4'; Observer.latest.callback()
  video.readyState = 4; video.time = 0
  video.dispatchEvent(new Event('loadedmetadata')); scheduler.flush()
  assert.equal(video.currentTime, 3, 'Source reset retains newest intent')
  const staleCallback = [...video.frames.values()][0]
  video.src = 'desktop.mp4'; Observer.latest.callback()
  staleCallback(0, { mediaTime: 1 })
  assert.equal(JSON.parse(video.dataset.cinematicSeek).presentedTime, null)
  video.seeking = false; scheduler.flush(); video.settle(); scheduler.flush()
  scheduler.dispose()
}
{
  const { video, scheduler, target, wakes } = fixture()
  target(2); video.settle(false)
  // Browser has rVFC but the hidden video never presents a frame.
  for (const callback of [...timers.values()]) callback()
  timers.clear()
  assert.equal(scheduler.flush(), true)
  assert.equal(video.frames.size, 0)
  scheduler.suspend()
  const before = wakes()
  video.dispatchEvent(new Event('seeked'))
  assert.equal(wakes(), before, 'Native intro suspension does not wake scrubbing')
  scheduler.dispose()
}
{
  const { video, scheduler, target, wakes } = fixture()
  target(2)
  for (const callback of [...timers.values()]) callback()
  timers.clear()
  assert.equal(wakes(), 0, 'Stalled seek does not start RAF polling')
  assert.equal(video.frames.size, 0)
  video.settle(); scheduler.flush()
  scheduler.dispose()
}

// Original helper's 1/30 tolerance, with a completed seek between inputs.
const jitter = [2.08, 2.025, 2.08, 2.03, 2.08]
let baselineTime = 0
let baselineAssignments = 0
for (const target of jitter) {
  if (Math.abs(baselineTime - target) > 1 / 30) {
    baselineTime = target
    baselineAssignments++
  }
}
assert.equal(baselineAssignments, 5)

for (const fallback of [false, true]) {
  const { video, scheduler, target } = fixture(fallback, true)
  target(0)
  assert.equal(video.assignments.length, 0, 'Initial confirmation never creates a competing seek')
  assert.equal(scheduler.getFrameReadiness(0), 'pending', 'readyState alone is insufficient')
  if (fallback) {
    for (const callback of [...timers.values()]) callback()
    timers.clear()
    assert.equal(scheduler.getFrameReadiness(0), 'fallback')
  } else {
    video.settle()
    assert.equal(scheduler.getFrameReadiness(0), 'presented')
  }
  target(6)
  assert.equal(scheduler.getFrameReadiness(6), 'pending', 'Reverse end frame waits for completion')
  video.settle(); scheduler.flush()
  assert.equal(scheduler.getFrameReadiness(6), fallback ? 'fallback' : 'presented')
  video.src = 'mobile.mp4'; Observer.latest.callback()
  assert.equal(scheduler.getFrameReadiness(6), 'pending', 'Source reset invalidates readiness')
  scheduler.dispose()
}
{
  const { video, scheduler, target } = fixture(false, true)
  target(0)
  const callback = [...video.frames.values()][0]
  video.frames.clear()
  callback(0, { mediaTime: 3 })
  assert.equal(scheduler.getFrameReadiness(0), 'pending', 'Old compositor frame is not proof')
  for (const timer of [...timers.values()]) timer()
  timers.clear()
  assert.equal(scheduler.getFrameReadiness(0), 'fallback', 'Invalid callback retains bounded recovery')
  scheduler.dispose()
}
console.log('PASS: latest target, forward/reverse, half-frame tolerance, rVFC/fallback, source reset, stale callbacks, suspension, cleanup, and stalled media.')
console.log('PASS: transition readiness, unchanged initial frame, end-side frame, stale presentation and bounded fallback.')
console.log('Deterministic frame-equivalent jitter: baseline 5 assignments; scheduler 1.')

{
  const { video, scheduler, target } = fixture()
  target(1); video.settle()
  video.readyState = 0
  video.src = 'mobile.mp4'
  Observer.latest.callback()
  const resets = JSON.parse(video.dataset.cinematicSeek).sourceResets
  video.dispatchEvent(new Event('emptied'))
  assert.equal(JSON.parse(video.dataset.cinematicSeek).sourceResets, resets,
    'Mutation plus emptied reset one replacement generation exactly once')
  video.readyState = 4; video.time = 0; scheduler.flush(); video.settle()
  assert.equal(scheduler.getFrameReadiness(1), 'presented')
  scheduler.dispose()
}
{
  const { video, scheduler, target } = fixture()
  target(0)
  assert.equal(video.frames.size, 0, 'Normal internal-page initial frame behavior unchanged')
  scheduler.confirmFrame()
  assert.equal(video.assignments.length, 0)
  video.settle()
  assert.equal(scheduler.getFrameReadiness(0), 'presented')
  scheduler.dispose()
}
console.log('PASS: one reset per replacement and opt-in internal-page frame confirmation.')
