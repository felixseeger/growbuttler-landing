'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import SubpageLayout from '@/components/SubpageLayout/SubpageLayout'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../JournalPage.module.scss'

function PlantJournalContent() {
  const params = useParams()
  const plantId = params.plantId as string
  
  const [plant, setPlant] = useState<any>(null)
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!plantId) {
        setError('No plant ID provided')
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        
        const [plantsRes, entriesRes] = await Promise.all([
          fetch('/api/plants', { credentials: 'include' }),
          fetch(`/api/journal-entries?plantId=${plantId}`, { credentials: 'include' })
        ])

        // Handle authentication errors
        if (plantsRes.status === 401 || entriesRes.status === 401) {
          window.location.href = '/login'
          return
        }

        if (!plantsRes.ok || !entriesRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const plantsData = await plantsRes.json()
        const entriesData = await entriesRes.json()

        const foundPlant = (plantsData.plants || []).find((p: any) => String(p.id) === String(plantId))
        
        if (!foundPlant) {
          setError('Plant not found')
        } else {
          setPlant(foundPlant)
          setEntries(entriesData.entries || [])
        }
      } catch (err: any) {
        console.error('Error fetching journal data:', err)
        setError(err.message || 'Failed to load journal data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [plantId])

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>
  }

  if (error || !plant) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>{error || 'Plant not found'}</h2>
        <Link href="/dashboard">Back to dashboard</Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <div className={styles.plantHeader}>
              <span className={styles.badge}>{plant.stage?.charAt(0).toUpperCase() + plant.stage?.slice(1) || 'Unknown'}</span>
              <h1 className={styles.plantName}>{plant.name}</h1>
              <p className={styles.daysSince}>Day {plant.dayNumber} since germination</p>
            </div>

            {plant.imageUrl && (
              <div className={styles.imageCard}>
                <Image src={plant.imageUrl} alt={plant.name} width={400} height={300} className={styles.plantImg} />
                <div className={styles.imgLabel}><span className="material-symbols-outlined">photo_camera</span> Latest</div>
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
                <button className={styles.chatBtn}><span className="material-symbols-outlined">chat</span></button>
              </div>
              <p className={styles.expertNote}>"Next check-in scheduled. Keep an eye on pH levels this week."</p>
            </div>

            <div className={styles.vitals}>
              <h3>Vitals</h3>
              <div className={styles.vitalsList}>
                <div className={styles.vitalRow}><span className={styles.vitalLabel}><span className="material-symbols-outlined">genetics</span> Genetics</span><span className={styles.vitalValue}>{plant.strain || 'Unknown Strain'}</span></div>
                <div className={styles.vitalRow}><span className={styles.vitalLabel}><span className="material-symbols-outlined">storefront</span> Location</span><span className={styles.vitalValue}>{plant.location || 'Not set'}</span></div>
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.feed}>
          <div className={styles.feedHeader}>
            <h2>Grow Journal</h2>
            <div className={styles.filter}><span>FILTER:</span><select><option>All Entries</option></select></div>
          </div>

          <div className={styles.inputArea}>
            <div className={styles.inputIcon}><span className="material-symbols-outlined">edit_note</span></div>
            <div className={styles.inputWrap}>
              <input type="text" placeholder="How is your plant doing today?" />
            </div>
          </div>

          <div className={styles.timeline}>
            {entries.map((entry) => (
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
                    {entry.imageUrl && <div className={styles.entryImage}><Image src={entry.imageUrl} alt="Journal entry" width={200} height={150} /></div>}
                    <p dangerouslySetInnerHTML={{ __html: entry.content }} />
                    {entry.acf?.temperature_fahrenheit && (
                      <div className={styles.dataGrid}>
                        <div className={styles.dataPoint}><span className="material-symbols-outlined" style={{ color: '#2563eb' }}>water_drop</span><div><span>pH</span><strong>{entry.acf.ph_level || 'N/A'}</strong></div></div>
                        <div className={styles.dataPoint}><span className="material-symbols-outlined" style={{ color: '#ea580c' }}>thermostat</span><div><span>Temp</span><strong>{entry.acf.temperature_fahrenheit}°F</strong></div></div>
                        {entry.acf?.humidity_percent && <div className={styles.dataPoint}><span className="material-symbols-outlined" style={{ color: '#10b981' }}>water_drop</span><div><span>Humidity</span><strong>{entry.acf.humidity_percent}%</strong></div></div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {entries.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No journal entries yet for this plant.</p>
          )}
        </main>
      </div>
    </div>
  )
}

export default function PlantJournalPage() {
  return <PlantJournalContent />
}
