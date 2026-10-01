'use client'

import { useEffect, type RefObject } from 'react'
import { createCinematicSourceSwitch } from '@/components/cinematic/cinematic-source-switch'
import {
  clamp,
  createVideoSeekScheduler,
  smoothstep,
} from '@/components/cinematic/cinematic-video-utils'
import type { CinematicPageConfig } from '@/config/cinematic-pages'
import { cinematicConfig } from '@/config/cinematic-scenes'
import {
  resolveCinematicVideoSource,
  type CinematicMediaProfile,
} from '@/components/cinematic/use-responsive-cinematic-sources'

type CinematicPageControllerRefs = {
  rootRef: RefObject<HTMLDivElement | null>
  videoRef: RefObject<HTMLVideoElement | null>
  debugRef: RefObject<HTMLPreElement | null>
  config: CinematicPageConfig
  getMediaProfile: () => CinematicMediaProfile
}

type ContentRange = {
  element: HTMLElement
  start: number
  height: number
}

export function useCinematicPageController({
  rootRef,
  videoRef,
  debugRef,
  config,
  getMediaProfile,
}: CinematicPageControllerRefs) {
  useEffect(() => {
    const rootNode = rootRef.current
    const videoNode = videoRef.current
    if (!rootNode || !videoNode) return
    const root: HTMLDivElement = rootNode
    const video: HTMLVideoElement = videoNode
    const source = resolveCinematicVideoSource(video, getMediaProfile())
    if (!video.getAttribute('src') && source) {
      video.src = source
      video.dataset.activeSrc = source
    }

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    let reducedMotion = reducedMotionQuery.matches
    let contentRanges: ContentRange[] = []
    let timelineStart = 0
    let timelineEnd = 1
    let layoutDirty = true
    let frameId: number | null = null
    let disposed = false

    const measure = () => {
      const rootRect = root.getBoundingClientRect()
      const rootStart = rootRect.top + window.scrollY
      const footer = root.querySelector<HTMLElement>(
        '[data-cinematic-page-footer]',
      )
      const footerStart = footer
        ? footer.getBoundingClientRect().top + window.scrollY
        : rootRect.bottom + window.scrollY

      timelineStart =
        rootStart + config.scroll.startViewportOffset * window.innerHeight
      timelineEnd = Math.max(
        timelineStart + 1,
        footerStart -
          config.scroll.endBeforeFooterViewport * window.innerHeight,
      )

      contentRanges = Array.from(
        root.querySelectorAll<HTMLElement>(
          '[data-cinematic-page-content] > section',
        ),
      ).map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          element,
          start: rect.top + window.scrollY,
          height: rect.height,
        }
      })

      layoutDirty = false
    }

    const requestFrame = () => {
      if (frameId !== null || disposed) return
      frameId = window.requestAnimationFrame(render)
    }

    const seekScheduler = createVideoSeekScheduler(video, requestFrame, cinematicConfig.seekEpsilonSeconds)
    const sourceSwitch = createCinematicSourceSwitch(root, [video], getMediaProfile,
      requestFrame, () => seekScheduler)

    const setContentPresence = (scrollY: number) => {
      for (const range of contentRanges) {
        if (reducedMotion) {
          range.element.style.setProperty(
            '--cinematic-page-content-opacity',
            '1',
          )
          range.element.style.setProperty(
            '--cinematic-page-content-shift',
            '0px',
          )
          continue
        }

        const viewportCenter = scrollY + window.innerHeight / 2
        const sectionCenter = range.start + range.height / 2
        const distance = Math.abs(viewportCenter - sectionCenter)
        const falloff = Math.max(
          window.innerHeight * config.content.focusFalloff,
          range.height * 0.72,
        )
        const away = smoothstep(0.18, 1, distance / falloff)
        const opacity = 1 - away * (1 - config.content.minimumOpacity)
        const shift = away * config.content.travelPixels

        range.element.style.setProperty(
          '--cinematic-page-content-opacity',
          opacity.toFixed(4),
        )
        range.element.style.setProperty(
          '--cinematic-page-content-shift',
          `${shift.toFixed(2)}px`,
        )
      }
    }

    function render() {
      frameId = null
      if (layoutDirty) measure()

      const progress = clamp(
        (window.scrollY - timelineStart) /
          Math.max(timelineEnd - timelineStart, 1),
      )
      const target =
        config.durationSeconds *
        (reducedMotion ? config.reducedMotionFrame : progress)

      root.style.setProperty(
        '--cinematic-page-progress',
        progress.toFixed(4),
      )
      root.dataset.cinematicProgress = progress.toFixed(4)
      setContentPresence(window.scrollY)

      const targets = new Map([[video, target]])
      sourceSwitch.sync(targets)
      seekScheduler.setTarget(target)
      if (seekScheduler.flush()) root.dataset.videoReady = 'true'
      sourceSwitch.finish(targets)

      const debug = debugRef.current
      if (debug) {
        debug.textContent = [
          `progress  ${progress.toFixed(3)}`,
          `video     ${(video.dataset.activeSrc ?? config.desktopSrc).split('/').at(-1)}`,
          `time      ${video.currentTime.toFixed(2)} / ${config.durationSeconds.toFixed(2)}s`,
          `page      ${config.label}`,
        ].join('\n')
      }

    }

    const onResize = () => {
      layoutDirty = true
      requestFrame()
    }
    const onMediaChange = () => {
      reducedMotion = reducedMotionQuery.matches
      root.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
      layoutDirty = true
      requestFrame()
    }
    const onReady = () => {
      video.pause()
      requestFrame()
    }

    root.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
    video.pause()
    video.addEventListener('loadedmetadata', onReady)
    video.addEventListener('canplay', onReady)
    video.addEventListener('seeked', requestFrame)
    window.addEventListener('scroll', requestFrame, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    reducedMotionQuery.addEventListener('change', onMediaChange)

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onReady()
    requestFrame()

    return () => {
      disposed = true
      sourceSwitch.dispose()
      seekScheduler.dispose()
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      video.pause()
      video.removeEventListener('loadedmetadata', onReady)
      video.removeEventListener('canplay', onReady)
      video.removeEventListener('seeked', requestFrame)
      window.removeEventListener('scroll', requestFrame)
      window.removeEventListener('resize', onResize)
      reducedMotionQuery.removeEventListener('change', onMediaChange)
    }
  }, [config, debugRef, getMediaProfile, rootRef, videoRef])
}
