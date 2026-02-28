'use client'

import { useRouter } from 'next/navigation'
import SubpageLayout from '@/components/SubpageLayout/SubpageLayout'
import styles from './settings.module.scss'

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <SubpageLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Account and preferences.</p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <div className={styles.settingItem}>
            <div>
              <h3>Logout</h3>
              <p>Sign out of your account</p>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Abmelden
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Preferences</h2>
          <p className={styles.comingSoon}>More settings coming soon...</p>
        </div>
      </div>
    </SubpageLayout>
  )
}
