'use client'

import {
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cinematicConfig } from '@/config/cinematic-scenes'
import { useCinematicController } from '@/components/cinematic/use-cinematic-controller'
import { useResponsiveCinematicSources } from '@/components/cinematic/use-responsive-cinematic-sources'

type CinematicLandingProps = {
  children: ReactNode
}

export function CinematicLanding({ children }: CinematicLandingProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const debugRef = useRef<HTMLPreElement | null>(null)

  const getMediaProfile = useResponsiveCinematicSources(rootRef)
  useCinematicController({ rootRef, debugRef, getMediaProfile })

  return (
    <div
      ref={rootRef}
      className="ks-cinematic-root"
      data-intro-state="pending"
    >
      <div className="ks-cinematic-stage" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        {cinematicConfig.scenes.map((scene) => (
          <video
            key={scene.id}
            className="ks-cinematic-video"
            data-cinematic-video={scene.index}
            data-cinematic-responsive-video
            data-cinematic-eager={scene.index <= 1 ? 'true' : undefined}
            data-desktop-src={scene.desktopSrc}
            data-mobile-src={scene.mobileSrc}
            muted
            playsInline
            preload={scene.index <= 1 ? 'auto' : 'none'}
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            style={
              {
                opacity: scene.index === 0 ? 1 : 0,
                ['--cinematic-object-position' as string]: scene.objectPosition,
                ['--cinematic-object-position-mobile' as string]:
                  scene.mobileObjectPosition,
              } as CSSProperties
            }
          />
        ))}
        <div className="ks-cinematic-overlay" />
      </div>

      <div
        className="ks-cinematic-intro-runway"
        data-cinematic-intro
        aria-hidden="true"
      />

      <div className="ks-cinematic-content">{children}</div>

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
