/**
 * User Consultations Archive - Past consultations, recordings
 */

import { Metadata } from 'next'
import { Card, Table, Pagination } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Consultation Archive | GrowButtler',
  description: 'View your past consultations and recordings',
}

export default function UserConsultationsArchive() {
  const consultationHistory = [
    {
      id: 1,
      expert: 'Jane Expert',
      topic: 'Setup guidance',
      date: 'Feb 20, 2024',
      duration: '60 min',
      rating: '5/5',
      recording: '📹 Available',
      notes: '✓'
    },
    {
      id: 2,
      expert: 'John Master',
      topic: 'Nutrient management',
      date: 'Feb 10, 2024',
      duration: '45 min',
      rating: '5/5',
      recording: '📹 Available',
      notes: '✓'
    },
    {
      id: 3,
      expert: 'Sarah Expert',
      topic: 'Pest prevention',
      date: 'Jan 28, 2024',
      duration: '90 min',
      rating: '4/5',
      recording: '📹 Available',
      notes: '✓'
    },
    {
      id: 4,
      expert: 'Jane Expert',
      topic: 'Initial consultation',
      date: 'Jan 15, 2024',
      duration: '60 min',
      rating: '5/5',
      recording: '📹 Available',
      notes: '✓'
    },
  ]

  return (
    <div className="page-user-consultations-archive">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/user/dashboard' },
          { label: 'Consultation Archive' }
        ]}
      />

      <header className="page-header">
        <h1>Consultation Archive</h1>
        <p>View and review your past sessions</p>
      </header>

      {/* Filters */}
      <Card title="Filter Consultations">
        <div className="filter-row">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by expert name..."
          />
          <input 
            type="date" 
            className="form-input" 
            placeholder="From date"
          />
          <input 
            type="date" 
            className="form-input" 
            placeholder="To date"
          />
          <select className="form-input">
            <option>All Ratings</option>
            <option>5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
          </select>
        </div>
      </Card>

      {/* Consultation Archive Table */}
      <Card title="All Consultations" subtitle={`${consultationHistory.length} total`}>
        <Table 
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'expert', label: 'Expert' },
            { key: 'topic', label: 'Topic' },
            { key: 'duration', label: 'Duration' },
            { key: 'rating', label: 'Rating' },
            { key: 'recording', label: 'Recording' },
          ]}
          rows={consultationHistory}
        />
      </Card>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      </div>

      {/* Detailed Archive View */}
      <section>
        <h2>Detailed Consultation History</h2>
        {consultationHistory.map(consultation => (
          <Card 
            key={consultation.id}
            title={`${consultation.expert} - ${consultation.topic}`}
            subtitle={consultation.date}
            interactive
          >
            <div className="archive-item-content">
              <div className="archive-meta">
                <div className="meta-item">
                  <span className="meta-label">Expert:</span>
                  <strong>{consultation.expert}</strong>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Date:</span>
                  <strong>{consultation.date}</strong>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Duration:</span>
                  <strong>{consultation.duration}</strong>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Your Rating:</span>
                  <strong>⭐ {consultation.rating}</strong>
                </div>
              </div>

              <div className="archive-actions">
                <a href="#" className="btn btn--secondary">👁️ View Details</a>
                <a href="#" className="btn btn--secondary">📹 Watch Recording</a>
                <a href="#" className="btn btn--secondary">💬 Read Notes</a>
                <a href="#" className="btn btn--secondary">⭐ Leave Feedback</a>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Export Data */}
      <Card title="Export Your Data">
        <div className="export-section">
          <p>Download your consultation history for your records</p>
          <div className="export-options">
            <button className="btn btn--secondary">📊 Export as CSV</button>
            <button className="btn btn--secondary">📄 Export as PDF</button>
          </div>
        </div>
      </Card>

      {/* Feedback Form */}
      <Card title="Share Feedback">
        <div className="feedback-form">
          <div className="form-group">
            <label htmlFor="feedback-expert">Which consultation would you like to feedback on?</label>
            <select id="feedback-expert" className="form-input">
              <option>Select a consultation...</option>
              {consultationHistory.map(c => (
                <option key={c.id}>{c.expert} - {c.date}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="feedback-rating">How would you rate this consultation?</label>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} className="star-btn">⭐</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="feedback-comment">Your Feedback</label>
            <textarea 
              id="feedback-comment"
              className="form-textarea" 
              placeholder="Tell us what you thought about this consultation..."
              rows={4}
            />
          </div>

          <button className="btn btn--primary">Submit Feedback</button>
        </div>
      </Card>
    </div>
  )
}

export const dynamic = 'force-dynamic'
