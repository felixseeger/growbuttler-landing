/**
 * Types for headless WordPress + ACF API responses.
 * Adjust field names to match your ACF field group slugs.
 */

export interface AcfHero {
  badge_text?: string
  headline?: string
  headline_highlight?: string
  subheadline?: string
  search_placeholder?: string
  cta_search_label?: string
  social_proof_text?: string
  social_proof_count?: string
  avatar_urls?: string[]
}

export interface AcfFeature {
  icon?: string
  title?: string
  description?: string
}

export interface AcfFeaturesSection {
  section_title?: string
  section_subtitle?: string
  features?: AcfFeature[]
}

export interface AcfParallaxSection {
  label?: string
  quote?: string
  cta_label?: string
  background_image?: { url?: string }
}

export interface AcfPricingSection {
  title?: string
  description?: string
  benefits?: string[]
  price_amount?: string
  price_period?: string
  cta_label?: string
  disclaimer?: string
  paypal_plan_id?: string
}

export interface AcfFooter {
  tagline?: string
  platform_links?: { label: string; url: string }[]
  community_links?: { label: string; url: string }[]
  legal_links?: { label: string; url: string }[]
  copyright_text?: string
}

export interface AcfNav {
  logo_label?: string
  links?: { label: string; url: string }[]
  login_label?: string
  cta_label?: string
}

export interface HomePageAcf {
  hero?: AcfHero
  features_section?: AcfFeaturesSection
  parallax_section?: AcfParallaxSection
  pricing_section?: AcfPricingSection
  footer?: AcfFooter
  nav?: AcfNav
}

export interface WpPage {
  id: number
  slug: string
  title: { rendered: string }
  content?: { rendered: string }
  acf?: HomePageAcf
}

export interface LandingData {
  page: WpPage | null
  options?: Record<string, unknown>
}
