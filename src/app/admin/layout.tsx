import type { Metadata } from 'next'
import '@/styles/globals.scss'

export const metadata: Metadata = {
  title: 'Admin - GrowButtler',
  description: 'GrowButtler Admin Dashboard',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <nav style={{
        background: 'var(--color-primary)',
        padding: '1rem 2rem',
        color: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
            🌿 GrowButtler Admin
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="/admin/experts" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>
              Expert Applicants
            </a>
            <a href="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>
              Dashboard
            </a>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
