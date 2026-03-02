import AppSidebar from '@/components/AppSidebar/AppSidebar'
import Footer from '@/components/Footer/Footer'
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
  return (
    <div className={styles.layout}>
      {withSidebar && <AppSidebar />}
      <main className={styles.main}>
        <div className={`${styles.content} ${!withSidebar ? styles.contentNoSidebar : ''} ${className}`.trim()}>
          {children}
        </div>
        <Footer />
      </main>
    </div>
  )
}
