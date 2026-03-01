import type { Metadata } from 'next'
import SubpageLayout from '@/components/SubpageLayout/SubpageLayout'
import { getJournalEntries } from '@/lib/journal'
import Image from 'next/image'
import styles from './JournalPage.module.scss'

export const metadata: Metadata = {
  title: 'Grow Journal - GrowButtler',
  description: 'Your personal grow journal with expert insights.',
}

export const revalidate = 60

export default async function JournalPage() {
  const entries = await getJournalEntries()

  // Get the first entry for sidebar (most recent plant)
  const latestEntry = entries?.[0]
  const plantName = latestEntry?.acf?.plant_name || 'Your Plant'
  const plantImage = latestEntry?.imageUrl || null
  const stage = latestEntry?.acf?.stage || 'vegetative'
  const dayNumber = latestEntry?.acf?.day_number || 1

  // Filter out entries that are just plant creation logs (only show observations?)
  // For now show all
  const timelineEntries = entries || []

  return (
    <SubpageLayout>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <div className={styles.plantHeader}>
                <span className={styles.badge}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</span>
                <h1 className={styles.plantName}>{plantName}</h1>
                <p className={styles.daysSince}>Day {dayNumber} since germination</p>
              </div>

              {plantImage && (
                <div className={styles.imageCard}>
                  <Image 
                    src={plantImage}
                    alt={plantName}
                    width={400}
                    height={300}
                    className={styles.plantImg}
                  />
                  <div className={styles.imgLabel}>
                    <span className="material-symbols-outlined">photo_camera</span>
                    Latest
                  </div>
                </div>
              )}

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
                <p className={styles.expertNote}>"Next check-in scheduled. Keep an eye on pH levels this week."</p>
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
              {timelineEntries.map((entry: any) => (
                <div key={entry.id} className={styles.entry}>
                  <div className={styles.dotWrap}>
                    <div className={entry.acf?.entry_type === 'expert_insight' ? styles.expertDot : styles.dot} />
                  </div>
                  <div className={styles.entryContent}>
                    <div className={styles.entryMeta}>
                      <strong>{new Date(entry.date).toLocaleDateString()}</strong>
                      {entry.acf?.day_number && ` • Day ${entry.acf.day_number}`}
                    </div>
                    <div className={styles.bubble}>
                      {entry.imageUrl && (
                        <div className={styles.entryImage}>
                          <Image src={entry.imageUrl} alt="Journal entry" width={200} height={150} />
                        </div>
                      )}
                      <p dangerouslySetInnerHTML={{ __html: entry.content }} />
                      {entry.acf?.temperature_fahrenheit && (
                        <div className={styles.dataGrid}>
                          <div className={styles.dataPoint}>
                            <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>water_drop</span>
                            <div><span>pH</span><strong>{entry.acf.ph_level || 'N/A'}</strong></div>
                          </div>
                          <div className={styles.dataPoint}>
                            <span className="material-symbols-outlined" style={{ color: '#ea580c' }}>thermostat</span>
                            <div><span>Temp</span><strong>{entry.acf.temperature_fahrenheit}°F</strong></div>
                          </div>
                          {entry.acf?.humidity_percent && (
                            <div className={styles.dataPoint}>
                              <span className="material-symbols-outlined" style={{ color: '#10b981' }}>water_drop</span>
                              <div><span>Humidity</span><strong>{entry.acf.humidity_percent}%</strong></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {timelineEntries.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                No journal entries yet. Add a plant to get started!
              </p>
            )}
          </main>
        </div>
      </div>
    </SubpageLayout>
  )
}
