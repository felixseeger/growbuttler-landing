/**
 * User Dashboard - Overview, consultation history, upcoming
 */

import { Metadata } from 'next'
import { StatCard, Card, EmptyState } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Dashboard - My Account | GrowButtler',
  description: 'Your consultation and progress dashboard',
}

export default function UserDashboard() {
  return (
    <div className="page-user-dashboard">
      <Breadcrumbs 
        items={[
          { label: 'My Dashboard', href: '/user/dashboard' }
        ]}
      />

      <header className="page-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Track your consultations and grow with our experts</p>
      </header>

      {/* Statistics Row */}
      <section className="stats-grid">
        <StatCard 
          label="Total Consultations"
          value="8"
          icon="💬"
          color="primary"
        />
        <StatCard 
          label="Upcoming Sessions"
          value="2"
          icon="📅"
          color="warning"
        />
        <StatCard 
          label="Subscription Status"
          value="Active"
          icon="✓"
          color="success"
        />
        <StatCard 
          label="Total Spent"
          value="$599"
          icon="💳"
          color="primary"
        />
      </section>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Upcoming Consultations */}
        <Card 
          title="Upcoming Consultations"
          subtitle="Your next scheduled sessions"
          footer={<a href="/user/upcoming-consultations" className="link">View all</a>}
        >
          <div className="consultation-list">
            <div className="consultation-item">
              <div className="consultation-header">
                <h4>Expert: Jane Expert</h4>
                <span className="consultation-status">Tomorrow 2 PM</span>
              </div>
              <p className="consultation-topic">Cannabis cultivation setup guidance</p>
              <div className="consultation-meta">
                <span>⏱️ 60 minutes</span>
                <span>🌱 Setup</span>
              </div>
              <a href="#" className="link">Join now</a>
            </div>
            
            <div className="consultation-item">
              <div className="consultation-header">
                <h4>Expert: John Master</h4>
                <span className="consultation-status">In 5 days</span>
              </div>
              <p className="consultation-topic">Nutrient management follow-up</p>
              <div className="consultation-meta">
                <span>⏱️ 45 minutes</span>
                <span>🌿 Nutrients</span>
              </div>
              <a href="#" className="link">Details</a>
            </div>
          </div>
        </Card>

        {/* Subscription Status */}
        <Card 
          title="Your Subscription"
          subtitle="Manage your account"
          footer={<a href="/user/payouts" className="link">View account</a>}
        >
          <div className="subscription-info">
            <div className="subscription-tier">
              <h4>Pro Plan</h4>
              <p className="plan-price">$9.99/month</p>
            </div>
            <div className="subscription-divider"></div>
            <div className="subscription-details">
              <div className="detail-item">
                <span>Next Billing</span>
                <strong>Mar 15, 2024</strong>
              </div>
              <div className="detail-item">
                <span>Status</span>
                <strong>Active</strong>
              </div>
              <div className="detail-item">
                <span>Auto-renews</span>
                <strong>Enabled</strong>
              </div>
            </div>
            <button className="btn btn--secondary btn--block" style={{ marginTop: '1rem' }}>
              Manage Subscription
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Consultations */}
      <Card 
        title="Recent Consultations"
        subtitle="Your last 5 sessions"
        footer={<a href="/user/consultations-archive" className="link">View all</a>}
      >
        <div className="consultation-history">
          <div className="history-item">
            <div className="history-date">Feb 20, 2024</div>
            <div className="history-content">
              <h4>Expert: Sarah Master</h4>
              <p>Soil preparation techniques</p>
              <div className="history-meta">
                <span>⭐ Rating: 5/5</span>
                <span>📹 Recording available</span>
              </div>
            </div>
            <a href="#" className="link">View details</a>
          </div>

          <div className="history-item">
            <div className="history-date">Feb 10, 2024</div>
            <div className="history-content">
              <h4>Expert: John Expert</h4>
              <p>Pest prevention strategies</p>
              <div className="history-meta">
                <span>⭐ Rating: 5/5</span>
                <span>📹 Recording available</span>
              </div>
            </div>
            <a href="#" className="link">View details</a>
          </div>

          <div className="history-item">
            <div className="history-date">Jan 28, 2024</div>
            <div className="history-content">
              <h4>Expert: Jane Expert</h4>
              <p>Initial setup consultation</p>
              <div className="history-meta">
                <span>⭐ Rating: 5/5</span>
                <span>📹 Recording available</span>
              </div>
            </div>
            <a href="#" className="link">View details</a>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <a href="/user/upcoming-consultations" className="btn btn--secondary">📅 My Consultations</a>
          <a href="/user/badges" className="btn btn--secondary">🏆 My Badges</a>
          <a href="/user/profile" className="btn btn--secondary">👤 My Profile</a>
          <a href="#" className="btn btn--primary">✨ Book a New Consultation</a>
        </div>
      </section>

      {/* Getting Started Tips */}
      <Card title="Getting Started Tips" subtitle="Maximize your experience">
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">1</span>
            <div>
              <h4>Complete Your Profile</h4>
              <p>Add your preferences to get better expert matches</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">2</span>
            <div>
              <h4>Book Your First Consultation</h4>
              <p>Connect with an expert to get personalized guidance</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">3</span>
            <div>
              <h4>Earn Achievements</h4>
              <p>Complete consultations and earn badges for your progress</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export const dynamic = 'force-dynamic'
