'use client'

/**
 * Reusable dashboard components
 */

import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: string
  trend?: {
    direction: 'up' | 'down'
    percentage: number
  }
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

export function StatCard({ label, value, icon, trend, color = 'primary' }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {trend && (
          <p className={`stat-trend trend--${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
          </p>
        )}
      </div>
    </div>
  )
}

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  interactive?: boolean
}

export function Card({ 
  title, 
  subtitle, 
  children, 
  footer, 
  className = '',
  interactive = false 
}: CardProps) {
  return (
    <div className={`card ${interactive ? 'card--interactive' : ''} ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}

interface TableProps {
  columns: Array<{
    key: string
    label: string
    width?: string
    align?: 'left' | 'center' | 'right'
  }>
  rows: Array<Record<string, any>>
  onRowClick?: (row: any) => void
  loading?: boolean
  emptyMessage?: string
}

export function Table({ 
  columns, 
  rows, 
  onRowClick, 
  loading = false,
  emptyMessage = 'No data available'
}: TableProps) {
  if (loading) {
    return <div className="table-loading">Loading...</div>
  }

  if (rows.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th 
                key={col.key}
                className={`table-header table-align--${col.align || 'left'}`}
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr 
              key={idx}
              className={onRowClick ? 'table-row--clickable' : ''}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td 
                  key={`${idx}-${col.key}`}
                  className={`table-cell table-align--${col.align || 'left'}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ 
  icon = '📭', 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && (
        <a href={action.href} className="btn btn--primary">
          {action.label}
        </a>
      )}
    </div>
  )
}

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  closeable?: boolean
  onClose?: () => void
}

export function Alert({ 
  type, 
  title, 
  message, 
  closeable = false,
  onClose 
}: AlertProps) {
  return (
    <div className={`alert alert--${type}`} role="alert">
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <p className="alert-message">{message}</p>
      </div>
      {closeable && (
        <button 
          className="alert-close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  )
}

interface BadgeProps {
  label: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
}

export function Badge({ 
  label, 
  variant = 'neutral',
  size = 'md',
  icon
}: BadgeProps) {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {label}
    </span>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Previous
      </button>
      
      <div className="pagination-numbers">
        {pages.map(page => (
          <button
            key={page}
            className={`pagination-number ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  )
}
