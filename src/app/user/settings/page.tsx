/**
 * User Settings - Account configuration
 */

import { Metadata } from 'next'
import { Card, Alert } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Settings | GrowButtler',
  description: 'Manage your account settings',
}

export default function UserSettings() {
  return (
    <div className="page-user-settings">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/user/dashboard' },
          { label: 'Settings' }
        ]}
      />

      <header className="page-header">
        <h1>Account Settings</h1>
        <p>Manage your account preferences and security</p>
      </header>

      {/* Account Information */}
      <Card title="Account Information">
        <div className="settings-section">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              className="form-input"
              defaultValue="grower@example.com"
            />
            <p className="form-help">Your login email. Verified ✓</p>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              id="phone"
              type="tel" 
              className="form-input"
              placeholder="(123) 456-7890"
            />
          </div>

          <button className="btn btn--primary">Update Account Info</button>
        </div>
      </Card>

      {/* Password & Security */}
      <Card title="Password & Security">
        <div className="settings-section">
          <div className="security-info">
            <p>Secure your account with a strong password</p>
            <p className="form-help">Last changed: 2 months ago</p>
          </div>

          <div className="form-group">
            <label htmlFor="current-password">Current Password</label>
            <input 
              id="current-password"
              type="password" 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input 
              id="new-password"
              type="password" 
              className="form-input"
            />
            <p className="form-help">At least 12 characters with numbers and symbols</p>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input 
              id="confirm-password"
              type="password" 
              className="form-input"
            />
          </div>

          <button className="btn btn--primary">Change Password</button>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
            <h4>Two-Factor Authentication</h4>
            <p className="form-help">Add extra security to your account</p>
            <button className="btn btn--secondary">Enable 2FA</button>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card title="Notification Preferences">
        <div className="settings-section notification-settings">
          <div className="notification-group">
            <h4>Email Notifications</h4>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" defaultChecked />
                Consultation reminders
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Expert messages
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                New expert recommendations
              </label>
              <label>
                <input type="checkbox" />
                Marketing emails
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Account security alerts
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Weekly newsletter
              </label>
            </div>
          </div>

          <div className="notification-group" style={{ marginTop: '1.5rem' }}>
            <h4>Push Notifications</h4>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" defaultChecked />
                Enabled on mobile app
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Show consultation reminders
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Show expert messages
              </label>
            </div>
          </div>

          <button className="btn btn--primary" style={{ marginTop: '1.5rem' }}>Save Preferences</button>
        </div>
      </Card>

      {/* Email Settings */}
      <Card title="Email Communication">
        <div className="settings-section">
          <div className="form-group">
            <label htmlFor="email-frequency">Email Frequency</label>
            <select id="email-frequency" className="form-input" defaultValue="daily">
              <option value="immediate">Immediate</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Digest</option>
              <option value="none">Never (Urgent Only)</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked />
              Receive email digest of new expert profiles
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Receive personalized expert recommendations
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Receive tips and educational content
            </label>
          </div>

          <button className="btn btn--primary" style={{ marginTop: '1rem' }}>Save Email Settings</button>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card title="Privacy Settings">
        <div className="settings-section">
          <div className="checkbox-group">
            <label>
              <input type="checkbox" defaultChecked />
              Allow other users to find me by email
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Show my consultation progress
            </label>
            <label>
              <input type="checkbox" />
              Allow public comments on my profile
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Share anonymized consultation feedback for research
            </label>
          </div>

          <button className="btn btn--primary" style={{ marginTop: '1.5rem' }}>Save Privacy Settings</button>
        </div>
      </Card>

      {/* Connected Apps & Integrations */}
      <Card title="Connected Apps & Integrations">
        <div className="settings-section">
          <div className="integration-item">
            <div className="integration-header">
              <h4>Google Calendar</h4>
              <span className="badge badge--neutral">Not connected</span>
            </div>
            <p>Sync your consultations with Google Calendar</p>
            <button className="btn btn--secondary">Connect</button>
          </div>

          <div className="integration-item" style={{ marginTop: '1.5rem' }}>
            <div className="integration-header">
              <h4>Email</h4>
              <span className="badge badge--success">Connected</span>
            </div>
            <p>Manage email notifications and settings</p>
            <button className="btn btn--secondary">Manage</button>
          </div>

          <div className="integration-item" style={{ marginTop: '1.5rem' }}>
            <div className="integration-header">
              <h4>WhatsApp</h4>
              <span className="badge badge--neutral">Not connected</span>
            </div>
            <p>Receive reminders and updates via WhatsApp</p>
            <button className="btn btn--secondary">Connect</button>
          </div>
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card title="Data & Privacy">
        <div className="settings-section">
          <div className="data-options">
            <h4>Your Data</h4>
            <p>Download or delete all your personal data</p>
            
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn--secondary">📥 Download My Data</button>
              <button className="btn btn--secondary">🗑️ Delete All Data</button>
            </div>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
            <h4>Login Activity</h4>
            <p className="form-help">Last login: Today at 2:45 PM</p>
            <button className="btn btn--secondary">View All Login Activity</button>
          </div>
        </div>
      </Card>

      {/* Language & Localization */}
      <Card title="Language & Localization">
        <div className="settings-section">
          <div className="form-group">
            <label htmlFor="language">Preferred Language</label>
            <select id="language" className="form-input" defaultValue="en">
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timezone">Time Zone</label>
            <select id="timezone" className="form-input" defaultValue="Europe/Berlin">
              <option value="Europe/Berlin">Europe/Berlin (CET)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
            </select>
          </div>

          <button className="btn btn--primary">Save Language Settings</button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card title="Danger Zone">
        <Alert 
          type="warning"
          title="Account Deactivation"
          message="Deactivating your account will temporarily hide your profile. You can reactivate at any time."
        />
        <button className="btn btn--secondary">Deactivate Account</button>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
          <Alert 
            type="error"
            title="Delete Account Permanently"
            message="This action cannot be undone. All your data will be permanently deleted."
          />
          <button className="btn btn--danger">Delete Account Permanently</button>
        </div>
      </Card>

      {/* Help & Support */}
      <Card title="Help & Support">
        <div className="support-links">
          <a href="#" className="link">📖 Help Center</a>
          <a href="#" className="link">❓ FAQ</a>
          <a href="#" className="link">💬 Contact Support</a>
          <a href="#" className="link">📋 Terms of Service</a>
          <a href="#" className="link">🔒 Privacy Policy</a>
        </div>
      </Card>
    </div>
  )
}

export const dynamic = 'force-dynamic'
