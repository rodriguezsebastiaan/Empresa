type BlendInput = {
  count: number
  activeIndex: number
  progress: number
  width: number
  boundaryOpacity: number
  isReady: (index: number) => boolean
  heldIndex: number | null
}

// The existing scroll-based blend, gated by the exact targets supplied to the
// shared seek scheduler. A skipped range may temporarily hold a distant layer.
export function getCinematicBlend(input: BlendInput) {
  const { count, activeIndex, progress, width, boundaryOpacity, isReady, heldIndex } = input
  const opacity = Array<number>(count).fill(0)
  let waitingFor: number | null = null
  if (!isReady(activeIndex)) {
    waitingFor = activeIndex
    if (heldIndex !== null) opacity[heldIndex] = 1
  } else {
    opacity[activeIndex] = 1
    if (progress < width && activeIndex > 0) {
      const previous = activeIndex - 1
      if (isReady(previous)) {
        const share = boundaryOpacity + (1 - boundaryOpacity) * (progress / width)
        opacity[activeIndex] = share
        opacity[previous] = 1 - share
      } else waitingFor = previous
    } else if (progress > 1 - width && activeIndex < count - 1) {
      const next = activeIndex + 1
      if (isReady(next)) {
        const share = boundaryOpacity * ((progress - (1 - width)) / width)
        opacity[activeIndex] = 1 - share
        opacity[next] = share
      } else waitingFor = next
    }
  }
  return { opacity, waitingFor }
}

export function createCinematicLayerWriter(videos: HTMLVideoElement[]) {
  const cache = videos.map((video, index) => ({
    opacity: Number(video.style.opacity || 0).toFixed(4),
    visibility: video.style.visibility || (index === 0 ? 'visible' : 'hidden'),
    hint: video.style.willChange || 'auto',
  }))
  let relevant = new Set<number>([0])
  return {
    apply(opacity: readonly number[], warm: ReadonlySet<number>) {
      const nextRelevant = new Set(warm)
      opacity.forEach((value, index) => { if (value > 0) nextRelevant.add(index) })
      const changed = new Set([...relevant, ...nextRelevant])
      let writes = 0
      let hintWrites = 0
      for (const index of changed) {
        const video = videos[index]
        if (!video) continue
        const value = opacity[index] ?? 0
        const nextOpacity = value.toFixed(4)
        const visibility = value > 0 ? 'visible' : 'hidden'
        const hint = nextRelevant.has(index) ? 'opacity' : 'auto'
        const previous = cache[index]
        if (previous.opacity !== nextOpacity) {
          video.style.opacity = nextOpacity
          previous.opacity = nextOpacity
          writes++
        }
        if (previous.visibility !== visibility) {
          video.style.visibility = visibility
          previous.visibility = visibility
          writes++
        }
        if (previous.hint !== hint) {
          video.style.willChange = hint
          previous.hint = hint
          hintWrites++
        }
      }
      relevant = nextRelevant
      return { writes, avoided: videos.length * 2 - writes, hintWrites }
    },
  }
}
