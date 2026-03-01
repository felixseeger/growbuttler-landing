'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AddPlantModal from '@/components/AddPlantModal'
import Link from 'next/link'
import styles from './DashboardPage.module.scss'

interface Plant {
  id: string
  name: string
  strain?: string
  stage: string
  dayNumber: number
  weekNumber: number
  imageUrl?: string | null
  lastUpdated?: string
}

export default function DashboardClient() {
  const router = useRouter()
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false)
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPlants = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/plants', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setPlants(data.plants || [])
      }
    } catch (error) {
      console.error('Failed to fetch plants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlants()
  }, [])

  const handlePlantAdded = (newPlant?: any) => {
    fetchPlants()
    if (newPlant?.id) {
      router.push(`/journal/${newPlant.id}`)
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'seedling': return '#4CAF50'
      case 'vegetative': return '#8BC34A'
      case 'flowering': return '#FF9800'
      case 'harvest': return '#FF5722'
      default: return '#8BC34A'
    }
  }

  const getStageLabel = (stage: string) => {
    return stage?.charAt(0).toUpperCase() + stage?.slice(1) || 'Vegetative'
  }

  return (
    <>
      <section className={styles.plantsSection}>
        <div className={styles.sectionHeader}>
          <h3>My Plants</h3>
          <div className={styles.viewToggle}>
            <button><span className="material-symbols-outlined">grid_view</span></button>
            <button><span className="material-symbols-outlined">view_list</span></button>
          </div>
        </div>

        <div className={styles.plantGrid}>
          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              Loading plants...
            </div>
          ) : (
            <>
              {plants.map((plant) => (
                <Link key={plant.id} href={`/journal/${plant.id}`} className={styles.plantCardLink}>
                  <article className={styles.plantCard}>
                    <div
                      className={styles.cardImg}
                      style={{
                        backgroundImage: plant.imageUrl
                          ? `url('${plant.imageUrl}')`
                          : "url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400')",
                        backgroundColor: '#1a1a1a',
                      }}
                    >
                      <span className={styles.dayBadge}>Day {plant.dayNumber}</span>
                    </div>
                    <div className={styles.cardContent}>
                      <h4>{plant.name}</h4>
                      <p className={styles.cardLoc}>{plant.strain || 'Cannabis Plant'}</p>
                      <div className={styles.cardTags}>
                        <span style={{ backgroundColor: getStageColor(plant.stage), color: 'white' }}>
                          {getStageLabel(plant.stage)}
                        </span>
                        <span>Week {plant.weekNumber}</span>
                      </div>
                      <div className={styles.cardFooter}>
                        <button>Log Journal</button>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}

              <div className={styles.addCard}>
                <div className={styles.addIcon}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h4>Grow Something New</h4>
                <p>Start a new journal or add an existing plant.</p>
                <button onClick={() => setIsAddPlantOpen(true)}>
                  + Add Plant
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <AddPlantModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onSuccess={handlePlantAdded}
      />
    </>
  )
}
