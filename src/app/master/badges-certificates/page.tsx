/**
 * Master Badges & Certificates - Achievements, credentials display
 */

import { Metadata } from 'next'
import { Card, Badge, EmptyState } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Badges & Certificates - Expert | GrowButtler',
  description: 'View and manage your achievements and credentials',
}

export default function MasterBadgesCertificates() {
  const badges = [
    {
      id: 1,
      name: 'Expert Cultivator',
      description: 'Completed 50+ successful consultations',
      icon: '🏆',
      category: 'achievement',
      awardedAt: 'Jan 15, 2024'
    },
    {
      id: 2,
      name: 'Verified Expert',
      description: 'Certified and verified credentials',
      icon: '✓',
      category: 'certification',
      awardedAt: 'Dec 1, 2023'
    },
    {
      id: 3,
      name: 'Perfect Rating',
      description: 'Maintained 4.8+ average rating',
      icon: '⭐',
      category: 'achievement',
      awardedAt: 'Feb 20, 2024'
    },
  ]

  const certificates = [
    {
      id: 1,
      title: 'Cannabis Cultivation Certification',
      issuer: 'GrowButtler Academy',
      issueDate: 'Jan 2023',
      expiryDate: 'Jan 2025',
      status: 'active',
      credentialId: 'CB-2023-12345'
    },
    {
      id: 2,
      title: 'Pest Management Specialist',
      issuer: 'Agricultural Institute',
      issueDate: 'Jun 2022',
      expiryDate: 'Jun 2025',
      status: 'active',
      credentialId: 'PM-2022-67890'
    },
    {
      id: 3,
      title: 'Soil Science Basics',
      issuer: 'Online Learning Platform',
      issueDate: 'Sep 2021',
      expiryDate: null,
      status: 'active',
      credentialId: 'SS-2021-11111'
    },
  ]

  return (
    <div className="page-master-badges-certificates">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/master/dashboard' },
          { label: 'Badges & Certificates' }
        ]}
      />

      <header className="page-header">
        <h1>Badges & Certificates</h1>
        <p>Display your achievements and professional credentials</p>
      </header>

      {/* Badges Section */}
      <section className="badges-section">
        <h2>Your Achievements</h2>
        <div className="badges-grid">
          {badges.map(badge => (
            <div key={badge.id} className="badge-card">
              <div className="badge-icon-large">{badge.icon}</div>
              <h3>{badge.name}</h3>
              <p className="badge-description">{badge.description}</p>
              <p className="badge-date">Earned: {badge.awardedAt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certificates Section */}
      <section className="certificates-section">
        <h2>Professional Credentials</h2>
        
        <Card title="Manage Certificates" subtitle="Your professional certifications">
          <div className="certificates-list">
            {certificates.map(cert => (
              <div key={cert.id} className="certificate-item">
                <div className="cert-header">
                  <div>
                    <h4>{cert.title}</h4>
                    <p className="cert-issuer">{cert.issuer}</p>
                  </div>
                  <span className={`badge badge--${cert.status === 'active' ? 'success' : 'danger'}`}>
                    {cert.status}
                  </span>
                </div>
                
                <div className="cert-details">
                  <div className="cert-detail">
                    <span className="label">Issued:</span>
                    <span className="value">{cert.issueDate}</span>
                  </div>
                  {cert.expiryDate && (
                    <div className="cert-detail">
                      <span className="label">Expires:</span>
                      <span className="value">{cert.expiryDate}</span>
                    </div>
                  )}
                  <div className="cert-detail">
                    <span className="label">Credential ID:</span>
                    <span className="value">{cert.credentialId}</span>
                  </div>
                </div>

                <div className="cert-actions">
                  <a href="#" className="btn btn--secondary btn--small">View Certificate</a>
                  <a href="#" className="btn btn--secondary btn--small">Verify</a>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add New Certificate */}
        <Card title="Add New Certificate" subtitle="Upload or link a new credential">
          <div className="add-certificate-form">
            <div className="form-group">
              <label htmlFor="cert-title">Certificate Title</label>
              <input 
                id="cert-title"
                type="text" 
                className="form-input"
                placeholder="e.g., Cannabis Cultivation Certification"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cert-issuer">Issuing Organization</label>
                <input 
                  id="cert-issuer"
                  type="text" 
                  className="form-input"
                  placeholder="e.g., GrowButtler Academy"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cert-date">Issue Date</label>
                <input 
                  id="cert-date"
                  type="date" 
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cert-expiry">Expiration Date (optional)</label>
              <input 
                id="cert-expiry"
                type="date" 
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cert-url">Certificate URL</label>
              <input 
                id="cert-url"
                type="url" 
                className="form-input"
                placeholder="https://..."
              />
            </div>

            <button className="btn btn--primary">Add Certificate</button>
          </div>
        </Card>
      </section>
    </div>
  )
}
