import type { Metadata } from 'next'
import Link from 'next/link'
import SubpageLayout from '@/components/SubpageLayout/SubpageLayout'
import { getExpertsContent, getExpertsPageData } from '@/lib/wordpress'
import ExpertsClient from './ExpertsClient'
import styles from './ExpertsPage.module.scss'

export const metadata: Metadata = {
  title: 'GrowButler - Expert Directory',
  description: 'Find certified master growers in your area for expert guidance and consultations.',
}

export const revalidate = 60

function asArray<T = Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

export default async function ExpertsPage() {
  const data = await getExpertsPageData('experts')
  const content = getExpertsContent(data)

  const header = (content.page_header || {}) as Record<string, string | undefined>
  const filters = (content.search_filters || {}) as Record<string, unknown>
  const results = (content.results_section || {}) as Record<string, unknown>
  const mapView = (content.map_view || {}) as Record<string, unknown>

  const filterGroups = asArray<Record<string, string>>(filters.filter_groups)
  const experts = asArray<Record<string, unknown>>(results.experts)
  
  // Default experts from design if WordPress is empty
  const visibleExperts = experts.length > 0 ? experts : [
    {
      name: 'Hanna K.',
      is_verified: true,
      rating: '4.9',
      reviews_count: 128,
      location: 'Berlin, Mitte',
      price_amount: 45,
      price_unit: '/hr',
      tags: [{ item: 'Living Soil' }, { item: 'Organic' }, { item: 'Indoor' }],
      bio_snippet: 'Specializing in organic regenerative soil practices for small-space urban grows. Let\'s build a sustainable ecosystem.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnY8sRuovGvR7FdRY0a8Gp6w2HV295_oVPhyw2VM332K_2OXDfMBnV_i6C35tzoanCVWK46FZYJcFPIwEDBcMYnQ4QJu6MzcUip7jogle65qEri-CRusRQtUafB2eVUt9rB05_G4TN2fa86ZZM70H9-O4hZRTLj_ufkQmf_TEJP7EO9rbiUcatkl34i-dfoqL5BQ5gPTVkwTD7GIkToiltV5QWIzsDBNiih0QlUshinrOS5GxU-LFRnyIKq1PGHhqSJY7CdFNS51dX'
    },
    {
      name: 'Marco R.',
      is_verified: true,
      rating: '5.0',
      reviews_count: 42,
      location: 'Munich, Altstadt',
      price_amount: 60,
      price_unit: '/hr',
      tags: [{ item: 'Hydroponics' }, { item: 'Tech Setup' }],
      bio_snippet: 'Master of DWC and automated systems. I help you dial in your environment for maximum yield and efficiency.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4ETIDOhlgqNg2Fa99bALyHDze867NEb1mvemUiDtPcnsysi-MyEgWEpTFsOgG2ZodyHzuao4FjhcrfV314IftqGJhq-EJEmG9A8xcquLbRSRqVY4n8-JdMotkSXq7jirMztRi4Cwk3UeqKby3dYZdXxzxA3e4j7SyarWyVIKQMIjvky07WH7fljMy5VkVnSXPIOJ7ls2a3LieU7lLKaAU_38mu0hz4wVRq9cVV1TEDyZn72LKl5CfQFRQl6ts2x4CkJVWh9Q2mJek'
    }
  ]

  return (
    <SubpageLayout>
      <div className={styles.pageWrap}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.pageTitle}>{header.title || 'Find Your Mentor'}</h1>
              <p className={styles.pageSubtitle}>{header.subtitle || 'Connect with master cultivators for personalized guidance on your grow.'}</p>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.vettedBadge}>
                <span className="material-symbols-outlined">verified_user</span>
                <span>Vetted Masters</span>
              </div>
              <Link href="/experts/apply" className={styles.applyBtn}>
                <span className="material-symbols-outlined">person_add</span>
                Become Expert
              </Link>
            </div>
          </div>

        </header>

        <ExpertsClient initialExperts={visibleExperts as any} />
      </div>
    </SubpageLayout>
  )
}
