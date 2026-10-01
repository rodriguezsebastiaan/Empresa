import {
  cinematicMediaSources,
  type CinematicMediaSources,
} from '@/config/cinematic-scenes'

export type CinematicPageId =
  | 'solutions'
  | 'services'
  | 'process'
  | 'about'
  | 'contact'

export type CinematicPageConfig = CinematicMediaSources & {
  id: CinematicPageId
  route: string
  label: string
  durationSeconds: number
  objectPosition: string
  mobileObjectPosition: string
  reducedMotionFrame: number
  scroll: {
    startViewportOffset: number
    endBeforeFooterViewport: number
  }
  content: {
    minimumOpacity: number
    travelPixels: number
    focusFalloff: number
  }
  overlay: 'balanced' | 'strong'
}

export const cinematicPageConfig = {
  solutions: {
    id: 'solutions',
    route: '/soluciones',
    label: 'Soluciones',
    ...cinematicMediaSources.video3,
    durationSeconds: 6,
    objectPosition: '52% 50%',
    mobileObjectPosition: '57% 51%',
    reducedMotionFrame: 0.5,
    scroll: {
      startViewportOffset: 0,
      endBeforeFooterViewport: 0.72,
    },
    content: {
      minimumOpacity: 0.78,
      travelPixels: 10,
      focusFalloff: 0.9,
    },
    overlay: 'balanced',
  },
  services: {
    id: 'services',
    route: '/servicios',
    label: 'Servicios',
    ...cinematicMediaSources.video4,
    durationSeconds: 6,
    objectPosition: '50% 44%',
    mobileObjectPosition: '52% 48%',
    reducedMotionFrame: 0.52,
    scroll: {
      startViewportOffset: 0,
      endBeforeFooterViewport: 0.72,
    },
    content: {
      minimumOpacity: 0.8,
      travelPixels: 9,
      focusFalloff: 0.92,
    },
    overlay: 'balanced',
  },
  process: {
    id: 'process',
    route: '/proceso',
    label: 'Procesos',
    ...cinematicMediaSources.video5,
    durationSeconds: 6,
    objectPosition: '50% 53%',
    mobileObjectPosition: '53% 55%',
    reducedMotionFrame: 0.5,
    scroll: {
      startViewportOffset: 0,
      endBeforeFooterViewport: 0.7,
    },
    content: {
      minimumOpacity: 0.8,
      travelPixels: 9,
      focusFalloff: 0.94,
    },
    overlay: 'balanced',
  },
  about: {
    id: 'about',
    route: '/nosotros',
    label: 'Nosotros',
    ...cinematicMediaSources.video2,
    durationSeconds: 6,
    objectPosition: '50% 50%',
    mobileObjectPosition: '54% 51%',
    reducedMotionFrame: 0.48,
    scroll: {
      startViewportOffset: 0,
      endBeforeFooterViewport: 0.72,
    },
    content: {
      minimumOpacity: 0.78,
      travelPixels: 10,
      focusFalloff: 0.9,
    },
    overlay: 'balanced',
  },
  contact: {
    id: 'contact',
    route: '/contacto',
    label: 'Contacto',
    ...cinematicMediaSources.video6,
    durationSeconds: 6,
    objectPosition: '50% 50%',
    mobileObjectPosition: '52% 52%',
    reducedMotionFrame: 0.72,
    scroll: {
      startViewportOffset: 0,
      endBeforeFooterViewport: 0.68,
    },
    content: {
      minimumOpacity: 0.86,
      travelPixels: 7,
      focusFalloff: 0.96,
    },
    overlay: 'strong',
  },
} as const satisfies Record<CinematicPageId, CinematicPageConfig>
