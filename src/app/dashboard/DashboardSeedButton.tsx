'use client'

import { useEffect } from 'react'
import styles from './DashboardPage.module.scss'

export default function DashboardSeedButton() {
  const handleClick = () => {
    // Trigger the add plant modal from DashboardClient
    if (typeof window !== 'undefined' && (window as any).__openAddPlantModal) {
      (window as any).__openAddPlantModal()
    }
  }

  return (
    <button className={styles.seedBtn} onClick={handleClick}>
      <span className="material-symbols-outlined">add</span>
      Seed New Life
    </button>
  )
}
