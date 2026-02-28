/**
 * Master Dashboard - Overview, stats, upcoming interviews
 */

import { Metadata } from 'next'
import { StatCard, Card, EmptyState } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Dashboard - Expert | GrowButtler',
  description: 'Your expert dashboard overview',
}

export default function MasterDashboard() {
  return (
    <div className="page-master-dashboard">
      <Breadcrumbs 
        items={[
          { label: 'Expert Dashboard', href: '/master/dashboard' }
        ]}
      />

      <header className="page-header">
        <h1>Expert Dashboard</h1>
        <p>Welcome back! Here's your overview.</p>
      </header>

      {/* Statistics Row */}
      <section className="stats-grid">
        <StatCard 
          label="Total Earnings"
          value="$15,240"
          icon="💰"
          color="success"
          trend={{ direction: 'up', percentage: 12 }}
        />
        <StatCard 
          label="This Month"
          value="$2,840"
          icon="📈"
          color="primary"
        />
        <StatCard 
          label="Upcoming Sessions"
          value="5"
          icon="📅"
          color="primary"
        />
        <StatCard 
          label="Average Rating"
          value="4.8/5"
          icon="⭐"
          color="warning"
        />
      </section>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Upcoming Interviews */}
        <Card 
          title="Upcoming Interviews"
          subtitle="Your next 5 scheduled sessions"
          footer={<a href="/master/interviews" className="link">View all</a>}
        >
          <div className="interview-list">
            <div className="interview-item">
              <div className="interview-header">
                <h4>Client: Sarah M.</h4>
                <span className="interview-status">In 2 hours</span>
              </div>
              <p className="interview-topic">Cannabis cultivation setup guidance</p>
              <div className="interview-meta">
                <span>📍 Video Call</span>
                <span>⏱️ 60 minutes</span>
                <span>💵 $75</span>
              </div>
            </div>
            
            <div className="interview-item">
              <div className="interview-header">
                <h4>Client: John P.</h4>
                <span className="interview-status">Tomorrow 3 PM</span>
              </div>
              <p className="interview-topic">Nutrient management questions</p>
              <div className="interview-meta">
                <span>📍 Video Call</span>
                <span>⏱️ 45 minutes</span>
                <span>💵 $75</span>
              </div>
            </div>

            <div className="interview-item">
              <div className="interview-header">
                <h4>Client: Emma L.</h4>
                <span className="interview-status">In 3 days</span>
              </div>
              <p className="interview-topic">Pest control strategies</p>
              <div className="interview-meta">
                <span>📍 Video Call</span>
                <span>⏱️ 90 minutes</span>
                <span>💵 $75</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Payouts */}
        <Card 
          title="Pending Payouts"
          subtitle="Balance to be processed"
          footer={<a href="/master/payouts" className="link">View details</a>}
        >
          <div className="payout-summary">
            <div className="payout-item">
              <span>February Earnings</span>
              <strong>$2,840</strong>
            </div>
            <div className="payout-divider"></div>
            <div className="payout-item pending">
              <span>Status</span>
              <strong>Pending Processing</strong>
            </div>
            <button className="btn btn--primary btn--block" style={{ marginTop: '1rem' }}>
              Request Payout
            </button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <a href="/master/calendar" className="btn btn--secondary">📅 Manage Availability</a>
          <a href="/master/profile" className="btn btn--secondary">👤 Edit Profile</a>
          <a href="/master/settings" className="btn btn--secondary">⚙️ Settings</a>
          <a href="/master/interviews" className="btn btn--secondary">📝 View All Sessions</a>
        </div>
      </section>
    </div>
  )
}

export const dynamic = 'force-dynamic'
