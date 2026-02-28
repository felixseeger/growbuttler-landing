/**
 * Master Profile - Expert profile, bio, rates, certifications
 */

import { Metadata } from 'next'
import { Card } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Profile - Expert | GrowButtler',
  description: 'Manage your expert profile and credentials',
}

export default function MasterProfile() {
  return (
    <div className="page-master-profile">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/master/dashboard' },
          { label: 'Profile' }
        ]}
      />

      <header className="page-header">
        <h1>Your Expert Profile</h1>
        <p>Manage your public profile that clients see</p>
      </header>

      {/* Profile Header */}
      <Card title="Profile Information">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <img 
              src="https://via.placeholder.com/150" 
              alt="Profile" 
              className="profile-avatar"
            />
            <button className="btn btn--secondary">Change Photo</button>
          </div>

          <div className="profile-basic-info">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                id="name"
                type="text" 
                className="form-input"
                defaultValue="Jane Expert"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Professional Title</label>
                <input 
                  id="title"
                  type="text" 
                  className="form-input"
                  defaultValue="Master Cannabis Cultivator"
                />
              </div>
              <div className="form-group">
                <label htmlFor="rate">Hourly Rate ($)</label>
                <input 
                  id="rate"
                  type="number" 
                  className="form-input"
                  defaultValue="75"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                className="form-input"
                defaultValue="expert@example.com"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Bio and Description */}
      <Card title="Professional Bio">
        <div className="form-group">
          <label htmlFor="bio">Short Bio (visible to clients)</label>
          <textarea 
            id="bio"
            className="form-textarea" 
            defaultValue="Certified cannabis cultivation expert with 10+ years of hands-on experience. Specializing in soil science, nutrient management, and organic growing techniques."
            rows={4}
          />
          <p className="form-help">Help clients understand your expertise (150-300 characters recommended)</p>
        </div>
      </Card>

      {/* Areas of Expertise */}
      <Card title="Areas of Expertise">
        <div className="expertise-section">
          <div className="expertise-list">
            <div className="expertise-item">
              <span>✓ Cannabis Cultivation</span>
              <button className="btn btn--secondary btn--small">Remove</button>
            </div>
            <div className="expertise-item">
              <span>✓ Soil Science</span>
              <button className="btn btn--secondary btn--small">Remove</button>
            </div>
            <div className="expertise-item">
              <span>✓ Pest Management</span>
              <button className="btn btn--secondary btn--small">Remove</button>
            </div>
          </div>

          <div className="expertise-add">
            <input 
              type="text" 
              className="form-input"
              placeholder="Add new expertise..."
            />
            <button className="btn btn--secondary">Add</button>
          </div>
        </div>
      </Card>

      {/* Languages */}
      <Card title="Languages">
        <div className="languages-list">
          <div className="language-item">
            <label>
              <input type="checkbox" defaultChecked />
              English
            </label>
          </div>
          <div className="language-item">
            <label>
              <input type="checkbox" />
              German
            </label>
          </div>
          <div className="language-item">
            <label>
              <input type="checkbox" />
              Spanish
            </label>
          </div>
          <div className="language-item">
            <label>
              <input type="checkbox" />
              French
            </label>
          </div>
        </div>
      </Card>

      {/* Service Details */}
      <Card title="Service Details">
        <div className="form-group">
          <label htmlFor="min-session">Minimum Session Duration (minutes)</label>
          <select id="min-session" className="form-input" defaultValue="45">
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="availability">Response Time Guarantee</label>
          <select id="availability" className="form-input" defaultValue="24">
            <option value="2">Within 2 hours</option>
            <option value="4">Within 4 hours</option>
            <option value="24">Within 24 hours</option>
            <option value="48">Within 48 hours</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" defaultChecked />
            Accept rush booking requests (additional 25% fee)
          </label>
        </div>
      </Card>

      {/* Certifications Display */}
      <Card title="Certifications Preview">
        <div className="certifications-preview">
          <p className="preview-note">These certifications appear on your public profile</p>
          <div className="cert-list">
            <div className="cert-item">
              <span className="cert-badge">✓</span>
              <div>
                <h4>Cannabis Cultivation Certification</h4>
                <p>GrowButtler Academy - Valid through Jan 2025</p>
              </div>
            </div>
            <div className="cert-item">
              <span className="cert-badge">✓</span>
              <div>
                <h4>Pest Management Specialist</h4>
                <p>Agricultural Institute - Valid through Jun 2025</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button className="btn btn--primary">Save Changes</button>
        <button className="btn btn--secondary">Preview Public Profile</button>
        <button className="btn btn--secondary">Cancel</button>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
