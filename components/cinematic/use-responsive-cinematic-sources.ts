'use client'

import { useCallback, useEffect, useRef, type RefObject } from 'react'

export type CinematicMediaProfile = 'desktop' | 'mobile'
export const cinematicProfileChangeEvent = 'cinematicprofilechange'

const MOBILE_BREAKPOINT_QUERY = '(max-width: 767px)'

function readMediaProfile(): CinematicMediaProfile {
  try {
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches
        ? 'mobile'
        : 'desktop'
    }
  } catch {
    // Fall back to the viewport width if matchMedia is unavailable or throws.
  }

  return window.innerWidth <= 767 ? 'mobile' : 'desktop'
}

function resolveVideoSource(
  video: HTMLVideoElement,
  profile: CinematicMediaProfile,
) {
  return profile === 'mobile'
    ? video.dataset.mobileSrc
    : video.dataset.desktopSrc
}

function setVideoSource(
  video: HTMLVideoElement,
  profile: CinematicMediaProfile,
) {
  const source = resolveVideoSource(video, profile)
  if (!source || video.dataset.activeSrc === source) return

  video.dataset.activeSrc = source
  video.src = source
}

export function resolveCinematicVideoSource(
  video: HTMLVideoElement,
  profile: CinematicMediaProfile,
) {
  return resolveVideoSource(video, profile)
}

export function useResponsiveCinematicSources(
  rootRef: RefObject<HTMLElement | null>,
) {
  const profileRef = useRef<CinematicMediaProfile>('desktop')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>(
        '[data-cinematic-responsive-video]',
      ),
    )
    profileRef.current = readMediaProfile()

    videos.forEach((video) => {
      if (video.dataset.cinematicEager === 'true') {
        setVideoSource(video, profileRef.current)
      }
    })

    const updateProfile = (nextProfile: CinematicMediaProfile) => {
      if (profileRef.current === nextProfile) return
      profileRef.current = nextProfile

      // The owning controller remeasures, freezes the visible result and swaps
      // only its relevant attached scenes. It also owns all restoration seeks.
      root.dispatchEvent(new Event(cinematicProfileChangeEvent))
    }

    let mediaQuery: MediaQueryList | null = null
    try {
      if (typeof window.matchMedia === 'function') {
        mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY)
      }
    } catch {
      mediaQuery = null
    }

    const onResize = () => updateProfile(readMediaProfile())
    const onMediaChange = (event: MediaQueryListEvent) =>
      updateProfile(event.matches ? 'mobile' : 'desktop')

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', onMediaChange)
    } else {
      window.addEventListener('resize', onResize, { passive: true })
    }

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', onMediaChange)
      } else {
        window.removeEventListener('resize', onResize)
      }
    }
  }, [rootRef])

  return useCallback(() => profileRef.current, [])
}
