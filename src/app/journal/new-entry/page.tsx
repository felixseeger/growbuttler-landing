
'use client'

import { Suspense, useState, useRef, DragEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { compressImage, formatFileSize, getSizeReduction } from '@/lib/imageCompression'
import styles from './NewJournalEntry.module.scss'

interface ImageFile {
  file: File
  preview: string
  originalSize: number
  compressedSize?: number
  isCompressing?: boolean
}

function NewJournalEntryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plantId = searchParams.get('plantId')

  const [images, setImages] = useState<ImageFile[]>([])
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0])
  const [narrative, setNarrative] = useState('')
  const [temperature, setTemperature] = useState(78)
  const [humidity, setHumidity] = useState(55)
  const [nutrientMix, setNutrientMix] = useState('')
  const [phLevel, setPhLevel] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isPastDate = () => {
    const selected = new Date(entryDate)
    const today = new Date()
    selected.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return selected < today
  }

  const processFiles = async (files: FileList | File[]) => {
    if (isPastDate()) {
      setError('Cannot upload images for past dates.')
      return
    }

    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'))

    if (fileArray.length === 0) {
      setError('Please select valid image files.')
      return
    }

    // Limit to 5 images per entry
    if (images.length + fileArray.length > 5) {
      setError('Maximum 5 images per entry.')
      return
    }

    setError(null)

    for (const file of fileArray) {
      const originalSize = file.size

      // Create preview
      const reader = new FileReader()
      reader.onload = async (e) => {
        const preview = e.target?.result as string

        // Add image with preview immediately
        const newImage: ImageFile = {
          file,
          preview,
          originalSize,
          isCompressing: true
        }

        setImages(prev => [...prev, newImage])

        // Compress in background
        try {
          const compressed = await compressImage(file)

          // Update with compressed file
          setImages(prev => prev.map(img =>
            img.preview === preview
              ? { ...img, file: compressed, compressedSize: compressed.size, isCompressing: false }
              : img
          ))
        } catch (err) {
          console.error('Compression failed:', err)
          // Keep original file if compression fails
          setImages(prev => prev.map(img =>
            img.preview === preview
              ? { ...img, isCompressing: false }
              : img
          ))
        }
      }
      reader.readAsDataURL(file)
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }

  const removeImage = (preview: string) => {
    setImages(prev => prev.filter(img => img.preview !== preview))
  }

  const handleSave = async () => {
    setError(null)
    setIsLoading(true)
    try {
      // Upload all images
      const uploadedImageIds: string[] = []
      const uploadedImageUrls: string[] = []

      for (const image of images) {
        if (isPastDate()) throw new Error('Cannot upload images for past dates')

        const formData = new FormData()
        formData.append('file', image.file)

        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        if (uploadRes.status === 401) {
          window.location.href = '/login'
          return
        }

        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed')

        uploadedImageIds.push(uploadData.id)
        uploadedImageUrls.push(uploadData.url)
      }

      // Use first image as featured media
      const featuredMediaId = uploadedImageIds[0]
      const featuredImageUrl = uploadedImageUrls[0]

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
          featuredMediaId,
          featuredImageUrl,
          additionalImageIds: uploadedImageIds.slice(1), // Additional images
          additionalImageUrls: uploadedImageUrls.slice(1),
          plantId,
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
        <h1>New Entry</h1>
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
          <div
            className={`${styles.photoUpload} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isPastDate() && !isLoading && fileInputRef.current?.click()}
          >
            <div className={styles.photoContent}>
              <div className={styles.photoIcon}>
                <span className="material-symbols-outlined">
                  {isDragging ? 'file_download' : 'add_a_photo'}
                </span>
              </div>
              <div className={styles.photoText}>
                <p className={styles.photoTitle}>
                  {isDragging ? 'Drop images here' : 'Capture the Growth'}
                </p>
                <p className={styles.photoSubtitle}>
                  {isDragging
                    ? 'Release to add images'
                    : 'Click or drag & drop up to 5 images'}
                </p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              hidden
              ref={fileInputRef}
              disabled={isPastDate() || isLoading}
            />
          </div>

          {images.length > 0 && (
            <div className={styles.imageGallery}>
              {images.map((image, index) => (
                <div key={image.preview} className={styles.imagePreview}>
                  <img src={image.preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className={styles.removeImage}
                    onClick={() => removeImage(image.preview)}
                    disabled={isLoading}
                  >
                    ×
                  </button>
                  {image.isCompressing && (
                    <div className={styles.compressingBadge}>Compressing...</div>
                  )}
                  {image.compressedSize && !image.isCompressing && (
                    <div className={styles.compressionInfo}>
                      {formatFileSize(image.compressedSize)}
                      {image.compressedSize < image.originalSize && (
                        <span className={styles.saved}>
                          {' '}(-{getSizeReduction(image.originalSize, image.compressedSize)}%)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.vitalsSection}>
          <div className={styles.sectionHeader}>
            <span className="material-symbols-outlined">thermostat</span>
            <h2>Environmental Vitals</h2>
          </div>
          <div className={styles.vitalsContent}>
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

