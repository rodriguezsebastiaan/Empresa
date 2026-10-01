import assert from 'node:assert/strict'
import { createCinematicSourceSwitch } from '../components/cinematic/cinematic-source-switch'
import { cinematicProfileChangeEvent } from '../components/cinematic/use-responsive-cinematic-sources'

const timers = new Map<number, { callback: () => void; delay: number }>()
let id = 0
Object.assign(globalThis, { window: { innerWidth: 1440, innerHeight: 900,
  setTimeout(callback: () => void, delay: number) { timers.set(++id, { callback, delay }); return id },
  clearTimeout(key: number) { timers.delete(key) },
} })
const fire = (delay: number) => {
  for (const [key, timer] of [...timers]) if (timer.delay === delay) {
    timers.delete(key); timer.callback()
  }
}
class Element extends EventTarget {
  dataset: Record<string, string> = {}
  style: Record<string, string> = {}
  children: Element[] = []
  parentElement: Element | null = null
  attributes: Record<string, string> = {}
  get isConnected() { return Boolean(this.parentElement) }
  setAttribute(key: string, value: string) { this.attributes[key] = value }
  removeAttribute(key: string) { delete this.attributes[key] }
  append(child: Element) { child.parentElement = this; this.children.push(child) }
  insertBefore(child: Element) { this.append(child) }
  querySelector() { return null }
  remove() {
    if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(x => x !== this)
    this.parentElement = null
  }
  replaceWith(next: Element) { const parent = this.parentElement; this.remove(); parent?.append(next) }
}
class Canvas extends Element {
  width = 0
  height = 0
  copiedSource = ''
  getContext() { return { drawImage: (v: Video) => { this.copiedSource = v.src } } }
  toDataURL() { return 'data:image/jpeg;base64,fixture' }
}
class Image extends Element {
  src = ''
  alt = ''
  async decode() {}
}
class Video extends Element {
  readyState = 4
  videoWidth = 1920
  videoHeight = 1080
  loadCount = 0
  paused = true
  src: string
  constructor(index: number, visible = false) {
    super()
    this.src = `/desktop/${index}.mp4`
    this.dataset.desktopSrc = this.src
    this.dataset.mobileSrc = `/mobile/${index}.mp4`
    this.style = { opacity: visible ? '1' : '0', visibility: visible ? 'visible' : 'hidden' }
  }
  hasAttribute() { return Boolean(this.src) }
  getAttribute() { return this.src || null }
  pause() { this.paused = true }
  load() { this.loadCount++; this.readyState = 0 }
}
Object.assign(globalThis, {
  HTMLCanvasElement: Canvas, HTMLImageElement: Image,
  document: { createElement: (tag: string) => tag === 'canvas' ? new Canvas() : tag === 'img' ? new Image() : new Element() },
  getComputedStyle: (node: Element) => ({ opacity: node.style.opacity ?? '1',
    visibility: node.style.visibility ?? 'visible', objectFit: 'cover', objectPosition: '50% 40%',
    backgroundColor: '#000' }),
})
function fixture() {
  const root = new Element(), stage = new Element()
  root.dataset.introState = 'complete'
  const videos = Array.from({ length: 7 }, (_, i) => new Video(i, i === 2))
  videos.forEach(v => stage.append(v))
  let profile: 'desktop' | 'mobile' = 'desktop'
  let wakes = 0
  const confirmed = new Map<Video, number>()
  const switcher = createCinematicSourceSwitch(root as unknown as HTMLElement,
    videos as unknown as HTMLVideoElement[], () => profile, () => wakes++, v => ({
      confirmFrame() {},
      getFrameReadiness(target) { return confirmed.get(v as unknown as Video) === target ? 'presented' : 'pending' },
    }))
  const targets = (pairs: [number, number][]) => new Map(pairs.map(([index, time]) =>
    [videos[index] as unknown as HTMLVideoElement, time]))
  const cross = (value: typeof profile) => { profile = value; root.dispatchEvent(new Event(cinematicProfileChangeEvent)) }
  const hold = () => stage.children.find(c => c.dataset.cinematicSourceHold === 'true')
  return { root, videos, stage, switcher, targets, confirmed, cross, hold, wakes: () => wakes }
}
async function main() {
{
  const f = fixture(), wanted = f.targets([[1, 6], [2, 4], [3, 0]])
  f.switcher.sync(wanted)
  assert.equal(f.hold(), undefined, 'Same profile creates no snapshot')
  f.cross('mobile')
  const captured = f.hold()!.children[0] as Canvas
  assert.equal(captured.copiedSource, '/desktop/2.mp4', 'Pixels copied before any source replacement')
  assert.equal(captured.width, 1280)
  assert.equal(f.hold()!.attributes['aria-hidden'], 'true')
  assert.equal(f.hold()!.style.pointerEvents, 'none')
  f.switcher.sync(wanted)
  assert.equal(f.videos[2].loadCount, 0, '80ms crossing burst is coalesced')
  fire(80); f.switcher.sync(wanted)
  assert.deepEqual(f.videos.map(v => v.loadCount), [0, 1, 1, 1, 0, 0, 0], 'Only relevant attached sources replaced')
  f.switcher.finish(f.targets([[2, 4]]))
  assert.ok(f.hold(), 'Metadata/data alone cannot release visual hold')
  f.confirmed.set(f.videos[2], 4)
  f.switcher.finish(f.targets([[2, 4.5]]))
  assert.ok(f.hold(), 'Latest scroll target replaces old readiness')
  f.confirmed.set(f.videos[2], 4.5)
  f.switcher.finish(f.targets([[2, 4.5]]))
  assert.equal(f.hold(), undefined)
  assert.equal(captured.width, 0, 'Snapshot pixel buffer released')
  f.switcher.dispose()
}
{
  const f = fixture()
  f.cross('mobile'); f.cross('desktop'); fire(80)
  f.switcher.sync(f.targets([[2, 3]]))
  assert.equal(f.videos.reduce((sum, v) => sum + v.loadCount, 0), 0, 'Obsolete profile never loads')
  f.confirmed.set(f.videos[2], 3)
  f.switcher.finish(f.targets([[2, 3]]))
  assert.equal(f.hold(), undefined)
  f.switcher.dispose()
}
{
  const f = fixture()
  f.videos[1].style = { opacity: '.4', visibility: 'visible' }
  f.videos[2].style.opacity = '.6'
  f.cross('mobile'); fire(80); f.switcher.sync(f.targets([[1, 6], [2, 0]]))
  assert.equal(f.hold()!.children.length, 2, 'Both blend layers retained in original order')
  f.confirmed.set(f.videos[2], 0)
  f.switcher.finish(f.targets([[1, 6], [2, 0]]))
  assert.ok(f.hold(), 'All semantically visible replacement frames must be ready')
  f.confirmed.set(f.videos[1], 6)
  f.switcher.finish(f.targets([[1, 6], [2, 0]]))
  assert.equal(f.hold(), undefined)
  f.switcher.dispose()
}
for (const error of [true, false]) {
  const f = fixture()
  f.cross('mobile'); fire(80); f.switcher.sync(f.targets([[2, 3]]))
  const captured = f.hold()!.children[0] as Canvas
  if (error) f.videos[2].dispatchEvent(new Event('error'))
  else fire(8000)
  await Promise.resolve(); await Promise.resolve()
  assert.equal(captured.width, 0, 'Large canvas removed after bounded failure recovery')
  assert.ok(f.hold()!.children[0] instanceof Image, 'Stable compressed last-valid still avoids blank error state')
  const loads = f.videos[2].loadCount
  f.switcher.sync(f.targets([[2, 4]]))
  assert.equal(f.videos[2].loadCount, loads, 'No automatic network retry loop')
  f.confirmed.set(f.videos[2], 4)
  f.switcher.finish(f.targets([[2, 4]]))
  assert.equal(f.hold(), undefined, 'Later valid media event can recover')
  f.switcher.dispose()
}
{
  const f = fixture()
  f.cross('mobile'); fire(80); f.switcher.sync(f.targets([[2, 3]]))
  f.videos[2].dispatchEvent(new Event('error'))
  await Promise.resolve(); await Promise.resolve()
  f.switcher.sync(f.targets([[3, 1]]))
  assert.equal(f.videos[2].loadCount, 1, 'Failed source is not automatically retried')
  assert.equal(f.videos[3].loadCount, 1, 'Navigation can load a different required source after failure')
  f.confirmed.set(f.videos[3], 1)
  f.switcher.finish(f.targets([[3, 1]]))
  assert.equal(f.hold(), undefined, 'A different valid scene can end the failure still')
  f.switcher.dispose()
}
{
  const f = fixture()
  f.root.dataset.introState = 'running'
  f.videos[2].paused = false
  f.cross('mobile'); fire(80); f.switcher.sync(f.targets([[2, 3]]), true)
  assert.equal(f.hold(), undefined)
  assert.equal(f.videos[2].paused, false, 'Native intro is neither paused nor reset')
  f.root.dataset.introState = 'complete'
  f.switcher.sync(f.targets([[2, 3]]))
  assert.equal(f.videos[2].loadCount, 1, 'Deferred profile applied after handoff')
  f.switcher.dispose()
  assert.equal(f.hold(), undefined)
}
assert.equal(timers.size, 0, 'All transaction/watchdog timers cleaned up')
console.log('PASS: temporary capture, relevant sources, latest profile/target, blend readiness, bounded failure, intro deferral and cleanup.')
}
void main().catch(error => { console.error(error); process.exitCode = 1 })
