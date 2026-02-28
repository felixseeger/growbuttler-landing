'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Hero.module.scss'

const DEFAULT_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0apY2R9dJbGe4lx7GpUO1T35qc2Qird49nI0kXR_3_muDRDUkPOoo8xwKrtOt431CRIcNll7BpvjAL6yiJwb3seiy4pRSpzphOMKzUSzBB5ggMdxrEt5CEn6ntuMnLRUaUKuhBSm0pfxHyFeFaj5UcAIQwAkZGqH4LDoW8su57Q3I1bZPIZgIUM49xzHUwOSCblw1vJhzmQRZwenyjUMrMitgRO6dT_v0wW7JaIEZcIv1Xm8epU5UGeHmgCuJcIGXYMMd559cN8o0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC4AqdVItZ6rpPQn_kNcBnM2fJYNQGzRf_dFwEP31cJT2RMnCciEi4UI-O2zWed3SNT2ZdRIEFvngKN5ssByhP8NOZNd9fry8jO7I3w4rzmCr2F81nyjCRLXjuNo0b5AV8rlqan8lx6d-rem0_GGkbXG5QL_RugCQhO1AHoQ5Ey8jE1pLJE6BxdDu_u9BqMjvjwQu5oLqIx8nfWoBtBg5f-jvPIoub5nENPKGYQk4r8jh7utG7MSg1kocydEGJqBadz6oAqqomS49tu',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC04KY3bLn0KZwsVbNRfwkXYxVvYimrh1Fe0nFI2jzsjeFDAxeHfkCNSxvxax786LJxremic0hgHnUfNUpY5LIaKmWzeiA9cHbqof88CY26dPpIxSIPQul-eHjUq4g44fvzFLU2FGymOWaAqO8EHkCkO93XLE04EE41drtJMSzM0PkEA6210ITuSOuP_EfLJMOlHzJPb_C0lmLtxgxa-bfptJPdKAfPAoG-N97-5YYX9Dth6AmX6gC_NMJqpyrVeaF1aZobrXAB4uO4',
]

interface HeroProps {
  badgeText?: string
  headline?: string
  headlineHighlight?: string
  subheadline?: string
  searchPlaceholder?: string
  ctaSearchLabel?: string
  socialProofText?: string
  socialProofCount?: string
  avatarUrls?: string[] | null
}

export default function Hero({
  badgeText = 'Jetzt live in Berlin & München',
  headline = 'Meisterhafte Kultivierung mit',
  headlineHighlight = 'lokalen Experten',
  subheadline = 'Zertifizierte Meistergärtner in Ihrer Nähe — für Beratung, Diagnostik und Erfolg bei der Ernte.',
  searchPlaceholder = 'Meistergärtner in Berlin, München ...',
  ctaSearchLabel = 'Meistergärtner finden',
  socialProofText = 'Join 2,000+ growers in Germany',
  socialProofCount = '+2k',
  avatarUrls = DEFAULT_AVATARS,
}: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const safeAvatarUrls = Array.isArray(avatarUrls) && avatarUrls.length > 0 ? avatarUrls : DEFAULT_AVATARS

  const searchHref = searchQuery.trim()
    ? `/experts?q=${encodeURIComponent(searchQuery.trim())}`
    : '/experts'

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>{badgeText}</span>
          </div>
          <h1 className={styles.title}>
            {headline}{' '}
            <span className={styles.highlight}>
              {headlineHighlight}
              <svg className={styles.underline} viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
              </svg>
            </span>
          </h1>
          <p className={styles.subheadline}>{subheadline}</p>
          <div className={styles.searchWrap}>
            <div className={styles.searchInputWrap}>
              <span className={styles.searchIcon} aria-hidden>location_on</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for master growers by location"
              />
            </div>
            <Link href={searchHref} className={styles.searchBtn}>
              <span>{ctaSearchLabel}</span>
              <span className={styles.searchBtnIcon} aria-hidden>arrow_forward</span>
            </Link>
          </div>
          <div className={styles.socialProof}>
            <div className={styles.avatars}>
              {safeAvatarUrls.slice(0, 3).map((src, i) => (
                <div key={i} className={styles.avatar}>
                  <Image src={src} alt="" width={40} height={40} className={styles.avatarImg} unoptimized />
                </div>
              ))}
              <div className={styles.avatarMore}>{socialProofCount}</div>
            </div>
            <p className={styles.socialProofText}>{socialProofText}</p>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.blur1} aria-hidden />
          <div className={styles.blur2} aria-hidden />
          <div className={styles.card}>
            <div className={styles.cardBadge}>Top Rated</div>
            <div className={styles.cardHeader}>
              <div className={styles.cardAvatarWrap}>
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjDOp3OztxrLKX0AGwz7v2ZfdKZIyVIuxZteldzD_LV4NaU9Gp-ueAsk40qlHVqrTbuxex82LCP52fWvXy_3RXLozYmt8aP8rUDsO2wGBAyVSML-hODiu2uyaHYziaME5i7MUdrwgaAha6qF0SwlpUR4IEK3CZ3Je62y8WqRcUC5Yns6AWqb3vgvCqt1M5qJ0oyJQmh0EkTcwTA6BgQwut-N4OFOjA3KgpxF7bz37hr3Xh9ucIEUjK3y8awU1exaeuQeX5FtyxsVNz"
                  alt=""
                  width={64}
                  height={64}
                  className={styles.cardAvatar}
                  unoptimized
                />
                <span className={styles.cardVerified} aria-hidden>verified</span>
              </div>
              <div>
                <h3 className={styles.cardName}>Hanna K.</h3>
                <p className={styles.cardRole}>Living Soil Specialist</p>
                <div className={styles.cardRating}>
                  <span className={styles.star} aria-hidden>star</span>
                  <span className={styles.ratingNum}>5.0</span>
                  <span className={styles.ratingMeta}>(124 consults)</span>
                </div>
              </div>
            </div>
            <div className={styles.cardTags}>
              <span>Organic</span>
              <span>Indoor</span>
              <span>Berlin</span>
            </div>
            <div className={styles.cardOffer}>
              <div className={styles.cardOfferRow}>
                <div className={styles.cardOfferInfo}>
                  <span className={styles.cardOfferIcon} aria-hidden>videocam</span>
                  <div>
                    <p className={styles.cardOfferTitle}>Video Consult</p>
                    <p className={styles.cardOfferMeta}>15 min diagnostic</p>
                  </div>
                </div>
                <span className={styles.cardOfferPrice}>€15</span>
              </div>
              <Link href="/book?expert=hanna-k" className={styles.cardCta}>Book Consultation</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
