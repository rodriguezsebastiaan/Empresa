'use client'

import {
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { useCinematicPageController } from '@/components/cinematic/use-cinematic-page-controller'
import { useResponsiveCinematicSources } from '@/components/cinematic/use-responsive-cinematic-sources'
import type { CinematicPageConfig } from '@/config/cinematic-pages'
import { cn } from '@/lib/utils'

type CinematicPageProps = {
  children: ReactNode
  className?: string
  config: CinematicPageConfig
}

export function CinematicPage({
  children,
  className,
  config,
}: CinematicPageProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const debugRef = useRef<HTMLPreElement | null>(null)
  const getMediaProfile = useResponsiveCinematicSources(rootRef)

  useCinematicPageController({
    rootRef,
    videoRef,
    debugRef,
    config,
    getMediaProfile,
  })

  return (
    <div
      ref={rootRef}
      className={cn('ks-cinematic-page-root', className)}
      data-cinematic-page={config.id}
      data-cinematic-route={config.route}
      data-video-ready="false"
    >
      <div className="ks-cinematic-page-stage" aria-hidden="true">
        <video
          ref={videoRef}
          className="ks-cinematic-page-video"
          data-cinematic-page-video={config.desktopSrc}
          data-cinematic-responsive-video
          data-cinematic-eager="true"
          data-desktop-src={config.desktopSrc}
          data-mobile-src={config.mobileSrc}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          style={
            {
              ['--cinematic-object-position' as string]: config.objectPosition,
              ['--cinematic-object-position-mobile' as string]:
                config.mobileObjectPosition,
            } as CSSProperties
          }
        />
        <div
          className="ks-cinematic-page-overlay"
          data-overlay={config.overlay}
        />
      </div>

      <div className="ks-cinematic-page-foreground">{children}</div>

      {process.env.NODE_ENV !== 'production' ? (
        <pre
          ref={debugRef}
          className="ks-cinematic-debug"
          aria-hidden="true"
        />
      ) : null}
    </div>
  )
}
