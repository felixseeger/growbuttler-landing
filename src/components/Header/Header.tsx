'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Header.module.scss'
import Branding from '@/components/Branding/Branding'

interface NavLink {
  label: string
  url: string
}

interface HeaderProps {
  logoLabel?: string
  logoImage?: string | null
  logoIcon?: string
  links?: NavLink[] | null
  loginLabel?: string
  ctaLabel?: string
  ctaUrl?: string
}

const defaultLinks: NavLink[] = [
  { label: 'Journal', url: '/journal' },
  { label: 'Expert Directory', url: '/experts' },
  { label: 'Community', url: '/community' },
]

const normalizeCtaLabel = (label: string): string => {
  const t = label.trim()
  if (!t) return label
  const fixed = (t.startsWith('etzt ') ? 'J' + t : t).replace(/\bLoslegen\b/, 'loslegen')
  return fixed
}

export default function Header({
  logoLabel = 'GrowButtler',
  logoImage = null,
  logoIcon = 'spa',
  links = defaultLinks,
  loginLabel = 'Log In',
  ctaLabel = 'Buddler werden',
  ctaUrl = '/signup',
}: HeaderProps) {
  const safeLinks = Array.isArray(links) && links.length > 0 ? links : defaultLinks
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const displayCtaLabel = normalizeCtaLabel(ctaLabel)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Branding 
          logoLabel={logoLabel}
          logoImage={logoImage}
          logoIcon={logoIcon}
          onClick={closeMobileMenu}
        />
        <div className={styles.links}>
          {safeLinks.map((item) => (
            <Link key={item.label} href={item.url} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className={styles.actions}>
          <Link href="/login" className={styles.login}>{loginLabel}</Link>
          <Link href={ctaUrl} className={styles.cta}>{displayCtaLabel}</Link>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span className={styles.mobileMenuIcon} aria-hidden>{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <>
          <button
            type="button"
            className={styles.mobileBackdrop}
            aria-label="Close mobile navigation"
            onClick={closeMobileMenu}
          />
          <div className={styles.mobilePanel}>
            <div className={styles.mobileLinks}>
              {safeLinks.map((item) => (
                <Link key={`mobile-${item.label}`} href={item.url} className={styles.mobileLink} onClick={closeMobileMenu}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className={styles.mobileActions}>
              <Link href="/login" className={styles.mobileLogin} onClick={closeMobileMenu}>
                {loginLabel}
              </Link>
              <Link href={ctaUrl} className={styles.mobileCta} onClick={closeMobileMenu}>
                {displayCtaLabel}
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
