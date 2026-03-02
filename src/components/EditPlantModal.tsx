'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './AddPlantModal.module.scss'

interface EditPlantModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  plant: {
    id: string
    name: string
    strain?: string
    stage: string
    location?: string
    imageUrl?: string | null
  }
}

export default function EditPlantModal({ isOpen, onClose, onSuccess, plant }: EditPlantModalProps) {
  const [name, setName] = useState('')
  const [strain, setStrain] = useState('')
  const [stage, setStage] = useState('vegetative')
  const [location, setLocation] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && plant) {
      setName(plant.name || '')
      setStrain(plant.strain || '')
      setStage(plant.stage || 'vegetative')
      setLocation(plant.location || '')
      setImagePreview(plant.imageUrl || null)
      setSelectedImage(null)
    }
  }, [isOpen, plant])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      let featuredImageUrl = plant.imageUrl || ''

      // Upload new image if selected
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
        featuredImageUrl = uploadData.url
      }

      const response = await fetch(`/api/plants/${plant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          strain,
          stage,
          location,
          featuredImageUrl,
        }),
      })

      if (response.status === 401) {
        window.location.href = '/login'
        return
      }

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update plant')

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update plant')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Plant</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="name">Plant Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="strain">Strain (Optional)</label>
            <input
              type="text"
              id="strain"
              value={strain}
              onChange={(e) => setStrain(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stage">Growth Stage *</label>
            <select
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="seedling">Seedling</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="harvest">Harvest</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location (Optional)</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Tent A, Outdoor"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Plant Image</label>
            {imagePreview && (
              <div className={styles.imagePreview}>
                <Image
                  src={imagePreview}
                  alt="Plant preview"
                  width={200}
                  height={200}
                  style={{ borderRadius: '8px', objectFit: 'cover' }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={isLoading}
              className={styles.fileInput}
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
