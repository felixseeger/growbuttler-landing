/**
 * Growbuttler (User) Dashboard Layout
 */

import type { Metadata } from 'next'
import { DashboardNav } from '@/components/DashboardNav'
import '@/styles/dashboard.scss'
// import { mockUsers } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'My Dashboard - GrowButtler',
  description: 'Your consultation and progress dashboard',
  robots: {
    index: false, // Don't index dashboard pages
    follow: false,
  },
}

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  // In production, get actual user from session
  const currentUser: { name: string; avatar?: string } = { name: 'User' }

  return (
    <div className="dashboard-layout user-dashboard">
      <DashboardNav 
        userType="user"
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
