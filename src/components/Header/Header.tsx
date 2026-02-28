'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Header.module.scss'

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
  { label: 'Journal', url: '#' },
  { label: 'Expert Directory', url: '#' },
  { label: 'Community', url: '#' },
]

const normalizeCtaLabel = (label: string): string => {
  const t = label.trim()
  if (!t) return label
  const fixed = (t.startsWith('etzt ') ? 'J' + t : t).replace(/\bLoslegen\b/, 'loslegen')
  return fixed
}

export default function Header({
  logoLabel = 'GrowButler',
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
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          {logoImage ? (
            <Image
              src={logoImage}
              alt={logoLabel || 'Logo'}
              width={40}
              height={40}
              className={styles.logoImg}
              unoptimized
            />
          ) : (
            <span className={styles.logoIcon} aria-hidden>{logoIcon}</span>
          )}
          <span className={styles.logoText}>{logoLabel}</span>
        </Link>
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
