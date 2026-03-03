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
      id: 257,
      name: 'Master Growbuttler',
      is_verified: true,
      rating: '5.0',
      reviews_count: 342,
      location: 'Berlin, Kreuzberg',
      price_amount: 85,
      price_unit: '/hr',
      tags: [{ item: 'Pro Grow' }, { item: 'Large Scale' }, { item: 'Master' }],
      bio_snippet: 'Certified master grower for industrial and boutique setups. Specializing in high-yield optimization and automated environmental control.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      id: 256,
      name: 'Expert Two',
      is_verified: true,
      rating: '4.8',
      reviews_count: 89,
      location: 'Berlin, Neukölln',
      price_amount: 55,
      price_unit: '/hr',
      tags: [{ item: 'Cloning' }, { item: 'Mother Plants' }],
      bio_snippet: 'Focusing on genetics and plant health. I help you maintain a healthy mother garden and ensure 100% clone success rates.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 255,
      name: 'Expert One',
      is_verified: true,
      rating: '4.9',
      reviews_count: 156,
      location: 'Berlin, Mitte',
      price_amount: 45,
      price_unit: '/hr',
      tags: [{ item: 'Living Soil' }, { item: 'Organic' }],
      bio_snippet: 'Specializing in organic regenerative soil practices for small-space urban grows. Let\'s build a sustainable ecosystem.',
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
