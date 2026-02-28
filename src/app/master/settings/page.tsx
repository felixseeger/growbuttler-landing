/**
 * Master Settings - Account configuration
 */

import { Metadata } from 'next'
import { Card, Alert } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Settings - Expert | GrowButtler',
  description: 'Manage your account settings',
}

export default function MasterSettings() {
  return (
    <div className="page-master-settings">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/master/dashboard' },
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
              defaultValue="expert@example.com"
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
            <p className="form-help">Last changed: 3 months ago</p>
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
                New consultation requests
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Upcoming appointment reminders
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Payout notifications
              </label>
              <label>
                <input type="checkbox" />
                Marketing emails
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Account security alerts
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
            </div>
          </div>

          <button className="btn btn--primary" style={{ marginTop: '1.5rem' }}>Save Preferences</button>
        </div>
      </Card>

      {/* Payout Settings */}
      <Card title="Payout Settings">
        <div className="settings-section">
          <div className="form-group">
            <label htmlFor="payout-method">Default Payout Method</label>
            <select id="payout-method" className="form-input" defaultValue="bank">
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="payout-frequency">Payout Frequency</label>
            <select id="payout-frequency" className="form-input" defaultValue="monthly">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="on-demand">On-demand</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="min-payout">Minimum Balance for Payout ($)</label>
            <input 
              id="min-payout"
              type="number" 
              className="form-input"
              defaultValue="50"
              min="10"
            />
          </div>

          <button className="btn btn--primary">Update Payout Settings</button>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card title="Privacy Settings">
        <div className="settings-section">
          <div className="checkbox-group">
            <label>
              <input type="checkbox" defaultChecked />
              Allow profile to be found in expert search
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Show average rating on public profile
            </label>
            <label>
              <input type="checkbox" />
              Show reviews on public profile
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Share anonymized consultation data for platform improvements
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
              <h4>Zoom Integration</h4>
              <span className="badge badge--success">Connected</span>
            </div>
            <p>Use Zoom for video consultations</p>
            <button className="btn btn--secondary">Disconnect</button>
          </div>

          <div className="integration-item" style={{ marginTop: '1.5rem' }}>
            <div className="integration-header">
              <h4>Google Calendar</h4>
              <span className="badge badge--neutral">Not connected</span>
            </div>
            <p>Sync your GrowButtler calendar with Google Calendar</p>
            <button className="btn btn--secondary">Connect</button>
          </div>

          <div className="integration-item" style={{ marginTop: '1.5rem' }}>
            <div className="integration-header">
              <h4>Stripe</h4>
              <span className="badge badge--success">Connected</span>
            </div>
            <p>Payment processing for consultations</p>
            <button className="btn btn--secondary">Manage</button>
          </div>
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
    </div>
  )
}

export const dynamic = 'force-dynamic'
