/**
 * Master Calendar - Appointment calendar, availability management
 */

import { Metadata } from 'next'
import { Card } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Calendar - Expert | GrowButtler',
  description: 'Manage your appointment calendar and availability',
}

export default function MasterCalendar() {
  const weekSchedule = [
    { day: 'Monday', availability: 'Available 9 AM - 5 PM' },
    { day: 'Tuesday', availability: 'Available 9 AM - 5 PM' },
    { day: 'Wednesday', availability: 'Available 1 PM - 5 PM' },
    { day: 'Thursday', availability: 'Available 9 AM - 5 PM' },
    { day: 'Friday', availability: 'Available 9 AM - 5 PM' },
    { day: 'Saturday', availability: 'Not available' },
    { day: 'Sunday', availability: 'Not available' },
  ]

  return (
    <div className="page-master-calendar">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/master/dashboard' },
          { label: 'Calendar' }
        ]}
      />

      <header className="page-header">
        <h1>Calendar & Availability</h1>
        <p>Manage your schedule and let clients book consultation times</p>
      </header>

      {/* Calendar View */}
      <Card title="Calendar" subtitle="February 2024">
        <div className="calendar-container">
          <div className="calendar-placeholder">
            <p style={{ fontSize: '2rem', textAlign: 'center' }}>📅</p>
            <p style={{ textAlign: 'center', color: '#666' }}>
              Calendar visualization would be integrated here. 
              Shows scheduled appointments and availability blocks.
            </p>
          </div>
        </div>
      </Card>

      {/* Weekly Availability */}
      <Card title="Your Availability" subtitle="Recurring weekly schedule">
        <div className="availability-editor">
          <div className="availability-grid">
            {weekSchedule.map((slot, idx) => (
              <div key={idx} className="availability-slot">
                <div className="slot-header">
                  <h4>{slot.day}</h4>
                </div>
                <div className="slot-content">
                  <p>{slot.availability}</p>
                </div>
                <button className="btn btn--secondary btn--small">Edit</button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Time Slot Management */}
      <Card title="Set Availability Time Slots">
        <div className="time-slot-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="day-select">Day of Week</label>
              <select id="day-select" className="form-input">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="start-time">Start Time</label>
              <input 
                id="start-time"
                type="time" 
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="end-time">End Time</label>
              <input 
                id="end-time"
                type="time" 
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked />
              Recurring every week
            </label>
          </div>

          <button className="btn btn--primary">Add Time Slot</button>
        </div>
      </Card>

      {/* Scheduled Appointments */}
      <Card title="Upcoming Appointments" subtitle="Next 10 days">
        <div className="appointments-list">
          <div className="appointment-item">
            <div className="appointment-date">Mar 1</div>
            <div className="appointment-content">
              <h4>Sarah M.</h4>
              <p>2:00 PM - 3:00 PM (60 min)</p>
              <span className="appointment-status">scheduled</span>
            </div>
            <div className="appointment-actions">
              <button className="btn btn--secondary btn--small">Details</button>
              <button className="btn btn--secondary btn--small">Reschedule</button>
            </div>
          </div>

          <div className="appointment-item">
            <div className="appointment-date">Mar 2</div>
            <div className="appointment-content">
              <h4>John P.</h4>
              <p>3:00 PM - 3:45 PM (45 min)</p>
              <span className="appointment-status">scheduled</span>
            </div>
            <div className="appointment-actions">
              <button className="btn btn--secondary btn--small">Details</button>
              <button className="btn btn--secondary btn--small">Reschedule</button>
            </div>
          </div>

          <div className="appointment-item">
            <div className="appointment-date">Mar 5</div>
            <div className="appointment-content">
              <h4>Emma L.</h4>
              <p>10:00 AM - 11:30 AM (90 min)</p>
              <span className="appointment-status">scheduled</span>
            </div>
            <div className="appointment-actions">
              <button className="btn btn--secondary btn--small">Details</button>
              <button className="btn btn--secondary btn--small">Reschedule</button>
            </div>
          </div>
        </div>
      </Card>

      {/* Time Zone Settings */}
      <Card title="Time Zone Settings">
        <div className="timezone-form">
          <div className="form-group">
            <label htmlFor="timezone">Your Time Zone</label>
            <select id="timezone" className="form-input" defaultValue="Europe/Berlin">
              <option value="Europe/Berlin">Europe/Berlin (CET)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
            <p className="form-help">This helps clients book appointments in the correct time.</p>
          </div>
          <button className="btn btn--primary">Save Time Zone</button>
        </div>
      </Card>
    </div>
  )
}
