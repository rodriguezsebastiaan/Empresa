'use client'

import { useEffect, type RefObject } from 'react'
import { createCinematicSourceSwitch } from '@/components/cinematic/cinematic-source-switch'
import { createTransitionDiagnostics } from '@/components/cinematic/cinematic-transition-diagnostics'
import { createCinematicLayerWriter, getCinematicBlend } from '@/components/cinematic/cinematic-transition-utils'
import {
  clamp,
  createVideoSeekScheduler,
  smoothstep,
} from '@/components/cinematic/cinematic-video-utils'
import {
  cinematicConfig,
  type CinematicScene,
} from '@/config/cinematic-scenes'
import {
  resolveCinematicVideoSource,
  type CinematicMediaProfile,
} from '@/components/cinematic/use-responsive-cinematic-sources'

type CinematicControllerRefs = {
  rootRef: RefObject<HTMLDivElement | null>
  debugRef: RefObject<HTMLPreElement | null>
  getMediaProfile: () => CinematicMediaProfile
}

type SectionRange = {
  scene: CinematicScene
  element: HTMLElement
  start: number
  end: number
  height: number
}

// This exists only for the lifetime of the loaded document. A full refresh
// creates a fresh module and replays Video0; client navigation does not.
let landingIntroStartedInDocument = false
let landingHeroBoundaryReachedInDocument = false

export function useCinematicController({
  rootRef,
  debugRef,
  getMediaProfile,
}: CinematicControllerRefs) {
  useEffect(() => {
    const rootNode = rootRef.current
    if (!rootNode) return
    const root: HTMLDivElement = rootNode
    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>('[data-cinematic-video]'),
    )

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    let reducedMotion = reducedMotionQuery.matches
    let ranges: SectionRange[] = []
    let rootStart = 0
    let introEnd = 0
    let timelineEnd = 1
    let layoutDirty = true
    let frameId: number | null = null
    let introFrameId: number | null = null
    let introStartTimer: number | null = null
    let introRunning = false
    let introFallbackStart: number | null = null
    let introPlaybackStarted = false
    let heroBoundaryReached = landingHeroBoundaryReachedInDocument
    let introReboundTimer: number | null = null
    let introReboundSettleTimer: number | null = null
    let introReboundInProgress = false
    let disposed = false

    const sectionScenes: readonly CinematicScene[] =
      cinematicConfig.scenes.filter((scene) => scene.sectionId !== null)

    const ensurePrepared = (index: number) => {
      const video = videos[index]
      if (!video || video.dataset.prepared === 'true') return

      const source = resolveCinematicVideoSource(video, getMediaProfile())
      if (!video.getAttribute('src') && source) {
        video.src = source
        video.dataset.activeSrc = source
      }
      video.preload = 'auto'
      video.dataset.prepared = 'true'
      video.load()
    }

    const measure = () => {
      const rootRect = root.getBoundingClientRect()
      rootStart = rootRect.top + window.scrollY

      const measured = sectionScenes.flatMap((scene) => {
        if (scene.sectionId === null) return []
        const element = document.getElementById(scene.sectionId)
        if (!element) return []
        const rect = element.getBoundingClientRect()
        return [
          {
            scene,
            element,
            start: rect.top + window.scrollY,
            end: rect.bottom + window.scrollY,
            height: rect.height,
          },
        ]
      })

      ranges = measured.map((range, index) => ({
        ...range,
        end: measured[index + 1]?.start ?? range.end,
      }))
      introEnd = ranges[0]?.start ?? rootStart
      timelineEnd = Math.max(ranges.at(-1)?.end ?? introEnd, introEnd + 1)
      layoutDirty = false
    }

    const requestFrame = () => {
      if (frameId !== null || disposed) return
      frameId = window.requestAnimationFrame(render)
    }

    const seekSchedulers = videos.map(video =>
      createVideoSeekScheduler(video, requestFrame, cinematicConfig.seekEpsilonSeconds,
        { confirmUnchangedFrames: true }),
    )
    const transitionDiagnostics = createTransitionDiagnostics(root, videos)
    const sourceSwitch = createCinematicSourceSwitch(root, videos, getMediaProfile,
      requestFrame, video => seekSchedulers[videos.indexOf(video)])
    const layerWriter = createCinematicLayerWriter(videos)
    let scheduledLayers = new Set<number>()
    let heldLayer: { index: number; source: string | null } | null = null
    let enteredScene: { index: number; source: string | null } | null = null
    let previousScene = -1
    let delayedFor: number | null = null
    const readiness = new Map<number, string>()
    const preparationTargets = new Map<number, number>()

    const clearIntroReboundTimers = () => {
      if (introReboundTimer !== null) {
        window.clearTimeout(introReboundTimer)
        introReboundTimer = null
      }
      if (introReboundSettleTimer !== null) {
        window.clearTimeout(introReboundSettleTimer)
        introReboundSettleTimer = null
      }
    }

    const scheduleIntroRebound = (scrollY = window.scrollY) => {
      if (
        disposed ||
        !heroBoundaryReached ||
        introRunning ||
        introReboundInProgress ||
        Boolean(window.location.hash) ||
        scrollY >=
          introEnd - cinematicConfig.introReboundTolerancePx
      ) {
        return
      }

      if (introReboundTimer !== null) {
        window.clearTimeout(introReboundTimer)
      }

      introReboundTimer = window.setTimeout(
        () => {
          introReboundTimer = null
          if (
            disposed ||
            !heroBoundaryReached ||
            introRunning ||
            Boolean(window.location.hash) ||
            window.scrollY >=
              introEnd - cinematicConfig.introReboundTolerancePx
          ) {
            return
          }

          introReboundInProgress = true
          window.scrollTo({
            top: introEnd,
            left: 0,
            behavior: reducedMotion ? 'auto' : 'smooth',
          })

          introReboundSettleTimer = window.setTimeout(
            () => {
              introReboundInProgress = false
              introReboundSettleTimer = null
              scheduleIntroRebound()
            },
            reducedMotion ? 0 : cinematicConfig.introReboundSettleMs,
          )
        },
        reducedMotion ? 0 : cinematicConfig.introReboundDelayMs,
      )
    }

    const setContentPresence = (
      scrollY: number,
      introReveal: number,
      viewportHeight: number,
    ) => {
      const viewportCenter = scrollY + viewportHeight / 2

      for (const range of ranges) {
        const sectionCenter = range.start + range.height / 2
        const distance = Math.abs(viewportCenter - sectionCenter)
        const falloff = Math.max(viewportHeight, range.height * 0.82)
        const fade = smoothstep(0.08, 1, distance / falloff)
        let opacity =
          1 - fade * (1 - cinematicConfig.contentMinimumOpacity)

        if (range.scene.id === 'hero') opacity *= introReveal

        const content = range.element.querySelector<HTMLElement>(
          ':scope > .ks-scene-content',
        )
        if (!content) continue
        content.style.setProperty(
          '--cinematic-content-opacity',
          opacity.toFixed(4),
        )
        content.style.setProperty(
          '--cinematic-content-shift',
          `${((1 - opacity) * 12).toFixed(2)}px`,
        )
      }
    }

    const renderVideos = (
      activeIndex: number,
      localProgress: number,
    ) => {
      const targets = cinematicConfig.scenes.map<number | null>(() => null)
      const currentScene = cinematicConfig.scenes[activeIndex]
      targets[activeIndex] = reducedMotion
        ? currentScene.durationSeconds * currentScene.reducedMotionFrame
        : currentScene.durationSeconds * localProgress
      if (activeIndex > 0) {
        const previous = cinematicConfig.scenes[activeIndex - 1]
        targets[activeIndex - 1] = previous.durationSeconds *
          (reducedMotion ? previous.reducedMotionFrame : 1)
      }
      if (activeIndex < videos.length - 1 &&
        (activeIndex === 0 || localProgress >= cinematicConfig.preloadNextAtProgress)) {
        const next = cinematicConfig.scenes[activeIndex + 1]
        targets[activeIndex + 1] = reducedMotion
          ? next.durationSeconds * next.reducedMotionFrame : 0
      }
      const preparing = new Set<number>()
      sourceSwitch.sync(new Map(targets.flatMap((target, index) => target === null
        ? [] : [[videos[index], target] as const])), introRunning || root.dataset.introState === 'pending')
      targets.forEach((target, index) => {
        if (target === null) return
        preparing.add(index)
        if (!(introRunning && index === 0)) {
          seekSchedulers[index].setTarget(target)
          seekSchedulers[index].flush()
          if (index !== activeIndex && preparationTargets.get(index) !== target) {
            transitionDiagnostics?.trace('incoming-target', index, { target })
            preparationTargets.set(index, target)
          }
        }
      })
      for (const index of scheduledLayers) {
        if (!preparing.has(index)) {
          seekSchedulers[index].suspend()
          readiness.delete(index)
          preparationTargets.delete(index)
        }
      }
      scheduledLayers = preparing

      const ready = new Set<number>()
      for (const index of preparing) {
        const target = targets[index]!
        const state = index === 0 && introRunning && introPlaybackStarted
          ? (videos[0].readyState >= HTMLMediaElement.HAVE_CURRENT_DATA ? 'playback' : 'pending')
          : seekSchedulers[index].getFrameReadiness(target)
        if (state !== 'pending') ready.add(index)
        if (readiness.get(index) !== state) {
          transitionDiagnostics?.trace(state === 'pending' ? 'frame-pending' : 'frame-ready', index,
            { target, confirmation: state })
          readiness.set(index, state)
        }
      }
      if (activeIndex !== previousScene) enteredScene = null
      previousScene = activeIndex
      const activeSource = videos[activeIndex].getAttribute('src')
      if (ready.has(activeIndex)) enteredScene = { index: activeIndex, source: activeSource }
      // An already entered outgoing scene keeps its valid displayed frame while
      // normal Step 3B scrubbing advances. Newly entered layers still need proof.
      const activeEntered = enteredScene?.index === activeIndex && enteredScene.source === activeSource &&
        videos[activeIndex].readyState >= HTMLMediaElement.HAVE_METADATA
      // A native seek can temporarily lower readyState to HAVE_METADATA while
      // the compositor retains the last valid frame. Keep that outgoing layer.
      if (heldLayer && videos[heldLayer.index].getAttribute('src') !== heldLayer.source) heldLayer = null

      const blend = getCinematicBlend({
        count: videos.length, activeIndex, progress: localProgress,
        width: cinematicConfig.crossfadeProgress,
        boundaryOpacity: cinematicConfig.incomingBoundaryOpacity,
        isReady: index => ready.has(index) || (index === activeIndex && activeEntered),
        heldIndex: heldLayer?.index ?? null,
      })
      if (blend.waitingFor !== delayedFor) {
        if (blend.waitingFor !== null) {
          transitionDiagnostics?.trace('transition-delayed', blend.waitingFor,
            { heldIndex: heldLayer?.index ?? null })
        }
        delayedFor = blend.waitingFor
      }
      if (ready.has(activeIndex) || activeEntered) {
        const dominant = blend.opacity.indexOf(Math.max(...blend.opacity))
        heldLayer = { index: dominant, source: videos[dominant].getAttribute('src') }
      }
      const warm = new Set<number>([activeIndex])
      if (activeIndex > 0) warm.add(activeIndex - 1)
      if (activeIndex < videos.length - 1) warm.add(activeIndex + 1)
      const work = layerWriter.apply(blend.opacity, warm)
      transitionDiagnostics?.styleWork(work.writes, work.avoided, work.hintWrites)
      transitionDiagnostics?.layers(blend.opacity, targets)
      // Removal is atomic with this render's exact scroll blend, and requires
      // readiness of every semantically visible layer, including both in a fade.
      if (sourceSwitch.needsReadiness()) {
        const semantic = getCinematicBlend({ count: videos.length, activeIndex,
          progress: localProgress, width: cinematicConfig.crossfadeProgress,
          boundaryOpacity: cinematicConfig.incomingBoundaryOpacity, isReady: () => true, heldIndex: null })
        sourceSwitch.finish(new Map(semantic.opacity.flatMap((value, index) => value > 0 && targets[index] !== null
          ? [[videos[index], targets[index]!] as const] : [])))
      }
    }

    function render() {
      frameId = null
      if (layoutDirty) measure()

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      let activeIndex = 0
      let localProgress = clamp(
        (scrollY - rootStart) / Math.max(introEnd - rootStart, 1),
      )

      if (scrollY >= introEnd && ranges.length > 0) {
        const activeRange =
          ranges.find(
            (range) => scrollY >= range.start && scrollY < range.end,
          ) ?? ranges.at(-1)!
        activeIndex = activeRange.scene.index
        localProgress = clamp(
          (scrollY - activeRange.start) /
            Math.max(activeRange.end - activeRange.start, 1),
        )
      }

      if (
        !introRunning &&
        root.dataset.introState !== 'pending' &&
        root.dataset.introState !== 'running' &&
        scrollY >= introEnd
      ) {
        heroBoundaryReached = true
        landingHeroBoundaryReachedInDocument = true
      }

      transitionDiagnostics?.sample(activeIndex, localProgress)
      ensurePrepared(activeIndex)
      if (activeIndex > 0) ensurePrepared(activeIndex - 1)
      if (
        localProgress >= cinematicConfig.preloadNextAtProgress &&
        activeIndex < cinematicConfig.scenes.length - 1
      ) {
        ensurePrepared(activeIndex + 1)
      }

      const introReveal =
        root.dataset.introState === 'skipped' || scrollY >= introEnd
          ? 1
          : smoothstep(0.68, 0.98, localProgress)
      const globalProgress = clamp(
        (scrollY - rootStart) / Math.max(timelineEnd - rootStart, 1),
      )

      root.style.setProperty(
        '--cinematic-global-progress',
        globalProgress.toFixed(4),
      )
      root.style.setProperty(
        '--cinematic-intro-reveal',
        introReveal.toFixed(4),
      )
      setContentPresence(scrollY, introReveal, viewportHeight)
      renderVideos(activeIndex, localProgress)
      scheduleIntroRebound(scrollY)

      const debug = debugRef.current
      if (debug) {
        const video = videos[activeIndex]
        const currentTime = video?.currentTime ?? 0
        debug.textContent = [
          `progress  ${globalProgress.toFixed(3)}`,
          `video     ${activeIndex}`,
          `time      ${currentTime.toFixed(2)} / ${cinematicConfig.scenes[activeIndex].durationSeconds.toFixed(2)}s`,
          `section   ${cinematicConfig.scenes[activeIndex].label}`,
        ].join('\n')
      }

    }

    const stopAutomaticScroll = (state: 'complete' | 'interrupted') => {
      if (introStartTimer !== null) {
        window.clearTimeout(introStartTimer)
        introStartTimer = null
      }
      if (introFrameId !== null) {
        window.cancelAnimationFrame(introFrameId)
        introFrameId = null
      }
      introRunning = false
      introPlaybackStarted = false
      videos[0]?.pause()
      document.documentElement.removeAttribute('data-cinematic-autoscroll')
      root.dataset.introState = state
      requestFrame()
    }

    const completeIntro = () => {
      measure()
      window.scrollTo({ top: introEnd, left: 0, behavior: 'auto' })
      stopAutomaticScroll('complete')
    }

    const tickIntro = (now: number) => {
      if (!introRunning || disposed) return
      const video = videos[0]
      if (!video) {
        stopAutomaticScroll('interrupted')
        return
      }

      let progress = 0
      if (introPlaybackStarted) {
        progress = clamp(
          video.currentTime /
            (Number.isFinite(video.duration)
              ? video.duration
              : cinematicConfig.scenes[0].durationSeconds),
        )
      } else if (introFallbackStart !== null) {
        progress = clamp(
          (now - introFallbackStart) / cinematicConfig.introDurationMs,
        )
        seekSchedulers[0].setTarget(progress * cinematicConfig.scenes[0].durationSeconds)
        seekSchedulers[0].flush()
      }

      window.scrollTo({
        top: rootStart + (introEnd - rootStart) * progress,
        left: 0,
        behavior: 'auto',
      })
      requestFrame()

      if (progress >= 0.999 || video.ended) {
        completeIntro()
        return
      }
      introFrameId = window.requestAnimationFrame(tickIntro)
    }

    const startIntro = () => {
      if (disposed || reducedMotion || landingIntroStartedInDocument) return
      if (window.scrollY > rootStart + 2 || window.location.hash) return

      measure()
      const introVideo = videos[0]
      if (!introVideo) return

      landingIntroStartedInDocument = true

      ensurePrepared(0)
      ensurePrepared(1)
      seekSchedulers[0].suspend()
      introVideo.currentTime = 0
      introVideo.playbackRate = 1
      introRunning = true
      root.dataset.introState = 'running'
      document.documentElement.setAttribute(
        'data-cinematic-autoscroll',
        'true',
      )

      const playResult = introVideo.play()
      if (playResult) {
        playResult
          .then(() => {
            if (!introRunning) return
            introPlaybackStarted = true
          })
          .catch(() => {
            if (!introRunning) return
            introFallbackStart = performance.now()
          })
      } else {
        introFallbackStart = performance.now()
      }

      introFrameId = window.requestAnimationFrame(tickIntro)
    }

    const cancelForUserInput = (event: Event) => {
      if (!introRunning && introStartTimer === null) return
      if (
        event instanceof KeyboardEvent &&
        ![
          'ArrowDown',
          'ArrowUp',
          'PageDown',
          'PageUp',
          'Home',
          'End',
          ' ',
        ].includes(event.key)
      ) {
        return
      }
      stopAutomaticScroll('interrupted')
    }

    const onScroll = () => requestFrame()
    const onResize = () => {
      layoutDirty = true
      requestFrame()
    }
    const onMediaChange = () => {
      reducedMotion = reducedMotionQuery.matches
      if (reducedMotion) {
        if (introRunning || introStartTimer !== null) {
          stopAutomaticScroll('interrupted')
        }
        root.dataset.introState = 'skipped'
      }
      layoutDirty = true
      requestFrame()
    }

    const mediaEvents = ['loadedmetadata', 'canplay', 'seeked'] as const
    const invalidateFrame = (event: Event) => {
      const index = videos.indexOf(event.currentTarget as HTMLVideoElement)
      if (heldLayer?.index === index) heldLayer = null
      if (enteredScene?.index === index) enteredScene = null
      requestFrame()
    }
    videos.forEach((video) => {
      if (!video) return
      mediaEvents.forEach((eventName) =>
        video.addEventListener(eventName, requestFrame),
      )
      video.addEventListener('emptied', invalidateFrame)
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('wheel', cancelForUserInput, {
      passive: true,
      capture: true,
    })
    window.addEventListener('touchstart', cancelForUserInput, {
      passive: true,
      capture: true,
    })
    window.addEventListener('pointerdown', cancelForUserInput, {
      passive: true,
      capture: true,
    })
    window.addEventListener('keydown', cancelForUserInput, true)
    reducedMotionQuery.addEventListener('change', onMediaChange)

    ensurePrepared(0)
    ensurePrepared(1)

    const shouldSkipIntro =
      reducedMotion ||
      landingIntroStartedInDocument ||
      window.scrollY > rootStart + 2 ||
      Boolean(window.location.hash)

    if (shouldSkipIntro) {
      root.dataset.introState = 'skipped'
      if (window.scrollY <= 2 && !window.location.hash) {
        layoutDirty = true
      }
    } else {
      introStartTimer = window.setTimeout(() => {
        introStartTimer = null
        startIntro()
      }, 0)
    }

    requestFrame()

    return () => {
      disposed = true
      sourceSwitch.dispose()
      transitionDiagnostics?.dispose()
      seekSchedulers.forEach(scheduler => scheduler.dispose())
      videos.forEach(video => video.removeEventListener('emptied', invalidateFrame))
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      if (introFrameId !== null) window.cancelAnimationFrame(introFrameId)
      if (introStartTimer !== null) window.clearTimeout(introStartTimer)
      clearIntroReboundTimers()
      videos[0]?.pause()
      document.documentElement.removeAttribute('data-cinematic-autoscroll')
      mediaEvents.forEach((eventName) => {
        videos.forEach((video) =>
          video.removeEventListener(eventName, requestFrame),
        )
      })
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('wheel', cancelForUserInput, true)
      window.removeEventListener('touchstart', cancelForUserInput, true)
      window.removeEventListener('pointerdown', cancelForUserInput, true)
      window.removeEventListener('keydown', cancelForUserInput, true)
      reducedMotionQuery.removeEventListener('change', onMediaChange)
    }
  }, [debugRef, getMediaProfile, rootRef])
}
