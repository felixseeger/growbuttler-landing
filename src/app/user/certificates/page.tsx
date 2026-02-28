/**
 * User Certificates - Completion certificates
 */

import { Metadata } from 'next'
import { Card, EmptyState } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'My Certificates | GrowButtler',
  description: 'View your completion certificates',
}

export default function UserCertificates() {
  const certificates = [
    {
      id: 1,
      title: 'Cannabis Basics Mastery',
      description: 'Completed comprehensive course on cannabis cultivation fundamentals',
      issueDate: 'Feb 15, 2024',
      expiryDate: null,
      credentialId: 'GBC-2024-001',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'Nutrient Management Specialist',
      description: 'Successfully completed nutrient management training and assessment',
      issueDate: 'Jan 28, 2024',
      expiryDate: 'Jan 28, 2026',
      credentialId: 'NMS-2024-042',
      downloadUrl: '#'
    },
  ]

  return (
    <div className="page-user-certificates">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/user/dashboard' },
          { label: 'Certificates' }
        ]}
      />

      <header className="page-header">
        <h1>Your Certificates</h1>
        <p>Certificates earned through consultations and learning</p>
      </header>

      {/* Certificates List */}
      {certificates.length > 0 ? (
        <div className="certificates-section">
          {certificates.map(cert => (
            <Card 
              key={cert.id}
              title={cert.title}
              subtitle={cert.description}
              interactive
            >
              <div className="certificate-details">
                <div className="detail-row">
                  <span className="detail-label">Issued:</span>
                  <strong>{cert.issueDate}</strong>
                </div>
                {cert.expiryDate && (
                  <div className="detail-row">
                    <span className="detail-label">Expires:</span>
                    <strong>{cert.expiryDate}</strong>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Credential ID:</span>
                  <strong>{cert.credentialId}</strong>
                </div>
              </div>

              <div className="certificate-actions" style={{ marginTop: '1.5rem' }}>
                <a href={cert.downloadUrl} className="btn btn--primary">📥 Download Certificate</a>
                <a href="#" className="btn btn--secondary">🔗 Share</a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon="📜"
          title="No Certificates Yet"
          description="Complete consultations and training to earn certificates"
          action={{ label: 'Book a Consultation', href: '/user/upcoming-consultations' }}
        />
      )}

      {/* How to Earn Certificates */}
      <Card title="How to Earn Certificates">
        <div className="earn-info">
          <p>Earn certificates by completing consultations and training modules</p>
          
          <div className="earn-paths">
            <div className="earn-item">
              <span className="earn-number">1</span>
              <div>
                <h4>Complete Consultations</h4>
                <p>Take at least 5 consultations in a specific topic to earn a certificate</p>
              </div>
            </div>

            <div className="earn-item">
              <span className="earn-number">2</span>
              <div>
                <h4>Join Training Modules</h4>
                <p>Participate in structured learning programs and pass assessments</p>
              </div>
            </div>

            <div className="earn-item">
              <span className="earn-number">3</span>
              <div>
                <h4>Maintain Standards</h4>
                <p>Keep your expertise current by renewing certificates when needed</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Available Programs */}
      <Card title="Certificate Programs Available">
        <div className="programs-grid">
          <div className="program-card">
            <h4>🌱 Cannabis Basics</h4>
            <p>Learn fundamental cultivation techniques</p>
            <p className="program-requirements">Requirements: 5 consultations</p>
            <button className="btn btn--secondary btn--block">Start Learning</button>
          </div>

          <div className="program-card">
            <h4>🌿 Advanced Techniques</h4>
            <p>Master advanced growing methods</p>
            <p className="program-requirements">Requirements: 10 consultations + Basic Certificate</p>
            <button className="btn btn--secondary btn--block">Start Learning</button>
          </div>

          <div className="program-card">
            <h4>🏆 Professional Mastery</h4>
            <p>Achieve professional grower status</p>
            <p className="program-requirements">Requirements: 20+ consultations + passing grade</p>
            <button className="btn btn--secondary btn--block">Start Learning</button>
          </div>

          <div className="program-card">
            <h4>📚 Nutrition Science</h4>
            <p>Understand plant nutrition deeply</p>
            <p className="program-requirements">Requirements: 5 nutrition consultations</p>
            <button className="btn btn--secondary btn--block">Start Learning</button>
          </div>
        </div>
      </Card>

      {/* Certificate Statistics */}
      <Card title="Your Progress">
        <div className="progress-stats">
          <div className="stat-item">
            <label>Certificates Earned</label>
            <div className="stat-value">{certificates.length}</div>
          </div>

          <div className="stat-item">
            <label>In Progress</label>
            <div className="stat-value">2</div>
          </div>

          <div className="stat-item">
            <label>Total Learning Hours</label>
            <div className="stat-value">45</div>
          </div>

          <div className="stat-item">
            <label>Completion Rate</label>
            <div className="stat-value">78%</div>
          </div>
        </div>
      </Card>

      {/* Share Certificate */}
      <Card title="Share Your Certificates">
        <div className="share-certs">
          <p>Showcase your achievements to employers and the community</p>
          <div className="share-platform-buttons">
            <button className="btn btn--secondary">📱 Share on LinkedIn</button>
            <button className="btn btn--secondary">🔗 Get Shareable Link</button>
            <button className="btn btn--secondary">📧 Email Certificate</button>
          </div>
        </div>
      </Card>
    </div>
  )
}
