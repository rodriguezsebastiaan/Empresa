export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

export const smoothstep = (from: number, to: number, value: number) => {
  const progress = clamp((value - from) / Math.max(to - from, 0.0001))
  return progress * progress * (3 - 2 * progress)
}

// Half of one frame in the 24 FPS media. Assigned times remain continuous.
export const cinematicSeekTolerance = 1 / 48

export function createVideoSeekScheduler(
  video: HTMLVideoElement,
  requestRender: () => void,
  epsilonSeconds = cinematicSeekTolerance,
  options: { confirmUnchangedFrames?: boolean } = {},
) {
  let targetTime: number | null = null
  let requestedTime: number | null = null
  let presentedTime: number | null = null
  let presentedForRequest: number | null = null
  let confirmationPosition: number | null = null
  let fallbackPosition: number | null = null
  let seekInFlight = false
  let active = false
  let disposed = false
  let source = video.getAttribute('src')
  let frameCallback: number | null = null
  let confirmationTimer: number | null = null
  let generation = 0
  const counters = process.env.NODE_ENV !== 'production' ? {
    targetUpdates: 0, assignments: 0, coalesced: 0, equivalent: 0,
    frameConfirmations: 0, fallbackConfirmations: 0, sourceResets: 0,
    flushes: 0,
  } : null

  const publish = () => {
    if (!counters) return
    video.dataset.cinematicSeek = JSON.stringify({
      ...counters, targetTime, requestedTime, presentedTime, seekInFlight,
    })
  }
  const cancelConfirmation = () => {
    generation++
    if (frameCallback !== null) video.cancelVideoFrameCallback?.(frameCallback)
    if (confirmationTimer !== null) window.clearTimeout(confirmationTimer)
    frameCallback = null
    confirmationTimer = null
  }
  const reset = () => {
    cancelConfirmation()
    source = video.getAttribute('src')
    requestedTime = null
    presentedTime = null
    presentedForRequest = null
    confirmationPosition = null
    fallbackPosition = null
    seekInFlight = false
    if (counters) counters.sourceResets++
    publish()
    if (active && !disposed) requestRender()
  }
  const wake = () => {
    if (active && !disposed) requestRender()
  }
  const onSeeked = () => {
    seekInFlight = false
    // currentTime confirms seek completion, not compositor presentation.
    if (typeof video.requestVideoFrameCallback !== 'function') {
      cancelConfirmation()
      fallbackPosition = video.currentTime
      if (counters) counters.fallbackConfirmations++
    } else if (frameCallback === null && confirmationTimer === null) {
      // Recovery after a bounded callback attempt, including a stalled seek.
      fallbackPosition = video.currentTime
    }
    publish()
    wake()
  }
  const armConfirmation = (requestTime: number) => {
    cancelConfirmation()
    confirmationPosition = requestTime
    fallbackPosition = null
    const token = generation
    if (typeof video.requestVideoFrameCallback === 'function') {
      frameCallback = video.requestVideoFrameCallback((_now, metadata) => {
        if (disposed || token !== generation) return
        frameCallback = null
        presentedTime = metadata.mediaTime
        // A callback can describe an older frame already queued for composition.
        // Only associate it with this request if it lies in its 24 FPS frame.
        presentedForRequest = Math.abs(metadata.mediaTime - requestTime) < 1 / 24 + 0.001
          ? requestTime : null
        if (presentedForRequest !== null) {
          if (confirmationTimer !== null) window.clearTimeout(confirmationTimer)
          confirmationTimer = null
        }
        if (counters) counters.frameConfirmations++
        if (!video.seeking) seekInFlight = false
        publish()
        wake()
      })
    }
    // Hidden/paused videos need not produce a compositor callback. One bounded
    // check releases a missed completion; media events resume stalled loading.
    confirmationTimer = window.setTimeout(() => {
      confirmationTimer = null
      if (disposed || token !== generation) return
      if (frameCallback !== null) video.cancelVideoFrameCallback?.(frameCallback)
      frameCallback = null
      if (!video.seeking) {
        seekInFlight = false
        if (video.readyState >= 2 && Math.abs(video.currentTime - requestTime) <= epsilonSeconds) {
          fallbackPosition = video.currentTime
        }
        if (counters) counters.fallbackConfirmations++
        publish()
        wake()
      }
    }, 250)
  }
  const events = ['loadedmetadata', 'loadeddata', 'canplay'] as const
  const onData = () => {
    if (video.readyState >= 2 && !video.seeking &&
      confirmationPosition !== null && frameCallback === null && confirmationTimer === null &&
      Math.abs(video.currentTime - confirmationPosition) <= epsilonSeconds) {
      fallbackPosition = video.currentTime
    }
    wake()
  }
  events.forEach(event => video.addEventListener(event, onData))
  video.addEventListener('seeked', onSeeked)
  const onEmptied = () => {
    // src mutation/flush already reset this replacement. The following emptied
    // event must not invalidate the same generation a second time.
    if (source === video.getAttribute('src') && requestedTime === null &&
      presentedTime === null && confirmationPosition === null && !seekInFlight) {
      wake()
    } else reset()
  }
  video.addEventListener('emptied', onEmptied)
  const observer = new MutationObserver(() => {
    if (source !== video.getAttribute('src')) reset()
  })
  observer.observe(video, { attributes: true, attributeFilter: ['src'] })

  return {
    setTarget(time: number) {
      if (!Number.isFinite(time) || disposed) return
      active = true
      if (time !== targetTime) {
        if (counters) {
          counters.targetUpdates++
          if (seekInFlight && targetTime !== null && targetTime !== requestedTime) {
            counters.coalesced++
          }
        }
        targetTime = time
      }
    },
    // Called only inside the owning controller's RAF, including intro fallback.
    flush() {
      if (source !== video.getAttribute('src')) reset()
      if (counters) counters.flushes++
      if (!active || targetTime === null || disposed || video.readyState < 1) {
        publish()
        return false
      }
      const duration = Number.isFinite(video.duration) ? video.duration : targetTime
      const target = clamp(targetTime, 0, Math.max(0, duration - 0.001))
      if (video.seeking) {
        seekInFlight = true
        publish()
        return false
      }
      // A later scroll/media RAF can recover even if a completion event was lost.
      seekInFlight = false
      const near = (time: number | null) => time !== null &&
        Math.abs(time - target) <= epsilonSeconds
      // A displayed frame may differ from the requested timestamp by up to a
      // frame. Only trust that frame while currentTime still matches our request.
      const ownsPosition = requestedTime !== null &&
        presentedForRequest === requestedTime &&
        Math.abs(video.currentTime - requestedTime) <= epsilonSeconds
      if (near(video.currentTime) || (ownsPosition && near(presentedTime))) {
        // Landing transitions also need a confirmation for an unchanged frame
        // (notably the initial 0 s frame). Internal-page behavior is unchanged.
        if (options.confirmUnchangedFrames && confirmationPosition === null) {
          armConfirmation(video.currentTime)
        }
        if (counters) counters.equivalent++
        publish()
        return true
      }
      presentedForRequest = null
      armConfirmation(target)
      try {
        video.currentTime = target
        requestedTime = target
        seekInFlight = true
        if (counters) counters.assignments++
      } catch {
        cancelConfirmation()
        seekInFlight = false
        // Metadata/media events or new scroll input can retry, never an idle loop.
      }
      publish()
      return false
    },
    confirmFrame() {
      // Internal pages opt in only while replacing a source. Normal same-profile
      // scrolling keeps its existing scheduler behavior.
      if (active && !disposed && video.readyState >= 1 && !video.seeking && confirmationPosition === null) {
        armConfirmation(video.currentTime)
        publish()
      }
    },
    getFrameReadiness(time: number): 'presented' | 'fallback' | 'pending' {
      if (disposed || source !== video.getAttribute('src') || video.readyState < 2 || video.seeking) {
        return 'pending'
      }
      const duration = Number.isFinite(video.duration) ? video.duration : time
      const target = clamp(time, 0, Math.max(0, duration - 0.001))
      const atTarget = Math.abs(video.currentTime - target) <= epsilonSeconds
      if (presentedTime !== null && presentedForRequest !== null &&
        Math.abs(video.currentTime - presentedForRequest) <= epsilonSeconds &&
        ((atTarget && Math.abs(presentedTime - target) < 1 / 24 + 0.001) ||
          Math.abs(presentedTime - target) <= epsilonSeconds)) return 'presented'
      if (fallbackPosition !== null && atTarget &&
        Math.abs(video.currentTime - fallbackPosition) <= epsilonSeconds) return 'fallback'
      return 'pending'
    },
    suspend() {
      active = false
      cancelConfirmation()
      seekInFlight = false
      requestedTime = null
      presentedTime = null
      presentedForRequest = null
      confirmationPosition = null
      fallbackPosition = null
      publish()
    },
    dispose() {
      disposed = true
      cancelConfirmation()
      observer.disconnect()
      events.forEach(event => video.removeEventListener(event, onData))
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('emptied', onEmptied)
      if (counters) delete video.dataset.cinematicSeek
    },
  }
}
