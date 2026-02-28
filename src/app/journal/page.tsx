import type { Metadata } from 'next'
import Link from 'next/link'
import SubpageLayout from '@/components/SubpageLayout/SubpageLayout'
import { getJournalContent, getJournalPageData } from '@/lib/wordpress'
import styles from './JournalPage.module.scss'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Journal - Northern Lights #5 - GrowButtler',
  description: 'Detailed growth journal for Northern Lights #5 cultivation.',
}

export const revalidate = 60

export default async function JournalPage() {
  const journalData = await getJournalPageData('journal')
  const journalContent = getJournalContent(journalData)
  
  // Use data from ACF or fallbacks from design
  const header = (journalContent.page_header || {}) as Record<string, string | undefined>
  
  return (
    <SubpageLayout>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <div className={styles.plantHeader}>
                <span className={styles.badge}>Vegetative Stage</span>
                <h1 className={styles.plantName}>{header.title || 'Northern Lights #5'}</h1>
                <p className={styles.daysSince}>Day 34 since germination</p>
              </div>

              <div className={styles.imageCard}>
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeXIiRIAtLerrH6N2X6jVXxXdr-mNJqU_lyAVZCxceYvlRFXrA2h83STDKKvmcuhNoLSKxaKUxrI2u2nvMrhMpaMM8_WWNJNf5KQpOcKuQw1pH1ZjHLUcKS5NrtmyRCTWUrG8mEnFdaWa9amskM3_R8o-i3ew18kG8x3A1Pi5y-evWSOcArZGXKxjGXwMm6stuQdXpggSQQdC7wYD5qjTCCUbZJpUqbR8Jq1Yk84Rrjn2LaICl5rPhrxWvqTRFhZvKKdMkii-3MwrH"
                  alt="Healthy plant"
                  width={400}
                  height={300}
                  className={styles.plantImg}
                />
                <div className={styles.imgLabel}>
                  <span className="material-symbols-outlined">photo_camera</span>
                  Latest
                </div>
              </div>

              <div className={styles.expertCard}>
                <h3 className={styles.expertTitle}>Assigned Expert</h3>
                <div className={styles.expertInfo}>
                  <div className={styles.expertAvatarWrap}>
                    <div className={styles.expertAvatar} style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVs8a6jZQWVCF10rzDwFUrBgQsa9w0B2B7j95Ah0RKwARam4GJCqeS64G3qKDh_VDYBfdbiWeHybpdzp2l-c4OamOxZJB5FGaSoieoo9_RkdMmxVNf9qKDGdtlMIL29_7atWVhOyMmWwgZWWFPbLLFpF_UMe2jRh4ipew8ISUXTDX8tavc_-CMEF3IvCX4CFIaQvUHKf1K_oClITBIYkFQd-MNWlqLcHUVcOuY9Mgn6iIWwOSmGz4pQbt6sMUIqcZa9jhXzdPG6DEP')" }} />
                    <span className={styles.expertStatus} />
                  </div>
                  <div className={styles.expertMeta}>
                    <p className={styles.expertName}>Hanna K.</p>
                    <p className={styles.expertRole}>Master Grower • Berlin</p>
                  </div>
                  <button className={styles.chatBtn}>
                    <span className="material-symbols-outlined">chat</span>
                  </button>
                </div>
                <p className={styles.expertNote}>"Next check-in scheduled for Oct 12th. Keep an eye on pH levels this week."</p>
              </div>

              <div className={styles.vitals}>
                <h3>Vitals</h3>
                <div className={styles.vitalsList}>
                  <div className={styles.vitalRow}>
                    <span className={styles.vitalLabel}><span className="material-symbols-outlined">genetics</span> Genetics</span>
                    <span className={styles.vitalValue}>Indica (80/20)</span>
                  </div>
                  <div className={styles.vitalRow}>
                    <span className={styles.vitalLabel}><span className="material-symbols-outlined">storefront</span> Breeder</span>
                    <span className={styles.vitalValue}>Sensi Seeds</span>
                  </div>
                  <div className={styles.vitalRow}>
                    <span className={styles.vitalLabel}><span className="material-symbols-outlined">calendar_month</span> Harvest Est.</span>
                    <span className={styles.vitalValue}>Oct 15 - Oct 20</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className={styles.feed}>
            <div className={styles.feedHeader}>
              <h2>Grow Journal</h2>
              <div className={styles.filter}>
                <span>FILTER:</span>
                <select>
                  <option>All Entries</option>
                </select>
              </div>
            </div>

            <div className={styles.inputArea}>
              <div className={styles.inputIcon}>
                <span className="material-symbols-outlined">edit_note</span>
              </div>
              <div className={styles.inputWrap}>
                <input type="text" placeholder="How is your plant doing today?" />
                <div className={styles.inputActions}>
                  <button><span className="material-symbols-outlined">add_a_photo</span> Add Photo</button>
                  <button><span className="material-symbols-outlined">science</span> Log pH/EC</button>
                </div>
              </div>
            </div>

            <div className={styles.timeline}>
              <div className={styles.entry}>
                <div className={styles.dotWrap}><div className={styles.dot} /></div>
                <div className={styles.entryContent}>
                  <div className={styles.entryMeta}><strong>Today</strong> 10:42 AM</div>
                  <div className={styles.bubble}>
                    <p>Top dressed with organic worm castings this morning. Soil moisture feels good. No signs of stress after yesterday&apos;s training.</p>
                  </div>
                </div>
              </div>

              <div className={styles.entry}>
                <div className={styles.dotWrap}><div className={`${styles.dot} ${styles.dotFilled}`} /></div>
                <div className={styles.entryContent}>
                  <div className={styles.entryMeta}><strong>Yesterday</strong> Day 33 • 4:15 PM</div>
                  <div className={styles.bubble}>
                    <div className={styles.dataGrid}>
                      <div className={styles.dataPoint}>
                        <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>water_drop</span>
                        <div><span>Water pH</span><strong>6.2</strong></div>
                      </div>
                      <div className={styles.dataPoint}>
                        <span className="material-symbols-outlined" style={{ color: '#ea580c' }}>thermostat</span>
                        <div><span>Temp</span><strong>24.5°C</strong></div>
                      </div>
                    </div>
                    <p>Performed some low stress training (LST) to open up the canopy. The main stem is getting thick!</p>
                  </div>
                </div>
              </div>

              <div className={styles.entry}>
                <div className={styles.dotWrap}>
                  <div className={styles.expertDot}>
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                </div>
                <div className={styles.entryContent}>
                  <div className={styles.entryMeta}><strong>Oct 10</strong> <span className={styles.expertBadge}>Expert Insight</span></div>
                  <div className={`${styles.bubble} ${styles.expertBubble}`}>
                    <div className={styles.expertMsgHeader}>
                      <div className={styles.miniAvatar} style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB_PHMGvdS5lZRHNBYePQ8onEVHgg8vW6FAwy5JK4nRAfU0OEmpyeZt5Kf55nyksC09zXKenNVbV8wZw832IR6c8kEf4djbwqH2DYAtUtxxchE9XoZZ5gUCx0oLmPTLyjHJXx_XCxLS_npuMzj3mmErjbg0Z815JF3oRyLLwsTycY5D_iFBLUmFt0jEzhSXlv6eKRUimFVLoSksyfqqGYV05UIzEdl_2GvfOpn38XG1ZpEIGenJF5IOOl0LtaVhfoL2ACidVWw5HvLj')" }} />
                      <h4>Observation from Hanna</h4>
                    </div>
                    <p>Looking at the photos from Day 30, I noticed the lower fan leaves are slightly yellowing between the veins. This suggests an early magnesium deficiency.</p>
                    <div className={styles.recommendation}>
                      <strong>Recommended Action</strong>
                      <p>Increase CalMag dosage by 2ml/L for next two feeds.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className={styles.loadMore}>View earlier history</button>
          </main>
        </div>
      </div>
    </SubpageLayout>
  )
}
