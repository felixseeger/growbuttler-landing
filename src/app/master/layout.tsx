/**
 * Master Growbuttler (Expert) Dashboard Layout
 */

import type { Metadata } from 'next'
import { DashboardNav } from '@/components/DashboardNav'
import '@/styles/dashboard.scss'
// import { mockUsers } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Master Dashboard - GrowButtler',
  description: 'Expert consultation and earnings dashboard',
  robots: {
    index: false, // Don't index dashboard pages
    follow: false,
  },
}

interface MasterLayoutProps {
  children: React.ReactNode
}

export default function MasterLayout({ children }: MasterLayoutProps) {
  // In production, get actual user from session
  const currentUser: { name: string; avatar?: string } = { name: 'Master Expert' }

  return (
    <div className="dashboard-layout master-dashboard">
      <DashboardNav 
        userType="master"
        userName={currentUser?.name}
        avatar={currentUser?.avatar}
      />
      
      <main className="dashboard-main" role="main">
        <div className="dashboard-container">
          {children}
        </div>
      </main>

      <footer className="dashboard-footer" role="contentinfo">
        <p>&copy; 2024 GrowButtler. All rights reserved.</p>
      </footer>
    </div>
  )
}
