/**
 * Headless WordPress + ACF data fetching.
 * BACKEND_URL should point to your WordPress site (e.g. https://yoursite.com).
 * ACF fields can be exposed via REST (ACF to REST API or similar) or custom endpoint.
 */

const getBaseUrl = (): string => {
  const url = process.env.BACKEND_URL
  if (!url) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('BACKEND_URL not set; using fallback content.')
    }
    return ''
  }
  return url.replace(/\/$/, '')
}

const BASE = getBaseUrl()

/**
 * Fetch JSON from WordPress REST API.
 * Customize path if your ACF is under a different route (e.g. /wp-json/acf/v3/options).
 */
export async function fetchWpJson<T = unknown>(
  path: string,
  revalidate: number | false = 60
): Promise<T> {
  if (!BASE) {
    return {} as T
  }
  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    next: revalidate !== false ? { revalidate } : undefined,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${url}`)
  }
  return res.json() as Promise<T>
}

/**
 * Fetch home page data.
 *
 * Strategy:
 * - Prefer the WordPress front page (General → Reading → “Homepage”)
 *   via /wp-json/wp/v2/settings → page_on_front.
 * - Fallback to a page with slug `home` if no front page is configured.
 *
 * This matches our ACF group which is attached to `page_type == front_page`.
 */
export async function getHomePageData() {
  const { fallback } = getFallbackHomeData()
  if (!BASE) {
    return { page: null, options: {} as Record<string, unknown>, fallback }
  }
  try {
    // 1) Try to resolve the configured front page ID from WP settings.
    let page: { id: number; slug: string; title: { rendered: string }; acf?: unknown } | null = null

    try {
      const settings = await fetchWpJson<{ page_on_front?: number }>('/wp-json/wp/v2/settings?_fields=page_on_front', 60)
      const frontId = settings?.page_on_front
      if (frontId && typeof frontId === 'number' && frontId > 0) {
        page = await fetchWpJson<{ id: number; slug: string; title: { rendered: string }; acf?: unknown }>(
          `/wp-json/wp/v2/pages/${frontId}?_fields=id,slug,title,acf`,
          60
        )
      }
    } catch {
      // If settings/front_page lookup fails, continue with slug-based fallback below.
    }

    // 2) Fallback: look up page by slug `home` if we still don't have a page.
    if (!page) {
      const pages = await fetchWpJson<{ id: number; slug: string; title: { rendered: string }; acf?: unknown }[]>(
        '/wp-json/wp/v2/pages?slug=home&_fields=id,slug,title,acf',
        60
      )
      page = Array.isArray(pages) && pages[0] ? pages[0] : null
    }

    const rawAcf = page?.acf
    const acf = rawAcf && typeof rawAcf === 'object' && !Array.isArray(rawAcf)
      ? (rawAcf as Record<string, unknown>)
      : {}

    if (process.env.NODE_ENV === 'development') {
      const hasFields = Object.keys(acf).length > 0
      if (!hasFields) {
        console.warn(
          'ACF returned empty data (acf: [] or {}). ' +
          'Ensure "Show in REST API" is enabled in the ACF field group settings, ' +
          'or install the "ACF to REST API" plugin.'
        )
      }
    }

    return { page, options: acf, fallback }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('WordPress fetch failed, using fallback:', e)
    }
    return { page: null, options: {} as Record<string, unknown>, fallback }
  }
}

/** Fetch WordPress menu from ACF field */
export async function getMenuByLocation(location: string = 'primary') {
  if (!BASE) {
    return { items: [] as { label: string; url: string }[] }
  }
  try {
    // Fetch menu from WordPress options/ACF
    const options = await fetchWpJson<Record<string, { items?: { label: string; url: string }[] }>>(
      '/wp-json/acf/v3/options/menus',
      60
    )
    
    if (options && options[location]) {
      return { items: options[location].items || [] }
    }

    return { items: [] }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      const msg = e instanceof Error ? e.message : String(e)
      // Suppress noisy warning when the ACF options endpoint for menus does not exist (404),
      // since we already fall back to the per-page ACF navigation config.
      if (!msg.includes('404')) {
        console.warn(`Menu fetch failed for location "${location}", using fallback:`, e)
      }
    }
    return { items: [] }
  }
}

type NavLinkItem = { label: string; url: string }

function normalizeNavUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '#'

  try {
    // Keep relative URLs untouched.
    if (rawUrl.startsWith('/')) return rawUrl
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) return rawUrl

    const target = new URL(rawUrl)
    const backendUrl = process.env.BACKEND_URL ? new URL(process.env.BACKEND_URL) : null
    const frontendUrl = process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL) : null

    const isInternal =
      (backendUrl && target.host === backendUrl.host) ||
      (frontendUrl && target.host === frontendUrl.host)

    if (isInternal) {
      return `${target.pathname}${target.search}${target.hash}` || '/'
    }

    return rawUrl
  } catch {
    return rawUrl
  }
}

export async function getSiteNavigationData() {
  const data = await getHomePageData()
  const content = getHomeContent(data)
  const nav = (content.nav || {}) as Record<string, unknown>
  const primaryMenu = await getMenuByLocation('primary')

  // ACF links can be an array, or a single link object
  const rawLinks = nav.links
  let normalizedLinks: NavLinkItem[] = []
  
  if (Array.isArray(rawLinks)) {
    normalizedLinks = rawLinks.map(item => ({
      label: item.label || item.title || '',
      url: normalizeNavUrl(item.url || '#')
    }))
  } else if (rawLinks && typeof rawLinks === 'object') {
    const obj = rawLinks as any
    normalizedLinks = [{
      label: obj.label || obj.title || '',
      url: normalizeNavUrl(obj.url || '#')
    }]
  }

  const menuLinks: NavLinkItem[] =
    primaryMenu.items && primaryMenu.items.length > 0
      ? primaryMenu.items.map((item) => ({
          label: item.label || '',
          url: normalizeNavUrl(item.url || '#'),
        }))
      : normalizedLinks

  return {
    logoLabel: nav.logo_label as string | undefined,
    logoImage: nav.logo_image as string | undefined,
    logoIcon: nav.logo_icon as string | undefined,
    links: menuLinks,
    loginLabel: nav.login_label as string | undefined,
    ctaLabel: nav.cta_label as string | undefined,
    ctaUrl: (nav.cta_url || '/signup') as string,
  }
}

/** Fallback when BACKEND_URL is missing or WP unavailable */
function getFallbackHomeData() {
  return {
    page: null,
    options: {},
    fallback: {
      hero: {
        badge_text: 'Jetzt live in Berlin & München',
        headline: 'Meisterhafte Kultivierung mit',
        headline_highlight: 'lokalen Experten',
        subheadline:
          'Zertifizierte Meistergärtner in Ihrer Nähe — für Beratung, Diagnostik und Erfolg bei der Ernte.',
        search_placeholder: 'Meistergärtner in Berlin, München ...',
        cta_search_label: 'Meistergärtner finden',
        social_proof_text: 'Join 2,000+ growers in Germany',
        social_proof_count: '+2k',
      },
      features_section: {
        section_title: 'Kultivierung, verfeinert.',
        section_subtitle:
          'Wir verbinden zertifizierte Expertise mit lokalem Wissen — und geben Ihnen die Tools, die Sie zum Erfolg brauchen.',
        features: [
          {
            icon: 'verified_user',
            title: 'Geprüfte Meister',
            description:
              'Arbeiten Sie mit verifizierten Meistergärtnern zusammen, die Ihre Region kennen — Klima, Wasser, Rahmenbedingungen.',
          },
          {
            icon: 'video_camera_front',
            title: 'Video-Diagnostik',
            description:
              'Diagnostik per Live-Stream mit unseren erfahrenen Experten, mit visueller Bestätigung durch Fachleute.',
          },
          {
            icon: 'sensors',
            title: 'IoT-Integration',
            description:
              'Tracken Sie Ihre Pflanzen mit Echtzeit-Umweltdaten und historischer Analyse.',
          },
        ],
      },
      parallax_section: {
        label: 'The Modern Botanist',
        quote: '"Gartenarbeit ist das reinste Vergnügen des Menschen." — Francis Bacon',
        cta_label: 'Beginnen Sie Ihre Reise >',
      },
      pricing_section: {
        title: 'Grüner Daumen Zugang',
        description: 'Nutzen Sie Expertenwissen und Tools, um Ihren Garten zu meistern.',
        benefits: [
          'Unlimited Journal-Einträge',
          'Expert-Directory-Zugriff',
          'Sofortiger Zugriff',
          'Community-Forum-Zugang',
        ],
        price_amount: '€9',
        price_period: '/Monat',
        cta_label: 'Jetzt Zugang erhalten',
        disclaimer: 'Jederzeit kündbar.',
      },
      footer: {
        tagline: 'Empowering the modern urbanite to cultivate with confidence and style.',
        platform_links: [{ label: 'Find Experts', url: '#' }, { label: 'Journal', url: '#' }, { label: 'Pricing', url: '#' }],
        community_links: [{ label: 'Forum', url: '#' }, { label: 'Events', url: '#' }, { label: 'Blog', url: '#' }],
        legal_links: [{ label: 'Imprint', url: '#' }, { label: 'Privacy', url: '#' }, { label: 'Terms', url: '#' }],
        copyright_text: '© 2024 GrowButler GmbH. Made with care in Berlin.',
      },
      nav: {
        logo_label: 'GrowButler',
        logo_image: null,
        logo_icon: 'spa',
        links: [{ label: 'Journal', url: '/journal' }, { label: 'Expert Directory', url: '/experts' }, { label: 'Community', url: '/community' }],
        login_label: 'Log In',
        cta_label: 'Jetzt loslegen',
        cta_url: '/signup',
      },
    },
  }
}

export type HomeData = Awaited<ReturnType<typeof getHomePageData>>

function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
}

function mergeSection(fallbackSection: unknown, acfSection: unknown): Record<string, unknown> {
  const base = asObj(fallbackSection)
  const over = asObj(acfSection)
  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(over)) {
    if (value === null || value === undefined) continue
    if (typeof value === 'string' && value.trim() === '') continue
    if (Array.isArray(value) && value.length === 0) continue
    result[key] = value
  }
  return result
}

function firstNonEmptyString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') {
      return value
    }
  }
  return undefined
}

/** Ensure value is an array; WP/ACF sometimes return repeaters as object with numeric keys */
function ensureArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj).filter((k) => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b))
    if (keys.length > 0) return keys.map((k) => obj[k]).filter((v) => v != null)
  }
  return []
}

/** Normalize a single feature item from ACF (may use icon/title/description or nested keys) */
function normalizeFeatureItem(row: unknown): { icon?: string; title?: string; description?: string } {
  const o = asObj(row)
  return {
    icon: typeof o.icon === 'string' ? o.icon : undefined,
    title: typeof o.title === 'string' ? o.title : undefined,
    description: typeof o.description === 'string' ? o.description : undefined,
  }
}

function normalizeFeaturesSection(
  fallbackFeatures: unknown,
  acfFeatures: unknown,
  acf: Record<string, unknown>
): Record<string, unknown> {
  const merged = mergeSection(fallbackFeatures, acfFeatures)
  const acfGroup = asObj(acfFeatures || acf.features_section)

  const sectionTitle = firstNonEmptyString(
    merged.section_title,
    acfGroup.section_title,
    merged.feature_headline,
    acf.feature_headline
  )
  const sectionSubtitle = firstNonEmptyString(
    merged.section_subtitle,
    acfGroup.section_subtitle,
    merged.feature_subheadline,
    acf.feature_subheadline
  )

  if (sectionTitle) merged.section_title = sectionTitle
  if (sectionSubtitle) merged.section_subtitle = sectionSubtitle

  // Use ACF repeater "features" from the features_section group (array or object-with-index keys)
  const rawFeatures = acfGroup.features ?? merged.features
  const featuresArray = ensureArray(rawFeatures)
  if (featuresArray.length > 0) {
    merged.features = featuresArray.map(normalizeFeatureItem)
  }
  // else keep merged.features from fallback (already set by mergeSection)

  return merged
}

/** Normalize nav so CTA fields are read from nested (nav.cta_label) or flat (nav_cta_label) ACF response */
function normalizeNav(
  mergedNav: Record<string, unknown>,
  acf: Record<string, unknown>
): Record<string, unknown> {
  const out = { ...mergedNav }
  const ctaLabel = firstNonEmptyString(mergedNav.cta_label, acf.nav_cta_label)
  const ctaUrl = firstNonEmptyString(mergedNav.cta_url, acf.nav_cta_url)
  if (ctaLabel !== undefined) out.cta_label = ctaLabel
  if (ctaUrl !== undefined) out.cta_url = ctaUrl
  return out
}

/** Merged content for the home page (ACF + fallback defaults) */
export function getHomeContent(data: HomeData) {
  const fallback = data.fallback ?? {}
  const acf = data.options ?? {}
  const f = fallback as Record<string, unknown>
  const a = acf as Record<string, unknown>
  const mergedNav = mergeSection(f?.nav, a?.nav) as Record<string, unknown>
  return {
    hero: mergeSection(f?.hero, a?.hero),
    features_section: normalizeFeaturesSection(f?.features_section, a?.features_section, a),
    parallax_section: mergeSection(f?.parallax_section, a?.parallax_section),
    pricing_section: mergeSection(f?.pricing_section, a?.pricing_section),
    footer: mergeSection(f?.footer, a?.footer),
    nav: normalizeNav(mergedNav, a),
  }
}

export async function getExpertsPageData(slug: string = 'experts') {
  const fallback = getFallbackExpertsData()
  if (!BASE) {
    return { page: null, options: {} as Record<string, unknown>, fallback }
  }
  try {
    const pages = await fetchWpJson<{ id: number; slug: string; title: { rendered: string }; acf?: unknown }[]>(
      `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,acf`,
      60
    )
    const page = Array.isArray(pages) && pages[0] ? pages[0] : null
    const rawAcf = page?.acf
    const acf = rawAcf && typeof rawAcf === 'object' && !Array.isArray(rawAcf)
      ? (rawAcf as Record<string, unknown>)
      : {}
    return { page, options: acf, fallback }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Experts page fetch failed, using fallback:', e)
    }
    return { page: null, options: {} as Record<string, unknown>, fallback }
  }
}

function getFallbackExpertsData() {
  return {
    page_header: {
      title: 'Find Your Mentor',
      subtitle: 'Connect with master cultivators for personalized guidance on your grow.',
      badge_label: 'Vetted Masters',
      badge_icon: 'verified_user',
      results_label: 'Results',
    },
    search_filters: {
      search_placeholder: 'Search by name, location, or keyword...',
      map_toggle_icon: 'map',
      filter_groups: [
        { key: 'specialty', label: 'Specialty', type: 'select' },
        { key: 'price', label: 'Price', type: 'range' },
        { key: 'availability', label: 'Availability', type: 'select' },
      ],
    },
    results_section: {
      section_title: 'Top Experts in Berlin',
      result_count_text: '5 Results',
      experts: [
        {
          name: 'Hanna K.',
          is_verified: true,
          is_new: false,
          rating: '4.9',
          reviews_count: 128,
          location: 'Berlin, Mitte',
          price_amount: 45,
          price_unit: '/hr',
          tags: [{ item: 'Living Soil' }, { item: 'Organic' }, { item: 'Indoor' }],
          bio_snippet:
            'Specializing in organic regenerative soil practices for small-space urban grows. Let us build a sustainable ecosystem.',
          cta_profile_label: 'View Profile',
          cta_book_label: 'Book Now',
          map_icon: 'spa',
        },
        {
          name: 'Marco R.',
          is_verified: true,
          is_new: false,
          rating: '5.0',
          reviews_count: 42,
          location: 'Munich, Altstadt',
          price_amount: 60,
          price_unit: '/hr',
          tags: [{ item: 'Hydroponics' }, { item: 'Tech Setup' }],
          bio_snippet:
            'Master of DWC and automated systems. I help you dial in your environment for maximum yield and efficiency.',
          cta_profile_label: 'View Profile',
          cta_book_label: 'Book Now',
          map_icon: 'water_drop',
        },
      ],
    },
    map_view: {
      enabled: true,
      controls: [{ key: 'location', icon: 'my_location' }, { key: 'zoom_in', icon: 'add' }, { key: 'zoom_out', icon: 'remove' }],
      pins: [
        { name: 'Hanna K.', icon: 'spa', tooltip: 'Hanna K. • €45', price_label: '€45' },
        { name: 'Marco R.', icon: 'water_drop', tooltip: 'Marco R. • €60', price_label: '€60' },
      ],
    },
    booking_modal: {
      title: 'Book Consultation',
      service_label: '15 min Video Diagnostics',
      date_label: 'Date',
      confirm_label: 'Confirm Booking',
      time_slots: [{ time: '09:00' }, { time: '11:30' }, { time: '14:00' }],
    },
  }
}

export type ExpertsData = Awaited<ReturnType<typeof getExpertsPageData>>

export function getExpertsContent(data: ExpertsData) {
  const fallback = (data.fallback ?? {}) as Record<string, unknown>
  const acf = (data.options ?? {}) as Record<string, unknown>
  return {
    page_header: mergeSection(fallback.page_header, acf.page_header),
    search_filters: mergeSection(fallback.search_filters, acf.search_filters),
    results_section: mergeSection(fallback.results_section, acf.results_section),
    map_view: mergeSection(fallback.map_view, acf.map_view),
    booking_modal: mergeSection(fallback.booking_modal, acf.booking_modal),
    sidebar: mergeSection(fallback.sidebar, acf.sidebar),
    pagination: mergeSection(fallback.pagination, acf.pagination),
  }
}

export async function getJournalPageData(slug: string = 'journal') {
  const fallback = getFallbackJournalData()
  if (!BASE) {
    return { page: null, options: {} as Record<string, unknown>, fallback }
  }
  try {
    const pages = await fetchWpJson<
      { id: number; slug: string; title: { rendered: string }; content?: { rendered?: string }; acf?: unknown }[]
    >(`/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,content,acf`, 60)
    const page = Array.isArray(pages) && pages[0] ? pages[0] : null
    const rawAcf = page?.acf
    const acf = rawAcf && typeof rawAcf === 'object' && !Array.isArray(rawAcf)
      ? (rawAcf as Record<string, unknown>)
      : {}

    return { page, options: acf, fallback }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Journal page fetch failed, using fallback:', e)
    }
    return { page: null, options: {} as Record<string, unknown>, fallback }
  }
}

function getFallbackJournalData() {
  return {
    page_header: {
      title: 'Growth Journal',
      subtitle: 'Track your cultivation progress, document observations, and learn from your growing experience.',
    },
    coming_soon: {
      title: 'Coming Soon',
      intro: "The Growth Journal feature is currently under development. You'll soon be able to:",
      features: [
        { item: 'Create daily growth logs and observations' },
        { item: 'Upload photos of your plants at different stages' },
        { item: 'Track watering, feeding, and environmental data' },
        { item: 'Share insights with expert mentors' },
        { item: 'Access AI-powered growth recommendations' },
      ],
      cta_label: 'Notify Me When Available',
    },
  }
}

export type JournalData = Awaited<ReturnType<typeof getJournalPageData>>

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && 'item' in item) {
        const candidate = (item as { item?: unknown }).item
        return typeof candidate === 'string' ? candidate : ''
      }
      return ''
    })
    .filter((item) => item.trim() !== '')
}

export function getJournalContent(data: JournalData) {
  const fallback = (data.fallback ?? {}) as Record<string, unknown>
  const acf = (data.options ?? {}) as Record<string, unknown>

  const fallbackHeader = mergeSection(fallback.page_header, {})
  const acfHeader = mergeSection(acf.page_header, {})
  const pageTitle = data.page?.title?.rendered

  const page_header = {
    ...fallbackHeader,
    ...acfHeader,
    title: firstNonEmptyString(
      acfHeader.title,
      acf.title,
      pageTitle,
      fallbackHeader.title
    ),
    subtitle: firstNonEmptyString(
      acfHeader.subtitle,
      acf.subtitle,
      fallbackHeader.subtitle
    ),
  }

  const fallbackComingSoon = mergeSection(fallback.coming_soon, {})
  const acfComingSoon = mergeSection(acf.coming_soon, {})
  const features =
    asStringArray(acfComingSoon.features).length > 0
      ? asStringArray(acfComingSoon.features)
      : asStringArray(acf.features).length > 0
        ? asStringArray(acf.features)
        : asStringArray(fallbackComingSoon.features)

  return {
    page_header,
    coming_soon: {
      ...fallbackComingSoon,
      ...acfComingSoon,
      features,
    },
  }
}

export async function getDashboardPageData(slug: string = 'dashboard') {
  const fallback = getFallbackDashboardData()
  if (!BASE) {
    return { page: null, options: {} as Record<string, unknown>, fallback }
  }
  try {
    const pages = await fetchWpJson<
      { id: number; slug: string; title: { rendered: string }; acf?: unknown }[]
    >(`/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,acf`, 60)
    const page = Array.isArray(pages) && pages[0] ? pages[0] : null
    const rawAcf = page?.acf
    const acf = rawAcf && typeof rawAcf === 'object' && !Array.isArray(rawAcf)
      ? (rawAcf as Record<string, unknown>)
      : {}
    return { page, options: acf, fallback }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Dashboard page fetch failed, using fallback:', e)
    }
    return { page: null, options: {} as Record<string, unknown>, fallback }
  }
}

function getFallbackDashboardData() {
  return {
    hero: {
      title: 'Good morning, Alex.',
      subtitle: 'Your garden is thriving today.',
      primary_cta_label: 'Seed New Life',
    },
    consultation: {
      title: 'Upcoming Consultation',
      expert_name: 'Hanna K.',
      date_label: 'Tomorrow, 14:00',
      cta_primary_label: 'Reschedule',
      cta_secondary_label: 'Enter Waiting Room',
    },
    environment_widgets: [
      { label: 'Tent A • Temp', metric: '24.5', unit: '°C', status: 'Optimal Range' },
      { label: 'Tent A • RH', metric: '55', unit: '%', status: 'Stable' },
      { label: 'VPD (kPa)', metric: '0.95', unit: 'kPa', status: 'Target: 0.8-1.0' },
      { label: 'Soil Moisture', metric: '12', unit: '%', status: 'Water Needed' },
    ],
    plants: [
      { name: 'Northern Lights #5', stage_label: 'Vegetative', location: 'Indoor • Tent A', day_label: 'Day 34' },
      { name: 'Gelato #33', stage_label: 'Seedling', location: 'Indoor • Tent B', day_label: 'Day 7' },
    ],
  }
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardPageData>>

export function getDashboardContent(data: DashboardData) {
  const fallback = (data.fallback ?? {}) as Record<string, unknown>
  const acf = (data.options ?? {}) as Record<string, unknown>

  const hero = mergeSection(fallback.hero, acf.hero)
  const consultation = mergeSection(fallback.consultation, acf.consultation)

  const envFallback = Array.isArray(fallback.environment_widgets) ? fallback.environment_widgets : []
  const envAcf = Array.isArray(acf.environment_widgets) ? acf.environment_widgets : []
  const environment_widgets = envAcf.length > 0 ? envAcf : envFallback

  const plantsFallback = Array.isArray(fallback.plants) ? fallback.plants : []
  const plantsAcf = Array.isArray(acf.plants) ? acf.plants : []
  const plants = plantsAcf.length > 0 ? plantsAcf : plantsFallback

  return {
    hero,
    consultation,
    environment_widgets,
    plants,
  }
}
