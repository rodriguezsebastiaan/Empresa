import type { Metadata } from 'next'
import { CinematicLanding } from '@/components/cinematic/cinematic-landing'
import { HomeApproach } from '@/components/home-approach'
import { HomeBenefits } from '@/components/home-benefits'
import { HomeCallToAction } from '@/components/home-cta'
import { HomeHero } from '@/components/home-hero'
import { HomeProjects } from '@/components/home-projects'
import { HomeSolutions } from '@/components/home-solutions'
import { SiteShell } from '@/components/site-shell'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata('home')

export default function Page() {
  return (
    <SiteShell seoPage="home">
      <CinematicLanding>
        <HomeHero />
        <HomeProjects />
        <HomeApproach />
        <HomeSolutions />
        <HomeBenefits />
        <HomeCallToAction />
      </CinematicLanding>
    </SiteShell>
  )
}
