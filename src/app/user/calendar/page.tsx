/**
 * User Calendar - Personal calendar view
 */

import { Metadata } from 'next'
import { Card } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'My Calendar | GrowButtler',
  description: 'View your personal consultation calendar',
}

export default function UserCalendar() {
  return (
    <div className="page-user-calendar">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/user/dashboard' },
          { label: 'Calendar' }
        ]}
      />

      <header className="page-header">
        <h1>Your Calendar</h1>
        <p>View and manage your consultation schedule</p>
      </header>

      {/* Calendar View */}
      <Card title="Calendar" subtitle="March 2024">
        <div className="calendar-container">
          <div className="calendar-placeholder">
            <p style={{ fontSize: '2rem', textAlign: 'center' }}>📅</p>
            <p style={{ textAlign: 'center', color: '#666' }}>
              Full calendar view showing all consultations and availability
            </p>
          </div>
        </div>
      </Card>

      {/* Calendar Legend */}
      <Card title="Calendar Legend">
        <div className="legend-grid">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
            <span>Scheduled Consultation</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#FFC107' }}></span>
            <span>Pending Confirmation</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#2196F3' }}></span>
            <span>Expert Availability</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#E0E0E0' }}></span>
            <span>Not Available</span>
          </div>
        </div>
      </Card>

      {/* Month View */}
      <Card title="Upcoming Events">
        <div className="events-timeline">
          <div className="timeline-item">
            <div className="timeline-date">Tomorrow</div>
            <div className="timeline-content">
              <h4>Jane Expert - Setup guidance</h4>
              <p>2:00 PM - 3:00 PM (60 min)</p>
              <span className="timeline-status scheduled">Scheduled</span>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">Mar 5</div>
            <div className="timeline-content">
              <h4>John Master - Nutrient management</h4>
              <p>3:00 PM - 3:45 PM (45 min)</p>
              <span className="timeline-status scheduled">Scheduled</span>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">Mar 10</div>
            <div className="timeline-content">
              <h4>Sarah Expert - Pest control follow-up</h4>
              <p>10:00 AM - 11:00 AM (60 min)</p>
              <span className="timeline-status pending">Pending Confirmation</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Week View */}
      <Card title="Weekly View">
        <div className="week-schedule">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Events</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monday</td>
                <td>No consultations</td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td>Jane Expert, 2:00 PM</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>No consultations</td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td>No consultations</td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>No consultations</td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td>No consultations</td>
              </tr>
              <tr>
                <td>Sunday</td>
                <td>No consultations</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Calendar Settings */}
      <Card title="Calendar Settings">
        <div className="calendar-settings">
          <div className="form-group">
            <label htmlFor="timezone">Time Zone</label>
            <select id="timezone" className="form-input" defaultValue="Europe/Berlin">
              <option value="Europe/Berlin">Europe/Berlin (CET)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
            </select>
            <p className="form-help">All times display in your selected timezone</p>
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked />
              Sync to Google Calendar
            </label>
            <p className="form-help">Automatically add consultations to your Google Calendar</p>
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked />
              Receive calendar reminders
            </label>
            <p className="form-help">Get notifications before your consultations</p>
          </div>

          <div className="form-group">
            <label>Reminder Time</label>
            <select className="form-input" defaultValue="15">
              <option value="5">5 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="1440">1 day before</option>
            </select>
          </div>

          <button className="btn btn--primary">Save Calendar Settings</button>
        </div>
      </Card>

      {/* Export Calendar */}
      <Card title="Export Calendar">
        <div className="export-options">
          <p>Download your calendar for use in other applications</p>
          <div style={{ marginTop: '1rem' }}>
            <a href="#" className="btn btn--secondary">📥 Download as iCal</a>
            <a href="#" className="btn btn--secondary">📥 Download as Google Calendar</a>
          </div>
        </div>
      </Card>
    </div>
  )
}
