'use client'

import { useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.inner}>
        <div>
          <Link href="/" className={styles.brand}>
            <div className={styles.logoIcon}>
              <span className="material-symbols-outlined" aria-hidden>spa</span>
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>GrowButler</span>
            </div>
          </Link>
          <nav className={styles.nav}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={closeSidebar}
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
          <Link href="/dashboard" className={styles.ctaNew} onClick={closeSidebar}>
            <span className={styles.ctaIcon} aria-hidden>add</span>
            <span>New Plant</span>
          </Link>
        </div>
      </div>
    </aside>
    </>
  )
}
