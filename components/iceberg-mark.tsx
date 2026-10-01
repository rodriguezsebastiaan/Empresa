import { useId } from 'react'
import { cn } from '@/lib/utils'

type IcebergMarkProps = {
  className?: string
}

/**
 * Compact, static interpretation of the portal iceberg used in the home hero.
 * The full interactive composition remains in PortalHeroVisual for future use.
 */
export function IcebergMark({ className }: IcebergMarkProps) {
  const id = useId().replace(/:/g, '')
  const fillId = `iceberg-mark-fill-${id}`
  const facetId = `iceberg-mark-facet-${id}`
  const deepFacetId = `iceberg-mark-deep-facet-${id}`
  const waterId = `iceberg-mark-water-${id}`

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={cn('block', className)}
    >
      <defs>
        <linearGradient id={fillId} x1="12" y1="58" x2="48" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#082030" />
          <stop offset="0.52" stopColor="#22cedd" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f1ffff" />
        </linearGradient>
        <linearGradient id={facetId} x1="32" y1="9" x2="32" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#efffff" stopOpacity="0.98" />
          <stop offset="1" stopColor="#23cbdb" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={deepFacetId} x1="43" y1="22" x2="30" y2="53" gradientUnits="userSpaceOnUse">
          <stop stopColor="#067c95" stopOpacity="0.88" />
          <stop offset="1" stopColor="#0a2639" stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id={waterId} x1="8" y1="0" x2="56" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2af0ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#dfffff" />
          <stop offset="1" stopColor="#2af0ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M7 54.2C15.8 50.1 24.2 48.3 32 48.3C39.8 48.3 48.2 50.1 57 54.2" stroke={`url(#${waterId})`} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 6L47.8 20.8L53.6 51.2L38.3 56.8H25.7L10.4 51.2L16.2 20.8L32 6Z" fill={`url(#${fillId})`} stroke="#d8ffff" strokeOpacity="0.9" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M32 8.7L40.6 25.1L35.7 52.9H28.3L23.4 25.1L32 8.7Z" fill={`url(#${facetId})`} />
      <path d="M40.6 25.1L47.8 20.8L53.6 51.2L38.3 56.8L35.7 52.9L40.6 25.1Z" fill={`url(#${deepFacetId})`} />
      <path d="M16.2 20.8L23.4 25.1L32 34.3L40.6 25.1L47.8 20.8M32 6V53M10.8 50.9L25.7 42.8L32 34.3L38.3 42.8L53.2 50.9M17.3 31.7L25.7 42.8M46.7 31.7L38.3 42.8" stroke="#c3ffff" strokeOpacity="0.54" strokeWidth="1.05" strokeLinejoin="round" />
      <path d="M21.7 47.1L32 43.8L42.3 47.1M17.3 54.3C23.5 52.5 28.4 51.8 32 51.8C35.6 51.8 40.5 52.5 46.7 54.3" stroke="#7cfaff" strokeOpacity="0.72" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="32" cy="34.3" r="1.7" fill="#efffff" />
    </svg>
  )
}
