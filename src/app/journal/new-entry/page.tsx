'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './NewJournalEntry.module.scss'

function NewJournalEntryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plantId = searchParams.get('plantId')

  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0])
  const [narrative, setNarrative] = useState('')
  const [temperature, setTemperature] = useState(78)
  const [humidity, setHumidity] = useState(55)
  const [nutrientMix, setNutrientMix] = useState('')
  const [phLevel, setPhLevel] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isPastDate = () => {
    const selected = new Date(entryDate)
    const today = new Date()
    selected.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return selected < today
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPastDate()) {
      setError('Cannot upload images for past dates.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setError(null)
    setIsLoading(true)
    try {
      let mediaId: number | undefined
      if (photo) {
        if (isPastDate()) throw new Error('Cannot upload images for past dates')
        const formData = new FormData()
        formData.append('file', photo)
        const uploadRes = await fetch('/api/upload-image', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed')
        mediaId = uploadData.id
      }

      const response = await fetch('/api/journal-entry/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          entryDate,
          narrative,
          temperature,
          humidity,
          nutrientMix,
          phLevel,
          featuredMediaId: mediaId,
          plantId, // Associate entry with plant
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save entry')

      router.back()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.closeBtn} onClick={() => router.back()}>
          <span className="material-symbols-outlined">close</span>
          <span>Cancel</span>
        </button>
        <h1>New Entry{plantId ? '' : ''}</h1>
        <div className={styles.spacer}></div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.field}>
            <label htmlFor="entryDate">Entry Date</label>
            <input
              id="entryDate"
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
            {isPastDate() && <small className={styles.warning}>⚠️ Image upload disabled for past dates</small>}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.photoUpload}>
            <div className={styles.photoContent}>
              <div className={styles.photoIcon}><span className="material-symbols-outlined">add_a_photo</span></div>
              <div className={styles.photoText}>
                <p className={styles.photoTitle}>Capture the Growth</p>
                <p className={styles.photoSubtitle}>High-resolution garden progress</p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
              ref={fileInputRef}
              disabled={isPastDate() || isLoading}
            />
          </label>
          {photoPreview && (
            <div className={styles.imagePreview}>
              <img src={photoPreview} alt="Preview" />
              <button type="button" className={styles.removeImage} onClick={() => { setPhoto(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }} disabled={isLoading}>×</button>
            </div>
          )}
        </section>

        <section className={styles.vitalsSection}>
          <div className={styles.sectionHeader}><span className="material-symbols-outlined">thermostat</span><h2>Environmental Vitals</h2></div>
          <div className={styles.vitalsContent}>
            <div className={styles.vitalItem}>
              <div className={styles.vitalLabel}><label>Temperature</label><span className={styles.vitalValue}>{temperature}°F</span></div>
              <div className={styles.sliderWrap}>
                <div className={styles.sliderTrack}><div className={styles.sliderFill} style={{ width: `${((temperature - 70) / (90 - 70)) * 100}%` }}></div></div>
                <input type="range" min="70" max="90" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className={styles.slider} />
              </div>
              <div className={styles.sliderLabels}><span>70°F</span><span>90°F</span></div>
            </div>
            <div className={styles.vitalItem}>
              <div className={styles.vitalLabel}><label>Humidity</label><span className={styles.vitalValue}>{humidity}%</span></div>
              <div className={styles.sliderWrap}>
                <div className={styles.sliderTrack}><div className={styles.sliderFill} style={{ width: `${humidity}%` }}></div></div>
                <input type="range" min="40" max="70" value={humidity} onChange={(e) => setHumidity(Number(e.target.value))} className={styles.slider} />
              </div>
              <div className={styles.sliderLabels}><span>40%</span><span>70%</span></div>
            </div>
          </div>
        </section>

        <section className={styles.nutrientSection}>
          <div className={styles.sectionHeader}><span className="material-symbols-outlined">science</span><h2>Nutrient Logging</h2></div>
          <div className={styles.nutrientGrid}>
            <div className={styles.inputGroup}><label>Nutrient Mix</label><input type="text" placeholder="e.g. Flora Bloom" value={nutrientMix} onChange={(e) => setNutrientMix(e.target.value)} /></div>
            <div className={styles.inputGroup}><label>pH Level</label><input type="text" placeholder="6.2" value={phLevel} onChange={(e) => setPhLevel(e.target.value)} /></div>
          </div>
        </section>

        <section className={styles.narrativeSection}>
          <div className={styles.sectionHeader}><span className="material-symbols-outlined">edit_note</span><h2>Daily Narrative</h2></div>
          <div className={styles.textAreaWrap}>
            <textarea placeholder="How is the garden today?" value={narrative} onChange={(e) => setNarrative(e.target.value)} rows={6}></textarea>
            <span className={styles.penIcon} aria-hidden>📝</span>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.saveBtn} onClick={handleSave} disabled={isLoading}>
          <span className="material-symbols-outlined">auto_stories</span>
          {isLoading ? 'Saving...' : 'Save to Chronicle'}
        </button>
      </footer>
    </div>
  )
}

export default function NewJournalEntryPage() {
  return (
    <Suspense fallback={<div className={styles.container} style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div>}>
      <NewJournalEntryContent />
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'
