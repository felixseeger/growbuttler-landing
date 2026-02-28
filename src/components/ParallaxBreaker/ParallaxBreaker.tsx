import Link from 'next/link'
import styles from './ParallaxBreaker.module.scss'

const DEFAULT_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDfYWyHrieWL_kTq08ucvn-uqHOzk5BiyQukyyRbs3Rsn9pvfi_2CtwWEhgdD5-HwA7DkXPGvm3QCEOAuZmlRh09YN4NduczcPIKgvg99qA2M9bax043UIvrgYXywnQSRLvObc06dLkN88YIhYSTw341HDIANBb5tu20yOD3HXG8FO16ziSNTjRiM2gANVKbHlHLrBro-4s6_JfQK-OJwvvGqTQKIqD177sY9EfJWg04UgSRuQ29cXbaMLoUHzPl2E3CN191f30uZTr'

interface ParallaxBreakerProps {
  label?: string
  quote?: string
  ctaLabel?: string
  backgroundImage?: string
}

export default function ParallaxBreaker({
  label = 'The Modern Botanist',
  quote = '"Gartenarbeit ist das reinste Vergnügen des Menschen." — Francis Bacon',
  ctaLabel = 'Beginnen Sie Ihre Reise >',
  backgroundImage = DEFAULT_BG,
}: ParallaxBreakerProps) {
  return (
    <section
      className={styles.section}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-label="Inspirational quote section"
    >
      <div className={styles.overlay} aria-hidden />
      <div className={styles.gradient} aria-hidden />
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <h2 className={styles.quote}>{quote}</h2>
        <Link href="/signup" className={styles.cta}>{ctaLabel}</Link>
      </div>
    </section>
  )
}
