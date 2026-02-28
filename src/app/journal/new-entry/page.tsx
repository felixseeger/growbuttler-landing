'use client'

import { useState } from 'react'
import styles from './NewJournalEntry.module.scss'

export default function NewJournalEntryPage() {
  const [photo, setPhoto] = useState<File | null>(null)
  const [temperature, setTemperature] = useState(78)
  const [humidity, setHumidity] = useState(55)
  const [nutrientMix, setNutrientMix] = useState('')
  const [phLevel, setPhLevel] = useState('')
  const [narrative, setNarrative] = useState('')

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(file)
  }

  const handleSave = () => {
    // Handle save logic here
    console.log({
      photo,
      temperature,
      humidity,
      nutrientMix,
      phLevel,
      narrative
    })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.closeBtn}>
          <span className="material-symbols-outlined">close</span>
          <span>Cancel</span>
        </button>
        <h1>New Entry</h1>
        <div className={styles.spacer}></div>
      </header>

      <main className={styles.main}>
        {/* Photo Upload */}
        <div className={styles.section}>
          <label className={styles.photoUpload}>
            <div className={styles.photoContent}>
              <div className={styles.photoIcon}>
                <span className="material-symbols-outlined">add_a_photo</span>
              </div>
              <div className={styles.photoText}>
                <p className={styles.photoTitle}>Capture the Growth</p>
                <p className={styles.photoSubtitle}>High-resolution garden progress</p>
              </div>
            </div>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
          </label>
          {photo && <p className={styles.photoName}>{photo.name}</p>}
        </div>

        {/* Environmental Vitals */}
        <section className={styles.vitalsSection}>
          <div className={styles.sectionHeader}>
            <span className="material-symbols-outlined">thermostat</span>
            <h2>Environmental Vitals</h2>
          </div>
          <div className={styles.vitalsContent}>
            {/* Temperature */}
            <div className={styles.vitalItem}>
              <div className={styles.vitalLabel}>
                <label>Temperature</label>
                <span className={styles.vitalValue}>{temperature}°F</span>
              </div>
              <div className={styles.sliderWrap}>
                <div className={styles.sliderTrack}>
                  <div 
                    className={styles.sliderFill} 
                    style={{ width: `${((temperature - 70) / (90 - 70)) * 100}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="70"
                  max="90"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderLabels}>
                <span>70°F</span>
                <span>90°F</span>
              </div>
            </div>

            {/* Humidity */}
            <div className={styles.vitalItem}>
              <div className={styles.vitalLabel}>
                <label>Humidity</label>
                <span className={styles.vitalValue}>{humidity}%</span>
              </div>
              <div className={styles.sliderWrap}>
                <div className={styles.sliderTrack}>
                  <div 
                    className={styles.sliderFill} 
                    style={{ width: `${humidity}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="40"
                  max="70"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderLabels}>
                <span>40%</span>
                <span>70%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Nutrient Logging */}
        <section className={styles.nutrientSection}>
          <div className={styles.sectionHeader}>
            <span className="material-symbols-outlined">science</span>
            <h2>Nutrient Logging</h2>
          </div>
          <div className={styles.nutrientGrid}>
            <div className={styles.inputGroup}>
              <label>Nutrient Mix</label>
              <input
                type="text"
                placeholder="e.g. Flora Bloom"
                value={nutrientMix}
                onChange={(e) => setNutrientMix(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>pH Level</label>
              <input
                type="text"
                placeholder="6.2"
                value={phLevel}
                onChange={(e) => setPhLevel(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Daily Narrative */}
        <section className={styles.narrativeSection}>
          <div className={styles.sectionHeader}>
            <span className="material-symbols-outlined">edit_note</span>
            <h2>Daily Narrative</h2>
          </div>
          <div className={styles.textAreaWrap}>
            <textarea
              placeholder="How is the garden today?"
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={6}
            ></textarea>
            <span className={styles.penIcon} aria-hidden>📝</span>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <button className={styles.saveBtn} onClick={handleSave}>
          <span className="material-symbols-outlined">auto_stories</span>
          Save to Chronicle
        </button>
      </footer>
    </div>
  )
}
