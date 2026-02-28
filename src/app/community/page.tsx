import type { Metadata } from 'next'
import SubpageLayout from '@/components/SubpageLayout/SubpageLayout'
import styles from './CommunityPage.module.scss'

export const metadata: Metadata = {
  title: 'Community - GrowButtler',
  description: 'Join our growing community of cultivation enthusiasts and share your knowledge.',
}

export default function CommunityPage() {
  return (
    <SubpageLayout>
      <div className={styles.wrap}>
        <h1 className={styles.title}>Community</h1>
        <p className={styles.subtitle}>
          Connect with fellow growers, share experiences, ask questions, and learn together in our vibrant community.
        </p>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={`material-symbols-outlined ${styles.statIcon}`} aria-hidden>groups</span>
            <p className={styles.statValue}>2,000+</p>
            <p className={styles.statLabel}>Active Members</p>
          </div>
          <div className={styles.statCard}>
            <span className={`material-symbols-outlined ${styles.statIcon}`} aria-hidden>forum</span>
            <p className={styles.statValue}>50+</p>
            <p className={styles.statLabel}>Discussion Topics</p>
          </div>
          <div className={styles.statCard}>
            <span className={`material-symbols-outlined ${styles.statIcon}`} aria-hidden>public</span>
            <p className={styles.statValue}>8</p>
            <p className={styles.statLabel}>Countries</p>
          </div>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <span className={`material-symbols-outlined ${styles.featureIcon}`} aria-hidden>menu_book</span>
            <h3 className={styles.featureTitle}>Discussion Forums</h3>
            <p className={styles.featureDesc}>
              Join conversations about growing techniques, problem-solving, and best practices.
            </p>
            <button type="button" className={styles.featureBtn} disabled>Browse Forums</button>
          </div>
          <div className={styles.featureCard}>
            <span className={`material-symbols-outlined ${styles.featureIcon}`} aria-hidden>school</span>
            <h3 className={styles.featureTitle}>Knowledge Base</h3>
            <p className={styles.featureDesc}>
              Access articles, guides, and resources from expert growers and specialists.
            </p>
            <button type="button" className={styles.featureBtn} disabled>Explore Resources</button>
          </div>
          <div className={styles.featureCard}>
            <span className={`material-symbols-outlined ${styles.featureIcon}`} aria-hidden>emoji_events</span>
            <h3 className={styles.featureTitle}>Leaderboard</h3>
            <p className={styles.featureDesc}>
              See who&apos;s contributing most to the community and earning badges.
            </p>
            <button type="button" className={styles.featureBtn} disabled>View Leaderboard</button>
          </div>
          <div className={styles.featureCard}>
            <span className={`material-symbols-outlined ${styles.featureIcon}`} aria-hidden>celebration</span>
            <h3 className={styles.featureTitle}>Events &amp; Meetups</h3>
            <p className={styles.featureDesc}>
              Connect with local growers at in-person events and virtual workshops.
            </p>
            <button type="button" className={styles.featureBtn} disabled>Find Events</button>
          </div>
        </div>

        <div className={styles.ctaBlock}>
          <h2 className={styles.ctaTitle}>Join Our Community Today</h2>
          <p className={styles.ctaDesc}>
            The GrowButtler Community is an inclusive space where growers of all experience levels share knowledge,
            collaborate on solutions, and celebrate successes together.
          </p>
          <div className={styles.guidelines}>
            <h3 className={styles.guidelinesTitle}>Community Guidelines</h3>
            <ul className={styles.guidelinesList}>
              <li>Be respectful and supportive of all members</li>
              <li>Share knowledge freely and help others learn</li>
              <li>Follow local laws and regulations in your region</li>
              <li>Keep discussions relevant and constructive</li>
            </ul>
          </div>
          <button type="button" className={styles.ctaBtn}>Join the Community</button>
        </div>
      </div>
    </SubpageLayout>
  )
}
