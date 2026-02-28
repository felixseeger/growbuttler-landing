'use client'

import { useState } from 'react'
import AddPlantModal from '@/components/AddPlantModal'
import styles from './DashboardPage.module.scss'
import Image from 'next/image'

export default function DashboardClient() {
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false)

  const handlePlantAdded = () => {
    // Reload the page or update the plant list
    window.location.reload()
  }

  return (
    <>
      {/* Plant Grid */}
      <section className={styles.plantsSection}>
        <div className={styles.sectionHeader}>
          <h3>My Plants</h3>
          <div className={styles.viewToggle}>
            <button>
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button>
              <span className="material-symbols-outlined">view_list</span>
            </button>
          </div>
        </div>

        <div className={styles.plantGrid}>
          <article className={styles.plantCard}>
            <div
              className={styles.cardImg}
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDASAYOvJIMCa5ouzKERZXY_RqBkyV2FnA90qBEnZC2yjqGGeKWE6hrvNTTmWJq7-TE4CVYLVuVwFAQ0105BTjwIw0D-T7hzvzb-CiPm-wZ-igZcmb3ekbOytBvNkEYb792oT_ewR5KkfQf7KWdOgmSDVHeB0dmP2RwgZpRRjXj6PJ8klXgHynj0DoZ3KpYjz7DXfckXnFwL01Mhunmmr7kQr5Vi20dCFqyL3RHonpGKqAXsU3OhQRLD9qi4UzCnuM7edBL5CJ1xgUw')",
              }}
            >
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
                <button>
                  <span className="material-symbols-outlined">edit_note</span>{' '}
                  Log Journal
                </button>
              </div>
            </div>
          </article>

          <article className={styles.plantCard}>
            <div
              className={styles.cardImg}
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCa9srumkHoZW0lzdwcVCsxFFL7numOQi-mdPui3mWP2iogubMXshjxl49xx9MtMBwhbjDE01TAPA4N9MryIACPlA38OD72J_Cj72ecgSiFnWVVvQzw98Kc1DKMmx0Amj0sTFe1CCFFtUdswpYHn5188lQGyfJpFytd9K661IXnqqLLj-a1oqoeTNda6UyS1qjcp5XZaDuSMVJFPFc93QZ9ckY8kZpRYlTYHaPp68bP8nB7NDdnwwh6RtXy0oQ_sGYjtaoiZWJ_gZlk')",
              }}
            >
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
                <button>
                  <span className="material-symbols-outlined">edit_note</span>{' '}
                  Log Journal
                </button>
              </div>
            </div>
          </article>

          <div className={styles.addCard}>
            <div className={styles.addIcon}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h4>Grow Something New</h4>
            <p>Start a new journal or add an existing plant.</p>
            <button onClick={() => setIsAddPlantOpen(true)}>+ Add Plant</button>
          </div>
        </div>
      </section>

      <AddPlantModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onSuccess={handlePlantAdded}
      />
    </>
  )
}
