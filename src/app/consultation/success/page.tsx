'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './ConsultationSuccess.module.scss'

export default function ConsultationSuccessPage() {
  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.closeBtn}>
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className={styles.title}>The Clinic</h2>
      </div>

      <main className={styles.main}>
        {/* Success Visual */}
        <div className={styles.successVisual}>
          <div className={styles.successContent}>
            <div className={styles.checkIcon}>
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
        </div>

        {/* Confirmation Text */}
        <div className={styles.confirmation}>
          <h2 className={styles.caseNumber}>Case #2049 Submitted</h2>
          <p className={styles.message}>
            Dr. Aris Thorne will review your evidence within 4 hours.
          </p>
        </div>

        {/* Summary Card */}
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Summary</h3>
          <div className={styles.summaryContent}>
            <div className={styles.summaryImage} style={{
              backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuD8Ddvd4C0Aw91hOnr0Ji4eaeeK43KJmeEygx8t2mwcUvySsQAp4ByBVeI-7qBz0gC8_52gek4-T9iuAYYFB-5qK1uNr4a9CUl0-oY23xJ564aulqy6fknhHYIeIIle8crwe8MAZwT6Qi2UQ3JhirVZ6XIJgjAMdT0Ps-sqtFpDIGvpJpsX80uZGH7zyKj3m7D7feSyvjeOPxAcI3LzFM8b65UGILmbD1QPtIvsrxOna7ewFobnYG4yWTdaUOfnBuT9iOc3wsXmGVE)'
            }} />
            <div className={styles.expertInfo}>
              <p className={styles.expertLabel}>Assigned Expert</p>
              <h4 className={styles.expertName}>Dr. Aris Thorne</h4>
              <div className={styles.expertRole}>
                <span className="material-symbols-outlined">verified</span>
                <span>Botanical Specialist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Info */}
        <div className={styles.infoBox}>
          <span className="material-symbols-outlined">notifications_active</span>
          <p>
            A notification will be sent once your feedback is ready. You can track progress in your dashboard.
          </p>
        </div>
      </main>

      {/* Fixed Footer Actions */}
      <footer className={styles.footer}>
        <Link href="/" className={styles.btnPrimary}>
          Return to Sanctuary
        </Link>
        <button className={styles.btnSecondary}>
          View Case Status
        </button>
      </footer>
    </div>
  )
}
