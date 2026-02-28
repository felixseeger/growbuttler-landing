/**
 * User Upcoming Consultations - Scheduled sessions, join links
 */

import { Metadata } from 'next'
import { Card, Table, EmptyState } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Upcoming Consultations | GrowButtler',
  description: 'Your scheduled consultation sessions',
}

export default function UserUpcomingConsultations() {
  const upcomingConsultations = [
    {
      id: 1,
      expert: 'Jane Expert',
      topic: 'Setup guidance',
      date: 'Tomorrow at 2:00 PM',
      duration: '60 min',
      status: 'scheduled',
      joinLink: 'https://zoom.us/j/...'
    },
    {
      id: 2,
      expert: 'John Master',
      topic: 'Nutrient management',
      date: 'Mar 5 at 3:00 PM',
      duration: '45 min',
      status: 'scheduled',
      joinLink: 'https://zoom.us/j/...'
    },
  ]

  return (
    <div className="page-user-upcoming-consultations">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/user/dashboard' },
          { label: 'Upcoming Consultations' }
        ]}
      />

      <header className="page-header">
        <h1>Upcoming Consultations</h1>
        <p>Your scheduled sessions with experts</p>
        <a href="#" className="btn btn--primary">+ Book New Consultation</a>
      </header>

      {/* Consultation List */}
      {upcomingConsultations.length > 0 ? (
        <div className="consultations-detailed">
          {upcomingConsultations.map(consultation => (
            <Card 
              key={consultation.id}
              title={`${consultation.expert} - ${consultation.topic}`}
              interactive
            >
              <div className="consultation-details-large">
                <div className="detail-group">
                  <div className="detail-item">
                    <label>Expert:</label>
                    <strong>{consultation.expert}</strong>
                  </div>
                  <div className="detail-item">
                    <label>Date & Time:</label>
                    <strong>{consultation.date}</strong>
                  </div>
                </div>

                <div className="detail-group">
                  <div className="detail-item">
                    <label>Topic:</label>
                    <strong>{consultation.topic}</strong>
                  </div>
                  <div className="detail-item">
                    <label>Duration:</label>
                    <strong>{consultation.duration}</strong>
                  </div>
                </div>

                <div className="join-section">
                  <div className="detail-item">
                    <label>Join Link:</label>
                    <a href={consultation.joinLink} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                      Join Session
                    </a>
                  </div>
                </div>

                <div className="consultation-actions">
                  <button className="btn btn--secondary">Send Message</button>
                  <button className="btn btn--secondary">Reschedule</button>
                  <button className="btn btn--secondary">Cancel</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon="📭"
          title="No Upcoming Consultations"
          description="You don't have any scheduled consultations yet."
          action={{ label: 'Book a Consultation', href: '#' }}
        />
      )}

      {/* Calendar View */}
      <Card title="Calendar View" subtitle="Your consultation schedule">
        <div className="calendar-placeholder">
          <p style={{ fontSize: '2rem', textAlign: 'center' }}>📅</p>
          <p style={{ textAlign: 'center', color: '#666' }}>
            Calendar visualization showing upcoming sessions and availability
          </p>
        </div>
      </Card>

      {/* Preparation Tips */}
      <Card title="Prepare for Your Consultation">
        <div className="preparation-tips">
          <div className="tip">
            <h4>📋 Prepare Your Questions</h4>
            <p>Write down specific questions or topics you'd like to discuss</p>
          </div>
          <div className="tip">
            <h4>📸 Gather Information</h4>
            <p>Have photos of your setup or current situation ready to share</p>
          </div>
          <div className="tip">
            <h4>⏰ Be on Time</h4>
            <p>Join 5 minutes early to test your video and audio</p>
          </div>
          <div className="tip">
            <h4>🎥 Record (if allowed)</h4>
            <p>Ask your expert if you can record the session for reference</p>
          </div>
        </div>
      </Card>

      {/* Quick Reschedule */}
      <Card title="Reschedule a Session">
        <div className="reschedule-form">
          <div className="form-group">
            <label htmlFor="select-consultation">Select Consultation</label>
            <select id="select-consultation" className="form-input">
              <option>Choose a consultation...</option>
              <option value="1">Tomorrow at 2:00 PM - Jane Expert</option>
              <option value="2">Mar 5 at 3:00 PM - John Master</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="new-date">New Date & Time</label>
            <input id="new-date" type="datetime-local" className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="reschedule-reason">Reason for Rescheduling (optional)</label>
            <textarea id="reschedule-reason" className="form-textarea" rows={3} />
          </div>

          <button className="btn btn--primary">Request Reschedule</button>
        </div>
      </Card>
    </div>
  )
}
