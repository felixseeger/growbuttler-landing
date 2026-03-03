import Link from 'next/link'
import Image from 'next/image'
import styles from './Branding.module.scss'

interface BrandingProps {
  className?: string
  logoImage?: string | null
  logoLabel?: string
  logoIcon?: string
  showText?: boolean
  iconSize?: number
  onClick?: () => void
}

export default function Branding({
  className = '',
  logoImage = null,
  logoLabel = 'GrowButtler',
  logoIcon = 'spa',
  showText = true,
  iconSize,
  onClick,
}: BrandingProps) {
  return (
    <Link 
      href="/" 
      className={`${styles.branding} ${className}`} 
      onClick={onClick}
    >
      {logoImage ? (
        <Image
          src={logoImage}
          alt={logoLabel}
          width={iconSize || 40}
          height={iconSize || 40}
          className={styles.logoImg}
          unoptimized
        />
      ) : (
        <span 
          className={styles.logoIcon} 
          style={iconSize ? { fontSize: `${iconSize}px` } : undefined}
          aria-hidden
        >
          {logoIcon}
        </span>
      )}
      {showText && <span className={styles.logoText}>{logoLabel}</span>}
    </Link>
  )
}
