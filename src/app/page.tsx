import { getHomePageData, getHomeContent, getMenuByLocation } from '@/lib/wordpress'
import Header from '@/components/Header/Header'
import Hero from '@/components/Hero/Hero'
import Features from '@/components/Features/Features'
import ParallaxBreaker from '@/components/ParallaxBreaker/ParallaxBreaker'
import Pricing from '@/components/Pricing/Pricing'
import Footer from '@/components/Footer/Footer'

export const revalidate = 60

export default async function HomePage() {
  const data = await getHomePageData()
  const content = getHomeContent(data)
  const primaryMenu = await getMenuByLocation('primary')

  const hero = (content.hero || {}) as Record<string, string | string[] | undefined>
  const featuresSection = (content.features_section || {}) as Record<string, unknown>
  const parallaxSection = (content.parallax_section || {}) as Record<string, string | undefined>
  const pricingSection = (content.pricing_section || {}) as Record<string, string | string[] | undefined>
  const footer = (content.footer || {}) as Record<string, string | { label: string; url: string }[] | undefined>
  const nav = (content.nav || {}) as Record<string, string | { label: string; url: string }[] | undefined>

  // Use WordPress menu if available, fallback to ACF nav data
  const menuLinks = primaryMenu.items && primaryMenu.items.length > 0
    ? primaryMenu.items.map((item) => ({ label: item.label || '', url: item.url || '#' }))
    : (nav.links as { label: string; url: string }[] | undefined)

  return (
    <>
      <Header
        logoLabel={nav.logo_label as string}
        logoImage={nav.logo_image as string | undefined}
        logoIcon={nav.logo_icon as string | undefined}
        links={menuLinks}
        loginLabel={nav.login_label as string}
        ctaLabel={nav.cta_label as string}
        ctaUrl={(nav.cta_url as string) || '/signup'}
      />
      <main className="flex-grow pt-24 pb-12">
        <Hero
          badgeText={hero.badge_text as string}
          headline={hero.headline as string}
          headlineHighlight={hero.headline_highlight as string}
          subheadline={hero.subheadline as string}
          searchPlaceholder={hero.search_placeholder as string}
          ctaSearchLabel={hero.cta_search_label as string}
          socialProofText={hero.social_proof_text as string}
          socialProofCount={hero.social_proof_count as string}
          avatarUrls={hero.avatar_urls as string[] | undefined}
        />
        <Features
          sectionTitle={(featuresSection.section_title as string)}
          sectionSubtitle={(featuresSection.section_subtitle as string)}
          features={(featuresSection.features as { icon?: string; title?: string; description?: string }[]) ?? undefined}
        />
        <ParallaxBreaker
          label={parallaxSection.label}
          quote={parallaxSection.quote}
          ctaLabel={parallaxSection.cta_label}
          backgroundImage={
            typeof parallaxSection.background_image === 'string'
              ? parallaxSection.background_image
              : (parallaxSection.background_image as { url?: string } | undefined)?.url
          }
        />
        <Pricing
          title={pricingSection.title as string}
          description={pricingSection.description as string}
          benefits={pricingSection.benefits as string[]}
          priceAmount={pricingSection.price_amount as string}
          pricePeriod={pricingSection.price_period as string}
          ctaLabel={pricingSection.cta_label as string}
          disclaimer={pricingSection.disclaimer as string}
          paypalPlanId={pricingSection.paypal_plan_id as string | undefined}
        />
        <Footer
          tagline={footer.tagline as string}
          platformLinks={footer.platform_links as { label: string; url: string }[]}
          communityLinks={footer.community_links as { label: string; url: string }[]}
          legalLinks={footer.legal_links as { label: string; url: string }[]}
          copyrightText={footer.copyright_text as string}
        />
      </main>
    </>
  )
}
