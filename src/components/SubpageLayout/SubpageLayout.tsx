import AppSidebar from '@/components/AppSidebar/AppSidebar'
import Header from '@/components/Header/Header'
import { getSiteNavigationData } from '@/lib/wordpress'
import styles from './SubpageLayout.module.scss'

export default async function SubpageLayout({
  children,
  withSidebar = true,
  className = '',
}: {
  children: React.ReactNode
  withSidebar?: boolean
  className?: string
}) {
  const nav = await getSiteNavigationData()
  return (
    <div className={styles.layout}>
      {withSidebar && <AppSidebar />}
      <main className={styles.main}>
        <Header
          logoLabel={nav.logoLabel}
          logoImage={nav.logoImage}
          logoIcon={nav.logoIcon}
          links={nav.links}
          loginLabel={nav.loginLabel}
          ctaLabel={nav.ctaLabel}
        />
        <div className={`${styles.content} ${!withSidebar ? styles.contentNoSidebar : ''} ${className}`.trim()}>
          {children}
        </div>
      </main>
    </div>
  )
}
