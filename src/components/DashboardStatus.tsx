'use client'

import { useEffect, useState } from 'react'

interface Plant {
  id: string
  name: string
  stage: string
  dayNumber: number
  weekNumber: number
}

export default function DashboardStatus() {
  const [status, setStatus] = useState('Your garden is thriving today.')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlants() {
      try {
        const response = await fetch('/api/plants', { credentials: 'include' })

        if (!response.ok) {
          setStatus('Start your growing journey today.')
          return
        }

        const data = await response.json()
        const plants: Plant[] = data.plants || []

        if (plants.length === 0) {
          setStatus('Ready to seed new life?')
          return
        }

        // Generate dynamic status based on plants
        const statusMessages = generateStatus(plants)
        setStatus(statusMessages)
      } catch (error) {
        console.error('Failed to fetch plants:', error)
        setStatus('Your garden awaits.')
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [])

  if (loading) {
    return <p style={{ color: 'var(--color-muted)', fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
      Loading garden status...
    </p>
  }

  return (
    <p style={{ color: 'var(--color-muted)', fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
      {status}
    </p>
  )
}

function generateStatus(plants: Plant[]): string {
  const count = plants.length
  const stages = {
    seedling: plants.filter(p => p.stage === 'seedling').length,
    vegetative: plants.filter(p => p.stage === 'vegetative').length,
    flowering: plants.filter(p => p.stage === 'flowering').length,
    harvest: plants.filter(p => p.stage === 'harvest').length,
  }

  // Priority messages based on stages
  if (stages.harvest > 0) {
    return stages.harvest === 1
      ? `${plants.find(p => p.stage === 'harvest')?.name} is ready for harvest! 🌿`
      : `${stages.harvest} plants ready for harvest! 🌿`
  }

  if (stages.flowering > 0) {
    if (count === 1) {
      const plant = plants[0]
      return `${plant.name} is flowering beautifully. Day ${plant.dayNumber}. 🌸`
    }
    return `${stages.flowering} ${stages.flowering === 1 ? 'plant' : 'plants'} in bloom. Your garden is thriving! 🌸`
  }

  if (stages.vegetative > 0) {
    if (count === 1) {
      const plant = plants[0]
      return `${plant.name} is growing strong. Day ${plant.dayNumber}. 🌱`
    }
    return `${count} ${count === 1 ? 'plant' : 'plants'} growing vigorously. Keep up the great work! 🌱`
  }

  if (stages.seedling > 0) {
    if (count === 1) {
      return `Your seedling is sprouting! Day ${plants[0].dayNumber}. 🌱`
    }
    return `${stages.seedling} ${stages.seedling === 1 ? 'seedling' : 'seedlings'} sprouting. The journey begins! 🌱`
  }

  // Mixed stages or default
  if (count === 1) {
    const plant = plants[0]
    return `${plant.name} is day ${plant.dayNumber} and looking healthy. 💚`
  }

  // Multiple plants, mixed stages
  const oldestPlant = plants.reduce((oldest, current) =>
    current.dayNumber > oldest.dayNumber ? current : oldest
  )

  return `${count} plants in your garden. ${oldestPlant.name} leading at day ${oldestPlant.dayNumber}. 💚`
}
