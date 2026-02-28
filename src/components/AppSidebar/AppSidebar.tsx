'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AppSidebar.module.scss'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/journal', label: 'Journal', icon: 'book_2' },
  { href: '/experts', label: 'Experts', icon: 'school' },
  { href: '/community', label: 'Community', icon: 'groups' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <div>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>
              <span className="material-symbols-outlined" aria-hidden>potted_plant</span>
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>GrowButler</span>
              <span className={styles.brandSub}>My Garden</span>
            </div>
          </div>
          <nav className={styles.nav}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  <span className={styles.navIcon} aria-hidden>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className={styles.bottom}>
          <div className={styles.harvestCard}>
            <div className={styles.harvestRow}>
              <span className={styles.harvestLabel}>NEXT HARVEST</span>
              <span className={styles.harvestDays}>14 DAYS</span>
            </div>
            <div className={styles.harvestBar}>
              <div className={styles.harvestBarFill} style={{ width: '75%' }} />
            </div>
            <p className={styles.harvestPlant}>Northern Lights #5</p>
          </div>
          <Link href="/dashboard" className={styles.ctaNew}>
            <span className={styles.ctaIcon} aria-hidden>add</span>
            <span>New Plant</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
