import type { Metadata } from 'next'
import SubpageLayout from '@/components/SubpageLayout/SubpageLayout'
import DashboardGreeting from '@/components/DashboardGreeting'
import DashboardClient from './DashboardClient'
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

        {/* Plant Grid - Client Component */}
        <DashboardClient />
      </div>
    </SubpageLayout>
  )
}
