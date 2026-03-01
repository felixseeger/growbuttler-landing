'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './AddPlantModal.module.scss'

interface AddPlantModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (plant?: any) => void
}

export default function AddPlantModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPlantModalProps) {
  const [name, setName] = useState('')
  const [strain, setStrain] = useState('')
  const [stage, setStage] = useState('seedling')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isPastDate = () => {
    const selected = new Date(startDate)
    const today = new Date()
    selected.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return selected < today
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPastDate()) {
      setError('Cannot upload images for past dates. Please select today\'s date.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    const file = e.target.files?.[0] || null
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      let featuredMediaId: number | undefined

      if (imageFile) {
        if (isPastDate()) {
          throw new Error('Cannot upload images for past dates')
        }
        setIsUploadingImage(true)
        const formData = new FormData()
        formData.append('file', imageFile)

        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        })

        const uploadData = await uploadResponse.json()
        if (!uploadResponse.ok) throw new Error(uploadData.error || 'Failed to upload image')
        featuredMediaId = uploadData.id
        setIsUploadingImage(false)
      }

      const response = await fetch('/api/plants/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          strain,
          stage,
          location,
          startDate,
          featuredMediaId,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to add plant')

      setName('')
      setStrain('')
      setStage('seedling')
      setLocation('')
      setStartDate(new Date().toISOString().split('T')[0])
      setImageFile(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''

      onSuccess(data.plant)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add plant')
    } finally {
      setIsLoading(false)
      setIsUploadingImage(false)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setImageFile(null)
      setImagePreview(null)
      setError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add New Plant</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label htmlFor="name">Plant Name <span className={styles.required}>*</span></label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Northern Lights #1" required disabled={isLoading} />
          </div>

          <div className={styles.field}>
            <label htmlFor="strain">Strain/Variety</label>
            <input id="strain" type="text" value={strain} onChange={(e) => setStrain(e.target.value)} placeholder="e.g., Northern Lights" disabled={isLoading} />
          </div>

          <div className={styles.field}>
            <label htmlFor="stage">Growth Stage <span className={styles.required}>*</span></label>
            <select id="stage" value={stage} onChange={(e) => setStage(e.target.value)} required disabled={isLoading}>
              <option value="seedling">Seedling</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="harvest">Harvest</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="location">Location</label>
            <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Indoor • Tent A" disabled={isLoading} />
          </div>

          <div className={styles.field}>
            <label htmlFor="startDate">Start Date</label>
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isLoading} />
            {isPastDate() && <small style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>⚠️ Image upload disabled for past dates</small>}
          </div>

          <div className={styles.field}>
            <label htmlFor="image">Plant Image</label>
            <input id="image" type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" disabled={isLoading || isUploadingImage || isPastDate()} className={styles.fileInput} />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Plant preview" />
                <button type="button" className={styles.removeImage} onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }} disabled={isLoading}>×</button>
              </div>
            )}
            <small style={{ color: '#666', fontSize: '0.75rem' }}>Optional: Add a photo of your plant. Images cannot be uploaded for past dates.</small>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={isLoading || isUploadingImage}>
              {isUploadingImage ? 'Uploading...' : isLoading ? 'Adding...' : 'Add Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
