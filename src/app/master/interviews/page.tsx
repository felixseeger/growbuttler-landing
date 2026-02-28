/**
 * Master Interviews - Interview management, scheduling, notes
 */

import { Metadata } from 'next'
import { Card, Table, EmptyState } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Interviews - Expert | GrowButtler',
  description: 'Manage your consultation sessions',
}

export default function MasterInterviews() {
  const interviews = [
    {
      id: 1,
      client: 'Sarah M.',
      status: 'scheduled',
      date: 'Today at 2:00 PM',
      duration: '60 min',
      topic: 'Setup guidance',
      rate: '$75'
    },
    {
      id: 2,
      client: 'John P.',
      status: 'scheduled',
      date: 'Tomorrow at 3:00 PM',
      duration: '45 min',
      topic: 'Nutrient management',
      rate: '$75'
    },
    {
      id: 3,
      client: 'Emma L.',
      status: 'completed',
      date: 'Feb 25, 2024',
      duration: '90 min',
      topic: 'Pest control',
      rate: '$75'
    },
  ]

  return (
    <div className="page-master-interviews">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/master/dashboard' },
          { label: 'Interviews' }
        ]}
      />

      <header className="page-header">
        <h1>Interview Management</h1>
        <p>Schedule, manage, and track all your consultation sessions</p>
        <button className="btn btn--primary">+ Schedule New Interview</button>
      </header>

      {/* Filters */}
      <Card title="Filters">
        <div className="filter-row">
          <select className="form-input" defaultValue="all">
            <option value="all">All Interviews</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input 
            type="date" 
            className="form-input" 
            placeholder="Filter by date"
          />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by client name..."
          />
        </div>
      </Card>

      {/* Interviews Table */}
      <Card title="All Interviews" subtitle={`${interviews.length} total`}>
        <Table 
          columns={[
            { key: 'client', label: 'Client' },
            { key: 'topic', label: 'Topic' },
            { key: 'date', label: 'Date & Time' },
            { key: 'duration', label: 'Duration' },
            { key: 'rate', label: 'Rate' },
            { key: 'status', label: 'Status' },
          ]}
          rows={interviews.map(i => ({
            ...i,
            status: <span className={`badge badge--${i.status === 'scheduled' ? 'warning' : 'success'}`}>{i.status}</span>
          }))}
        />
      </Card>

      {/* Interview Details Section */}
      <Card title="Next Interview Details" subtitle="Scheduled for Today">
        <div className="interview-details">
          <div className="detail-row">
            <label>Client:</label>
            <strong>Sarah M.</strong>
          </div>
          <div className="detail-row">
            <label>Email:</label>
            <strong>sarah.m@example.com</strong>
          </div>
          <div className="detail-row">
            <label>Time:</label>
            <strong>Today at 2:00 PM</strong>
          </div>
          <div className="detail-row">
            <label>Duration:</label>
            <strong>60 minutes</strong>
          </div>
          <div className="detail-row">
            <label>Topic:</label>
            <strong>Cannabis cultivation setup guidance</strong>
          </div>
          <div className="detail-row">
            <label>Rate:</label>
            <strong>$75</strong>
          </div>
          <div className="detail-row">
            <label>Join Link:</label>
            <a href="#" className="link" target="_blank" rel="noopener noreferrer">https://zoom.us/j/... (Copy link)</a>
          </div>

          <div className="interview-notes">
            <h4>Session Notes</h4>
            <textarea 
              className="form-textarea" 
              placeholder="Add notes about this session..."
              rows={6}
            />
          </div>

          <div className="interview-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn--primary">Start Session</button>
            <button className="btn btn--secondary">Reschedule</button>
            <button className="btn btn--secondary">Cancel</button>
          </div>
        </div>
      </Card>
    </div>
  )
}
