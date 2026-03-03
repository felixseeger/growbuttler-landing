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
      id: 1,
      name: 'Hanna K.',
      is_verified: true,
      rating: '4.9',
      reviews_count: 128,
      location: 'Berlin, Mitte',
      price_amount: 45,
      price_unit: '/hr',
      tags: [{ item: 'Living Soil' }, { item: 'Organic' }, { item: 'Indoor' }],
      bio_snippet: 'Specializing in organic regenerative soil practices for small-space urban grows. Let\'s build a sustainable ecosystem.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Marco R.',
      is_verified: true,
      rating: '5.0',
      reviews_count: 42,
      location: 'Munich, Altstadt',
      price_amount: 60,
      price_unit: '/hr',
      tags: [{ item: 'Hydroponics' }, { item: 'Tech Setup' }, { item: 'DWC' }],
      bio_snippet: 'Master of DWC and automated systems. I help you dial in your environment for maximum yield and efficiency.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Sophie T.',
      is_verified: true,
      rating: '4.8',
      reviews_count: 89,
      location: 'Hamburg, Altona',
      price_amount: 35,
      price_unit: '/hr',
      tags: [{ item: 'Pest Control' }, { item: 'Cloning' }],
      bio_snippet: 'Expert in biological pest management and high-success cloning techniques. Keep your garden healthy and productive.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
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
