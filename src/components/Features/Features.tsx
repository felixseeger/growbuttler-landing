import styles from './Features.module.scss'

interface Feature {
  icon?: string
  title?: string
  description?: string
}

interface FeaturesProps {
  sectionTitle?: string
  sectionSubtitle?: string
  features?: Feature[]
}

const defaultFeatures: Feature[] = [
  {
    icon: 'verified_user',
    title: 'Geprüfte Meister',
    description: 'Arbeiten Sie mit verifizierten Meistergärtnern zusammen, die Ihre Region kennen — Klima, Wasser, Rahmenbedingungen.',
  },
  {
    icon: 'video_camera_front',
    title: 'Video-Diagnostik',
    description: 'Diagnostik per Live-Stream mit unseren erfahrenen Experten, mit visueller Bestätigung durch Fachleute.',
  },
  {
    icon: 'sensors',
    title: 'IoT-Integration',
    description: 'Tracken Sie Ihre Pflanzen mit Echtzeit-Umweltdaten und historischer Analyse.',
  },
]

export default function Features({
  sectionTitle = 'Kultivierung, verfeinert.',
  sectionSubtitle = 'Wir verbinden zertifizierte Expertise mit lokalem Wissen – und geben Ihnen die Tools, die Sie zum Erfolg brauchen.',
  features = defaultFeatures,
}: FeaturesProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{sectionTitle}</h2>
        <p className={styles.subtitle}>{sectionSubtitle}</p>
      </div>
      <div className={styles.grid}>
        {features.map((item, i) => (
          <article key={i} className={styles.card}>
            <div className={styles.iconWrap}>
              <span className={styles.icon} aria-hidden>{item.icon ?? 'circle'}</span>
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
