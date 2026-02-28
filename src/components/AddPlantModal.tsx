'use client'

import { useState } from 'react'
import styles from './AddPlantModal.module.scss'

interface AddPlantModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
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
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/plants/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          strain,
          stage,
          location,
          startDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add plant')
      }

      // Reset form
      setName('')
      setStrain('')
      setStage('seedling')
      setLocation('')
      setStartDate(new Date().toISOString().split('T')[0])

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add plant')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add New Plant</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label htmlFor="name">
              Plant Name <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Northern Lights #1"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="strain">Strain/Variety</label>
            <input
              id="strain"
              type="text"
              value={strain}
              onChange={(e) => setStrain(e.target.value)}
              placeholder="e.g., Northern Lights"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="stage">
              Growth Stage <span className={styles.required}>*</span>
            </label>
            <select
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              required
            >
              <option value="seedling">Seedling</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="harvest">Harvest</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Indoor • Tent A"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
