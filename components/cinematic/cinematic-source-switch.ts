import { cinematicProfileChangeEvent, resolveCinematicVideoSource,
  type CinematicMediaProfile } from './use-responsive-cinematic-sources'

type Readiness = {
  confirmFrame: () => void
  getFrameReadiness: (time: number) => 'presented' | 'fallback' | 'pending'
}
type Targets = ReadonlyMap<HTMLVideoElement, number>

// A source replacement is the only time we copy pixels. Canvas is never a
// scroll renderer; the original seven/single video elements stay in charge.
export function createCinematicSourceSwitch(
  root: HTMLElement,
  videos: HTMLVideoElement[],
  getProfile: () => CinematicMediaProfile,
  requestRender: () => void,
  schedulerFor: (video: HTMLVideoElement) => Readiness,
) {
  let hold: HTMLDivElement | null = null
  let captures: { video: HTMLVideoElement; node: HTMLCanvasElement | HTMLImageElement }[] = []
  let quietTimer: number | null = null
  let recoveryTimer: number | null = null
  let quiet = true
  let disposed = false
  let failed = false
  let active = false
  let started = 0
  let viewportKey = ''
  const events: Record<string, unknown>[] | null = process.env.NODE_ENV !== 'production' ? [] : null
  const trace = (kind: string, detail: Record<string, unknown> = {}) => {
    if (!events) return
    events.push({ kind, at: performance.now(), profile: getProfile(), ...detail })
    if (events.length > 80) events.shift()
    root.dataset.cinematicSourceSwitch = JSON.stringify({ active, failed, holding: Boolean(hold), events })
  }
  const clearRecovery = () => {
    if (recoveryTimer !== null) window.clearTimeout(recoveryTimer)
    recoveryTimer = null
  }
  const release = () => {
    clearRecovery()
    hold?.remove()
    for (const capture of captures) {
      if (capture.node instanceof HTMLCanvasElement) {
        capture.node.width = 0
        capture.node.height = 0
      } else capture.node.removeAttribute('src')
    }
    captures = []
    hold = null
  }
  const refreshGeometry = () => {
    const key = `${window.innerWidth}:${window.innerHeight}`
    if (viewportKey === key) return
    viewportKey = key
    captures.forEach(({ video, node }) => {
      const style = getComputedStyle(video)
      node.style.objectFit = style.objectFit
      node.style.objectPosition = style.objectPosition
    })
  }
  const capture = () => {
    if (hold) return true
    const visible = videos.filter(video => {
      const style = getComputedStyle(video)
      return Number(style.opacity) > 0 && style.visibility !== 'hidden'
    })
    // Don't clear a valid compositor image during an unfinished native seek.
    // Its normal completion events will wake the owner and retry this capture.
    if (visible.some(video => video.readyState < 2 || !video.videoWidth)) return false
    if (!visible.length) return true // Fresh load has no valid visual to retain.
    const stage = visible[0].parentElement
    if (!stage) return false
    const container = document.createElement('div')
    container.dataset.cinematicSourceHold = 'true'
    container.setAttribute('aria-hidden', 'true')
    Object.assign(container.style, { position: 'absolute', inset: '0', pointerEvents: 'none',
      background: getComputedStyle(stage).backgroundColor })
    const next: typeof captures = []
    try {
      for (const video of visible) {
        const canvas = document.createElement('canvas')
        // Source aspect ratio + object-fit preserve composition on both profiles.
        // At most 1280×720 pixels per visible 16:9 layer, independent of DPR.
        const scale = Math.min(1, 1280 / video.videoWidth)
        canvas.width = Math.round(video.videoWidth * scale)
        canvas.height = Math.round(video.videoHeight * scale)
        const context = canvas.getContext('2d', { alpha: false })
        if (!context) throw new Error('Snapshot context unavailable')
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const style = getComputedStyle(video)
        Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%',
          objectFit: style.objectFit, objectPosition: style.objectPosition, opacity: style.opacity,
          pointerEvents: 'none' })
        canvas.setAttribute('aria-hidden', 'true')
        container.append(canvas)
        next.push({ video, node: canvas })
      }
    } catch {
      next.forEach(({ node }) => { if (node instanceof HTMLCanvasElement) { node.width = 0; node.height = 0 } })
      trace('capture-deferred')
      return false
    }
    // Keep the original overlays above the captured video blend.
    stage.insertBefore(container, stage.querySelector('.ks-cinematic-overlay, .ks-cinematic-page-overlay'))
    captures = next
    hold = container
    viewportKey = `${window.innerWidth}:${window.innerHeight}`
    trace('captured', { layers: next.length, pixels: next.reduce((sum, x) =>
      sum + (x.node as HTMLCanvasElement).width * (x.node as HTMLCanvasElement).height, 0) })
    return true
  }
  const recover = (reason: string) => {
    if (!active || failed || disposed) return
    clearRecovery()
    failed = true
    // End the bounded canvas transaction. A compressed last-valid still is the
    // stable error state until valid media returns or the user changes profile.
    // No retry timer or large canvas remains alive during a network failure.
    captures.forEach(capture => {
      if (!(capture.node instanceof HTMLCanvasElement)) return
      const canvas = capture.node
      const image = document.createElement('img')
      image.alt = ''
      image.setAttribute('aria-hidden', 'true')
      image.style.cssText = canvas.style.cssText
      image.src = canvas.toDataURL('image/jpeg', 0.85)
      void image.decode().then(() => {
        if (disposed || !failed || capture.node !== canvas || !canvas.isConnected) {
          image.removeAttribute('src')
          return
        }
        canvas.replaceWith(image)
        canvas.width = 0
        canvas.height = 0
        capture.node = image
        trace('canvas-released-after-error')
      }).catch(() => trace('recovery-image-error'))
    })
    trace('recovery-still', { reason, elapsed: performance.now() - started })
  }
  const onError = () => recover('media-error')
  const onProfile = () => {
    failed = false
    quiet = false
    clearRecovery()
    if (quietTimer !== null) window.clearTimeout(quietTimer)
    quietTimer = window.setTimeout(() => {
      quietTimer = null
      quiet = true
      requestRender()
    }, 80)
    if (root.dataset.introState !== 'running' && root.dataset.introState !== 'pending' && capture() && hold) {
      active = true
      started = performance.now()
      recoveryTimer = window.setTimeout(() => recover('timeout'), 8000)
    }
    trace('profile-requested')
    requestRender()
  }
  root.addEventListener(cinematicProfileChangeEvent, onProfile)
  videos.forEach(video => video.addEventListener('error', onError))

  return {
    sync(targets: Targets, nativeIntro = false) {
      if (disposed) return
      if (hold) refreshGeometry()
      if (!quiet || nativeIntro) return
      const changes = [...targets.keys()].filter(video => video.hasAttribute('src') &&
        video.getAttribute('src') !== resolveCinematicVideoSource(video, getProfile()))
      if (!changes.length) return
      if (!capture()) return
      active = true
      failed = false
      started = performance.now()
      clearRecovery()
      recoveryTimer = window.setTimeout(() => recover('timeout'), 8000)
      for (const video of changes) {
        const source = resolveCinematicVideoSource(video, getProfile())
        if (!source) continue
        video.pause()
        video.dataset.activeSrc = source
        video.src = source
        video.load()
        trace('source-replaced', { index: videos.indexOf(video), source, target: targets.get(video) })
      }
    },
    finish(required: Targets) {
      if (!active || !quiet || disposed || required.size === 0) return
      const confirmations: string[] = []
      for (const [video, target] of required) {
        if (video.getAttribute('src') !== resolveCinematicVideoSource(video, getProfile())) return
        const scheduler = schedulerFor(video)
        scheduler.confirmFrame()
        const state = scheduler.getFrameReadiness(target)
        if (state === 'pending') return
        confirmations.push(state)
      }
      active = false
      failed = false
      const elapsed = performance.now() - started
      release()
      trace('released', { elapsed, confirmations, targets: [...required].map(([v, target]) =>
        ({ index: videos.indexOf(v), target })) })
    },
    isHolding: () => Boolean(hold),
    needsReadiness: () => active,
    dispose() {
      disposed = true
      if (quietTimer !== null) window.clearTimeout(quietTimer)
      release()
      root.removeEventListener(cinematicProfileChangeEvent, onProfile)
      videos.forEach(video => video.removeEventListener('error', onError))
      delete root.dataset.cinematicSourceSwitch
    },
  }
}
