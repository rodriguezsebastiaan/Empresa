import type { Metadata } from 'next'
import { HomeApproach } from '@/components/home-approach'
import { HomeBenefits } from '@/components/home-benefits'
import { HomeCallToAction } from '@/components/home-cta'
import { HomeHero } from '@/components/home-hero'
import { HomeSolutions } from '@/components/home-solutions'
import { SiteShell } from '@/components/site-shell'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata('home')

export default function Page() {
  return (
    <SiteShell>
      <HomeHero />
      <HomeApproach />
      <HomeSolutions />
      <HomeBenefits />
      <HomeCallToAction />
    </SiteShell>
  )
}
