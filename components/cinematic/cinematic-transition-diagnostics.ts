// Bounded, development-only observations. No listeners or attributes in production.
export function createTransitionDiagnostics(root: HTMLElement, videos: HTMLVideoElement[]) {
  if (process.env.NODE_ENV === 'production') return null
  let activeIndex = 0
  let progress = 0
  let renders = 0
  let styleWrites = 0
  let avoidedStyleWrites = 0
  let hintWrites = 0
  let emptyAfterVisible = 0
  let hasVisibleData = false
  const shown = videos.map(() => false)
  const presented = videos.map<number | null>(() => null)
  const callbacks = new Map<HTMLVideoElement, number>()
  const events: Record<string, unknown>[] = []
  const publish = () => {
    root.dataset.cinematicTransitions = JSON.stringify({
      activeIndex, progress, renders, styleWrites, avoidedStyleWrites, hintWrites,
      emptyAfterVisible,
      jsHeapBytes: (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize,
      events,
    })
  }
  const trace = (kind: string, index: number, detail: Record<string, unknown> = {}) => {
    const video = videos[index]
    events.push({ kind, index, at: performance.now(), activeIndex, progress,
      readyState: video?.readyState, currentTime: video?.currentTime,
      presentedTime: presented[index], ...detail })
    if (events.length > 160) events.shift()
    publish()
  }
  const onMedia = (event: Event) => {
    const video = event.currentTarget as HTMLVideoElement
    const index = videos.indexOf(video)
    trace(event.type, index)
    if (event.type === 'loadeddata' && typeof video.requestVideoFrameCallback === 'function') {
      const old = callbacks.get(video)
      if (old !== undefined) video.cancelVideoFrameCallback(old)
      callbacks.set(video, video.requestVideoFrameCallback((_now, metadata) => {
        callbacks.delete(video)
        presented[index] = metadata.mediaTime
        trace('observed-frame', index)
      }))
    }
  }
  const mediaEvents = ['loadedmetadata', 'loadeddata', 'canplay', 'seeked'] as const
  const sources = videos.map(video => video.getAttribute('src'))
  const sourceObserver = new MutationObserver(() => {
    videos.forEach((video, index) => {
      const src = video.getAttribute('src')
      if (src === sources[index]) return
      sources[index] = src
      presented[index] = null
      const callback = callbacks.get(video)
      if (callback !== undefined) video.cancelVideoFrameCallback(callback)
      callbacks.delete(video)
      trace('source-attached', index, { src })
    })
  })
  videos.forEach((video, index) => {
    mediaEvents.forEach(event => video.addEventListener(event, onMedia))
    sourceObserver.observe(video, { attributes: true, attributeFilter: ['src'] })
    if (sources[index]) trace('source-already-attached', index, { src: sources[index] })
  })
  const resources = new PerformanceObserver(list => {
    for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
      const index = videos.findIndex(video => video.src === entry.name)
      if (index < 0) continue
      trace('network', index, { start: entry.startTime, end: entry.responseEnd,
        transferBytes: entry.transferSize, encodedBytes: entry.encodedBodySize })
    }
  })
  resources.observe({ type: 'resource', buffered: true })
  return {
    sample(index: number, localProgress: number) {
      activeIndex = index
      progress = localProgress
      renders++
    },
    styleWork(writes: number, avoided: number, hints = 0) {
      styleWrites += writes
      avoidedStyleWrites += avoided
      hintWrites += hints
    },
    layers(opacity: readonly number[], targets: readonly (number | null)[]) {
      if (!opacity.some(value => value > 0) && hasVisibleData &&
        !root.querySelector('[data-cinematic-source-hold]')) emptyAfterVisible++
      videos.forEach((video, index) => {
        const visible = (opacity[index] ?? 0) > 0
        if (visible && video.readyState >= 2) hasVisibleData = true
        if (visible && !shown[index]) {
          trace('visible', index, { target: targets[index], seek: video.dataset.cinematicSeek })
        }
        shown[index] = visible
      })
      publish()
    },
    trace,
    dispose() {
      sourceObserver.disconnect()
      resources.disconnect()
      callbacks.forEach((callback, video) => video.cancelVideoFrameCallback(callback))
      mediaEvents.forEach(event => videos.forEach(video => video.removeEventListener(event, onMedia)))
      delete root.dataset.cinematicTransitions
    },
  }
}
