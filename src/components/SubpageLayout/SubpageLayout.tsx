'use client'

import AppSidebar from '@/components/AppSidebar/AppSidebar'
import Footer from '@/components/Footer/Footer'
import Branding from '@/components/Branding/Branding'
import { useSidebar } from '@/context/SidebarContext'
import styles from './SubpageLayout.module.scss'

export default function SubpageLayout({
  children,
  withSidebar = true,
  className = '',
}: {
  children: React.ReactNode
  withSidebar?: boolean
  className?: string
}) {
  const { isCollapsed, toggleCollapse } = useSidebar()

  return (
    <div className={styles.layout}>
      {withSidebar && <AppSidebar />}
      <main className={styles.main}>
        <div className={`${styles.content} ${!withSidebar ? styles.contentNoSidebar : ''} ${className}`.trim()}>
          {withSidebar && isCollapsed && (
            <div className={styles.topLogoToggle}>
              <Branding 
                onClick={(e) => {
                  e.preventDefault()
                  toggleCollapse()
                }}
              />
            </div>
          )}
          {children}
        </div>
        <Footer />
      </main>
    </div>
  )
}
