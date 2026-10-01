export type CinematicSceneId =
  | 'intro'
  | 'hero'
  | 'projects'
  | 'approach'
  | 'solutions'
  | 'benefits'
  | 'contact'

export type CinematicMediaSources = {
  desktopSrc: string
  mobileSrc: string
}

export const cinematicMediaSources = {
  video0: {
    desktopSrc: '/videos/cinematic/optimized/desktop/video0_Galaxia_h264.mp4',
    mobileSrc: '/videos/cinematic/optimized/mobile/video0_Galaxia_720p_h264.mp4',
  },
  video1: {
    desktopSrc:
      '/videos/cinematic/optimized/desktop/video1_SistemaSolar_h264.mp4',
    mobileSrc:
      '/videos/cinematic/optimized/mobile/video1_SistemaSolar_720p_h264.mp4',
  },
  video2: {
    desktopSrc:
      '/videos/cinematic/optimized/desktop/video2_Colombia_h264.mp4',
    mobileSrc:
      '/videos/cinematic/optimized/mobile/video2_Colombia_720p_h264.mp4',
  },
  video3: {
    desktopSrc:
      '/videos/cinematic/optimized/desktop/video3_Col_Iceberg_h264.mp4',
    mobileSrc:
      '/videos/cinematic/optimized/mobile/video3_Col_Iceberg_720p_h264.mp4',
  },
  video4: {
    desktopSrc:
      '/videos/cinematic/optimized/desktop/video4_PuntaIceberg_h264.mp4',
    mobileSrc:
      '/videos/cinematic/optimized/mobile/video4_PuntaIceberg_720p_h264.mp4',
  },
  video5: {
    desktopSrc:
      '/videos/cinematic/optimized/desktop/video5_IcebergAbajo_h264.mp4',
    mobileSrc:
      '/videos/cinematic/optimized/mobile/video5_IcebergAbajo_720p_h264.mp4',
  },
  video6: {
    desktopSrc:
      '/videos/cinematic/optimized/desktop/video6_IcebergCompleto_h264.mp4',
    mobileSrc:
      '/videos/cinematic/optimized/mobile/video6_IcebergCompleto_720p_h264.mp4',
  },
} as const satisfies Record<string, CinematicMediaSources>

export type CinematicScene = CinematicMediaSources & {
  index: number
  id: CinematicSceneId
  label: string
  sectionId: Exclude<CinematicSceneId, 'intro'> | null
  durationSeconds: number
  objectPosition: string
  mobileObjectPosition: string
  reducedMotionFrame: number
}

export const cinematicConfig = {
  introDurationMs: 6_000,
  introReboundTolerancePx: 96,
  introReboundDelayMs: 150,
  introReboundSettleMs: 700,
  crossfadeProgress: 0.035,
  incomingBoundaryOpacity: 0.82,
  preloadNextAtProgress: 0.4,
  seekEpsilonSeconds: 1 / 48,
  contentMinimumOpacity: 0.2,
  scenes: [
    {
      index: 0,
      id: 'intro',
      label: 'Introducción',
      sectionId: null,
      ...cinematicMediaSources.video0,
      durationSeconds: 6,
      objectPosition: '50% 50%',
      mobileObjectPosition: '50% 50%',
      reducedMotionFrame: 0,
    },
    {
      index: 1,
      id: 'hero',
      label: 'Hero',
      sectionId: 'hero',
      ...cinematicMediaSources.video1,
      durationSeconds: 6,
      objectPosition: '50% 50%',
      mobileObjectPosition: '52% 50%',
      reducedMotionFrame: 0.3,
    },
    {
      index: 2,
      id: 'projects',
      label: 'Nuestros proyectos',
      sectionId: 'projects',
      ...cinematicMediaSources.video2,
      durationSeconds: 6,
      objectPosition: '50% 50%',
      mobileObjectPosition: '51% 50%',
      reducedMotionFrame: 0.48,
    },
    {
      index: 3,
      id: 'approach',
      label: 'Nuestro enfoque',
      sectionId: 'approach',
      ...cinematicMediaSources.video3,
      durationSeconds: 6,
      objectPosition: '50% 50%',
      mobileObjectPosition: '54% 50%',
      reducedMotionFrame: 0.5,
    },
    {
      index: 4,
      id: 'solutions',
      label: 'Soluciones',
      sectionId: 'solutions',
      ...cinematicMediaSources.video4,
      durationSeconds: 6,
      objectPosition: '50% 50%',
      mobileObjectPosition: '50% 50%',
      reducedMotionFrame: 0.52,
    },
    {
      index: 5,
      id: 'benefits',
      label: 'Beneficios',
      sectionId: 'benefits',
      ...cinematicMediaSources.video5,
      durationSeconds: 6,
      objectPosition: '50% 50%',
      mobileObjectPosition: '50% 50%',
      reducedMotionFrame: 0.5,
    },
    {
      index: 6,
      id: 'contact',
      label: 'Contacto',
      sectionId: 'contact',
      ...cinematicMediaSources.video6,
      durationSeconds: 6,
      objectPosition: '50% 50%',
      mobileObjectPosition: '50% 50%',
      reducedMotionFrame: 0.72,
    },
  ] satisfies readonly CinematicScene[],
} as const
