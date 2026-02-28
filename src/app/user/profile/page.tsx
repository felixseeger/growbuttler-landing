/**
 * User Profile - User profile, preferences
 */

import { Metadata } from 'next'
import { Card } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'My Profile | GrowButtler',
  description: 'Manage your user profile',
}

export default function UserProfile() {
  return (
    <div className="page-user-profile">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/user/dashboard' },
          { label: 'Profile' }
        ]}
      />

      <header className="page-header">
        <h1>Your Profile</h1>
        <p>Manage your personal information and preferences</p>
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
                defaultValue="John Grower"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  id="email"
                  type="email" 
                  className="form-input"
                  defaultValue="grower@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone (optional)</label>
                <input 
                  id="phone"
                  type="tel" 
                  className="form-input"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">About You</label>
              <textarea 
                id="bio"
                className="form-textarea" 
                defaultValue="Home grower learning the craft"
                rows={4}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Growing Interests */}
      <Card title="Growing Interests & Preferences">
        <div className="preferences-section">
          <div className="form-group">
            <label htmlFor="experience">Growing Experience Level</label>
            <select id="experience" className="form-input" defaultValue="beginner">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="setup">Growing Setup</label>
            <select id="setup" className="form-input" defaultValue="indoor">
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="greenhouse">Greenhouse</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Areas of Interest (select all that apply)</label>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" defaultChecked />
                Cannabis Cultivation
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Nutrient Management
              </label>
              <label>
                <input type="checkbox" />
                Pest Management
              </label>
              <label>
                <input type="checkbox" />
                Soil Science
              </label>
              <label>
                <input type="checkbox" />
                Breeding
              </label>
              <label>
                <input type="checkbox" />
                Hydroponics
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="goals">Your Growing Goals</label>
            <textarea 
              id="goals"
              className="form-textarea" 
              placeholder="What do you want to achieve with your growing?"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Expert Preferences */}
      <Card title="Expert Preferences">
        <div className="expert-prefs">
          <div className="form-group">
            <label htmlFor="languages">Preferred Languages</label>
            <select id="languages" className="form-input" defaultValue="english">
              <option value="english">English</option>
              <option value="german">German</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Expert Specialties</label>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" defaultChecked />
                Cannabis Cultivation
              </label>
              <label>
                <input type="checkbox" />
                Soil Science
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Pest Management
              </label>
            </div>
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

          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked />
              Save favorite experts for quick booking
            </label>
          </div>
        </div>
      </Card>

      {/* Favorite Experts */}
      <Card title="Your Favorite Experts">
        <div className="favorites-list">
          <div className="favorite-item">
            <div className="favorite-avatar">👩‍🌾</div>
            <div className="favorite-info">
              <h4>Jane Expert</h4>
              <p>Master Cannabis Cultivator</p>
              <span className="rating">⭐ 4.8/5</span>
            </div>
            <button className="btn btn--secondary">Book Now</button>
          </div>

          <div className="favorite-item">
            <div className="favorite-avatar">👨‍🌾</div>
            <div className="favorite-info">
              <h4>John Master</h4>
              <p>Nutrient Specialist</p>
              <span className="rating">⭐ 4.9/5</span>
            </div>
            <button className="btn btn--secondary">Book Now</button>
          </div>

          <p style={{ marginTop: '1rem', color: '#666' }}>
            Add experts to your favorites for quick access and special offers
          </p>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card title="Privacy Settings">
        <div className="privacy-options">
          <div className="checkbox-group">
            <label>
              <input type="checkbox" defaultChecked />
              Allow experts to contact me with offers and updates
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Share my progress with the GrowButtler community
            </label>
            <label>
              <input type="checkbox" />
              Show my achievements publicly
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Allow GrowButtler to use my feedback for improvements
            </label>
          </div>
        </div>
      </Card>

      {/* Public Profile Preview */}
      <Card title="Public Profile Preview">
        <div className="public-profile-preview">
          <div className="preview-card">
            <h4>{/* Name */}John Grower</h4>
            <p className="preview-bio">Home grower learning the craft</p>
            <div className="preview-badges">
              <span className="badge">🌱 First Consultation</span>
              <span className="badge">🌿 Growing Strong</span>
            </div>
            <p className="preview-text">
              <strong>Level:</strong> Beginner<br />
              <strong>Experience:</strong> Cannabis Cultivation
            </p>
          </div>
          <button className="btn btn--secondary">View Full Public Profile</button>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button className="btn btn--primary">Save Changes</button>
        <button className="btn btn--secondary">Cancel</button>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
