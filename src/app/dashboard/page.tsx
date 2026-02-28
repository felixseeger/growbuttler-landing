import type { Metadata } from 'next'
import SubpageLayout from '@/components/SubpageLayout/SubpageLayout'
import DashboardGreeting from '@/components/DashboardGreeting'
import styles from './DashboardPage.module.scss'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Dashboard - GrowButtler',
  description: 'Manage your garden, track progress, and consult with experts.',
}

export default function DashboardPage() {
  return (
    <SubpageLayout>
      <div className={styles.container}>
        {/* Hero Header */}
        <section className={styles.hero}>
          <div>
            <div className={styles.greeting}>
              <DashboardGreeting />
            </div>
            <p className={styles.status}>Your garden is thriving today.</p>
          </div>
          <button className={styles.seedBtn}>
            <span className="material-symbols-outlined">add</span>
            Seed New Life
          </button>
        </section>

        {/* Consultation Widget */}
        <section className={styles.consultation}>
          <div className={styles.consultCard}>
            <div className={styles.expertInfo}>
              <div className={styles.avatarWrap}>
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBWemJ4BqMAw_kZKvfykKAiFkhmu3sxPPEelexJ8FFEubnJeT6RkJfgOmK6rP1qQTQpngIlFNO_KJkKLM3tt-UacVW8khSJDeAP3T8PSFcH74uyGODz-gHj0p4_jKxaxyWRMInDgdfwJEAeUhvJ_j2ES2L4mWr2QQBehetlbVwVeLpZJDaZkkfMjM2I5KLfNQJxmHQ-gZuHy5k6RNE_d0du_ewQsIEUta0QF4dhcnMg2iMuFCI6jZAXJWy4Fc6HZirclGQFuIXrp8m"
                  alt="Hanna K."
                  width={64}
                  height={64}
                  className={styles.avatar}
                />
                <span className={styles.liveBadge}>LIVE</span>
              </div>
              <div className={styles.expertText}>
                <h3>Upcoming Consultation</h3>
                <p>With Master Grower <strong>Hanna K.</strong></p>
                <div className={styles.timeTag}>
                  <span className="material-symbols-outlined">calendar_today</span>
                  Tomorrow, 14:00
                </div>
              </div>
            </div>
            <div className={styles.consultActions}>
              <button className={styles.rescheduleBtn}>Reschedule</button>
              <button className={styles.waitingRoomBtn}>
                <span className="material-symbols-outlined">videocam</span>
                Enter Waiting Room
              </button>
            </div>
          </div>
        </section>

        {/* Environment Grid */}
        <section className={styles.envGrid}>
          <div className={styles.envCard}>
            <div className={styles.envHeader}>
              <span>TENT A • TEMP</span>
              <span className="material-symbols-outlined">thermometer</span>
            </div>
            <div className={styles.envValue}>24.5<strong>°C</strong></div>
            <div className={`${styles.envStatus} ${styles.optimal}`}>
              <span className="material-symbols-outlined">arrow_drop_up</span>
              Optimal Range
            </div>
          </div>

          <div className={styles.envCard}>
            <div className={styles.envHeader}>
              <span>TENT A • RH</span>
              <span className="material-symbols-outlined">water_drop</span>
            </div>
            <div className={styles.envValue}>55<strong>%</strong></div>
            <div className={styles.envStatus}>
              <span className="material-symbols-outlined">remove</span>
              Stable
            </div>
          </div>

          <div className={styles.envCard}>
            <div className={styles.envHeader}>
              <span>VPD (KPA)</span>
              <span className="material-symbols-outlined">cloud</span>
            </div>
            <div className={styles.envValue}>0.95<strong>kPa</strong></div>
            <div className={styles.envStatus}>
              <span className="material-symbols-outlined">check_circle</span>
              Target: 0.8-1.0
            </div>
          </div>

          <div className={`${styles.envCard} ${styles.alertCard}`}>
            <div className={styles.envHeader}>
              <span>SOIL MOISTURE</span>
              <span className="material-symbols-outlined">opacity</span>
            </div>
            <div className={styles.envValue}>12<strong>%</strong></div>
            <div className={styles.envStatus}>
              <span className="material-symbols-outlined">water_full</span>
              Water Needed
            </div>
          </div>
        </section>

        {/* Plant Grid */}
        <section className={styles.plantsSection}>
          <div className={styles.sectionHeader}>
            <h3>My Plants</h3>
            <div className={styles.viewToggle}>
              <button><span className="material-symbols-outlined">grid_view</span></button>
              <button><span className="material-symbols-outlined">view_list</span></button>
            </div>
          </div>

          <div className={styles.plantGrid}>
            <article className={styles.plantCard}>
              <div className={styles.cardImg} style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDASAYOvJIMCa5ouzKERZXY_RqBkyV2FnA90qBEnZC2yjqGGeKWE6hrvNTTmWJq7-TE4CVYLVuVwFAQ0105BTjwIw0D-T7hzvzb-CiPm-wZ-igZcmb3ekbOytBvNkEYb792oT_ewR5KkfQf7KWdOgmSDVHeB0dmP2RwgZpRRjXj6PJ8klXgHynj0DoZ3KpYjz7DXfckXnFwL01Mhunmmr7kQr5Vi20dCFqyL3RHonpGKqAXsU3OhQRLD9qi4UzCnuM7edBL5CJ1xgUw')" }}>
                <span className={styles.dayBadge}>Day 34</span>
              </div>
              <div className={styles.cardContent}>
                <h4>Northern Lights #5</h4>
                <p className={styles.cardLoc}>Indoor • Tent A</p>
                <div className={styles.cardTags}>
                  <span>Vegetative</span>
                  <span>Indica Dom.</span>
                </div>
                <div className={styles.cardFooter}>
                  <button><span className="material-symbols-outlined">edit_note</span> Log Journal</button>
                </div>
              </div>
            </article>

            <article className={styles.plantCard}>
              <div className={styles.cardImg} style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCa9srumkHoZW0lzdwcVCsxFFL7numOQi-mdPui3mWP2iogubMXshjxl49xx9MtMBwhbjDE01TAPA4N9MryIACPlA38OD72J_Cj72ecgSiFnWVVvQzw98Kc1DKMmx0Amj0sTFe1CCFFtUdswpYHn5188lQGyfJpFytd9K661IXnqqLLj-a1oqoeTNda6UyS1qjcp5XZaDuSMVJFPFc93QZ9ckY8kZpRYlTYHaPp68bP8nB7NDdnwwh6RtXy0oQ_sGYjtaoiZWJ_gZlk')" }}>
                <span className={styles.dayBadge}>Day 12</span>
              </div>
              <div className={styles.cardContent}>
                <h4>White Widow</h4>
                <p className={styles.cardLoc}>Indoor • Tent B</p>
                <div className={styles.cardTags}>
                  <span className={styles.tagPrimary}>Seedling</span>
                  <span>Hybrid</span>
                </div>
                <div className={styles.cardFooter}>
                  <button><span className="material-symbols-outlined">edit_note</span> Log Journal</button>
                </div>
              </div>
            </article>

            <div className={styles.addCard}>
              <div className={styles.addIcon}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4>Grow Something New</h4>
              <p>Start a new journal or add an existing plant.</p>
              <button>+ Add Plant</button>
            </div>
          </div>
        </section>
      </div>
    </SubpageLayout>
  )
}
