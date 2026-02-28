/**
 * Navigation component for dashboard
 */

import Link from 'next/link'
import { UserType } from '@/types/dashboard'

interface DashboardNavProps {
  userType: UserType
  userName?: string
  avatar?: string
}

export function DashboardNav({ userType, userName, avatar }: DashboardNavProps) {
  const basePath = userType === 'master' ? '/master' : '/user'
  
  const navItems = userType === 'master' 
    ? [
        { label: 'Dashboard', href: `${basePath}/dashboard` },
        { label: 'Interviews', href: `${basePath}/interviews` },
        { label: 'Payouts', href: `${basePath}/payouts` },
        { label: 'Badges & Certs', href: `${basePath}/badges-certificates` },
        { label: 'Calendar', href: `${basePath}/calendar` },
        { label: 'Profile', href: `${basePath}/profile` },
        { label: 'Settings', href: `${basePath}/settings` },
      ]
    : [
        { label: 'Dashboard', href: `${basePath}/dashboard` },
        { label: 'Upcoming', href: `${basePath}/upcoming-consultations` },
        { label: 'Archive', href: `${basePath}/consultations-archive` },
        { label: 'Badges', href: `${basePath}/badges` },
        { label: 'Certificates', href: `${basePath}/certificates` },
        { label: 'Calendar', href: `${basePath}/calendar` },
        { label: 'Account', href: `${basePath}/payouts` },
        { label: 'Profile', href: `${basePath}/profile` },
        { label: 'Settings', href: `${basePath}/settings` },
      ]

  return (
    <nav className="dashboard-nav" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href={basePath} className="logo">
            🌱 GrowButtler
          </Link>
          <span className="user-type-badge">{userType === 'master' ? 'Expert' : 'Grower'}</span>
        </div>
        
        <div className="nav-links">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="nav-user">
          {avatar && (
            <img src={avatar} alt={userName} className="user-avatar" />
          )}
          {userName && <span className="user-name">{userName}</span>}
        </div>
      </div>
    </nav>
  )
}

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.href ? (
              <>
                <Link href={item.href} className="breadcrumb-link">
                  {item.label}
                </Link>
                {index < items.length - 1 && <span className="breadcrumb-sep">/</span>}
              </>
            ) : (
              <>
                <span className="breadcrumb-current">{item.label}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
