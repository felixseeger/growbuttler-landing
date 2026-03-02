'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import AppSidebar from '@/components/AppSidebar/AppSidebar'
import Footer from '@/components/Footer/Footer'
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
  const [quickNote, setQuickNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleEditEntry = (entry: any) => {
    setEditingEntryId(entry.id)
    // Extract text content without HTML tags
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = entry.content
    setEditContent(tempDiv.textContent || tempDiv.innerText || '')
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    setEditContent('')
  }

  const handleSaveEdit = async (entryId: string) => {
    if (!editContent.trim()) return

    try {
      const response = await fetch(`/api/journal-entry/${entryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ narrative: editContent }),
      })

      if (response.status === 401) {
        window.location.href = '/login'
        return
      }

      if (!response.ok) throw new Error('Failed to update entry')

      // Refresh entries
      const entriesRes = await fetch(`/api/journal-entries?plantId=${plantId}`, { credentials: 'include' })
      if (entriesRes.ok) {
        const entriesData = await entriesRes.json()
        setEntries(entriesData.entries || [])
      }

      setEditingEntryId(null)
      setEditContent('')
    } catch (err) {
      console.error('Failed to update entry:', err)
      alert('Failed to update entry')
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    try {
      const response = await fetch(`/api/journal-entry/${entryId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.status === 401) {
        window.location.href = '/login'
        return
      }

      if (!response.ok) throw new Error('Failed to delete entry')

      // Refresh entries
      const entriesRes = await fetch(`/api/journal-entries?plantId=${plantId}`, { credentials: 'include' })
      if (entriesRes.ok) {
        const entriesData = await entriesRes.json()
        setEntries(entriesData.entries || [])
      }
    } catch (err) {
      console.error('Failed to delete entry:', err)
      alert('Failed to delete entry')
    }
  }

  const handleQuickEntry = async () => {
    if ((!quickNote.trim() && !selectedImage) || !plant) return

    setIsSubmitting(true)
    try {
      let imageUrl = ''

      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData()
        formData.append('file', selectedImage)

        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        if (uploadRes.status === 401) {
          window.location.href = '/login'
          return
        }

        if (!uploadRes.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      // Prepare content with image
      let content = quickNote.trim()
      if (imageUrl) {
        content = `<img src="${imageUrl}" alt="Journal entry image" style="max-width: 100%; border-radius: 8px; margin-bottom: 1rem;" />\n${content}`
      }

      const response = await fetch('/api/journal-entry/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          plantId,
          content: content || '📷 Image update',
          postId: entries[0]?.id || null,
        }),
      })

      if (response.status === 401) {
        window.location.href = '/login'
        return
      }

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to add entry')

      // Clear input and refresh entries
      setQuickNote('')
      setSelectedImage(null)
      setImagePreview(null)

      // Reload the page data to show the new comment
      const entriesRes = await fetch(`/api/journal-entries?plantId=${plantId}`, { credentials: 'include' })
      if (entriesRes.ok) {
        const entriesData = await entriesRes.json()
        setEntries(entriesData.entries || [])
      }
    } catch (err) {
      console.error('Failed to add quick entry:', err)
      alert(err instanceof Error ? err.message : 'Failed to add entry')
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
              <input
                type="text"
                placeholder="How is your plant doing today?"
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !selectedImage && handleQuickEntry()}
                disabled={isSubmitting}
              />
              {imagePreview && (
                <div style={{ position: 'relative', marginTop: '0.5rem', display: 'inline-block' }}>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={150}
                    height={150}
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <button
                    onClick={handleRemoveImage}
                    style={{
                      position: 'absolute',
                      top: '0.25rem',
                      right: '0.25rem',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '1.5rem',
                      height: '1.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className={styles.inputActions}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', transition: 'background 0.2s' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>image</span>
                  <span>Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={isSubmitting}
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  className={styles.submitBtn}
                  onClick={handleQuickEntry}
                  disabled={isSubmitting || (!quickNote.trim() && !selectedImage)}
                >
                  {isSubmitting ? 'Adding...' : 'Eintrag hinzufügen'}
                </button>
              </div>
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
                    {entry.acf?.entry_type !== 'expert_insight' && (
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditEntry(entry)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-muted)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Edit entry"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-muted)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete entry"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={styles.bubble}>
                    {entry.imageUrl && <div className={styles.entryImage}><Image src={entry.imageUrl} alt="Journal entry" width={200} height={150} /></div>}
                    {editingEntryId === entry.id ? (
                      <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                            marginBottom: '0.5rem'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleSaveEdit(entry.id)}
                            className={styles.submitBtn}
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              fontSize: '0.875rem',
                              padding: '0.5rem 1rem',
                              background: '#f3f4f6',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p dangerouslySetInnerHTML={{ __html: entry.content }} />
                    )}
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
        <Footer />
      </main>
    </div>
  )
}

export default function PlantJournalPage() {
  return <PlantJournalContent />
}
