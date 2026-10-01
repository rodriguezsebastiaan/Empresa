import assert from 'node:assert/strict'
import { createCinematicLayerWriter, getCinematicBlend } from '../components/cinematic/cinematic-transition-utils'

const base = { count: 7, activeIndex: 1, progress: 0.98, width: 0.035,
  boundaryOpacity: 0.82, heldIndex: 1 }
const delayed = getCinematicBlend({ ...base, isReady: index => index === 1 })
assert.equal(delayed.opacity[1], 1)
assert.equal(delayed.opacity[2], 0, 'Incoming layer stays hidden until ready')
assert.equal(delayed.waitingFor, 2)
const forward = getCinematicBlend({ ...base, isReady: () => true })
assert.ok(Math.abs(forward.opacity[2] - 0.82 * (0.015 / 0.035)) < 1e-12)
assert.ok(Math.abs(forward.opacity.reduce((a, b) => a + b, 0) - 1) < 1e-12)
const stopped = getCinematicBlend({ ...base, isReady: () => true })
assert.deepEqual(stopped, forward, 'No wall-clock animation after stop')
const reverse = getCinematicBlend({ ...base, activeIndex: 2, progress: 0.01,
  heldIndex: 2, isReady: index => index === 2 })
assert.equal(reverse.opacity[2], 1)
assert.equal(reverse.opacity[1], 0, 'Previous end frame is gated symmetrically')
const reversedReady = getCinematicBlend({ ...base, activeIndex: 2, progress: 0.01,
  heldIndex: 2, isReady: () => true })
assert.ok(reversedReady.opacity[1] > 0)
const skipped = getCinematicBlend({ ...base, activeIndex: 6, progress: 0.5,
  isReady: () => false })
assert.equal(skipped.opacity[1], 1, 'Multi-range jump keeps outgoing valid layer')
assert.equal(skipped.opacity[6], 0)

const videos = Array.from({ length: 7 }, (_, index) => ({
  style: { opacity: index === 0 ? '1' : '0', visibility: '', willChange: '' },
}))
const writer = createCinematicLayerWriter(videos as unknown as HTMLVideoElement[])
const warm = new Set([0, 1, 2])
const initial = writer.apply(forward.opacity, warm)
assert.ok(initial.writes < 14)
assert.equal(initial.hintWrites, 3)
for (let index = 0; index < 100; index++) {
  assert.deepEqual(writer.apply(forward.opacity, warm), { writes: 0, avoided: 14, hintWrites: 0 })
}
const next = writer.apply(reversedReady.opacity, new Set([1, 2, 3]))
assert.equal(next.hintWrites, 2, 'Hints change only when relevant layer window changes')
assert.equal(videos[0].style.willChange, 'auto')
assert.equal(videos[4].style.opacity, '0', 'Distant stable layer is not touched')
assert.ok(next.writes <= 4)
console.log('PASS: forward/reverse gates, delayed/jumped scenes, fixed scroll blend, style cache and bounded compositor hints.')
