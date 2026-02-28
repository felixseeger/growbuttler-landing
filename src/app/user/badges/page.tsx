/**
 * User Badges - Earned achievements
 */

import { Metadata } from 'next'
import { Card, Badge } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'My Badges | GrowButtler',
  description: 'View your earned achievements and badges',
}

export default function UserBadges() {
  const badges = [
    {
      id: 1,
      name: 'First Consultation',
      description: 'Completed your first consultation session',
      icon: '🌱',
      awardedAt: 'Jan 15, 2024',
      progress: 100
    },
    {
      id: 2,
      name: 'Growing Strong',
      description: 'Completed 5 consultation sessions',
      icon: '🌿',
      awardedAt: 'Feb 1, 2024',
      progress: 100
    },
    {
      id: 3,
      name: 'Expert Learner',
      description: 'Completed 10 consultations with different experts',
      icon: '📚',
      awardedAt: 'Feb 20, 2024',
      progress: 100
    },
    {
      id: 4,
      name: 'Knowledge Master',
      description: 'Complete 20 consultations',
      icon: '🏆',
      awardedAt: null,
      progress: 40 // 8 out of 20
    },
    {
      id: 5,
      name: 'Feedback Giver',
      description: 'Leave reviews on 10 consultations',
      icon: '⭐',
      awardedAt: null,
      progress: 30 // 3 out of 10
    },
    {
      id: 6,
      name: 'Perfect Score',
      description: 'Give 5 consecutive 5-star ratings',
      icon: '⚡',
      awardedAt: 'Feb 15, 2024',
      progress: 100
    },
  ]

  const awardedBadges = badges.filter(b => b.awardedAt)
  const unlockedBadges = badges.filter(b => !b.awardedAt)

  return (
    <div className="page-user-badges">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/user/dashboard' },
          { label: 'Badges' }
        ]}
      />

      <header className="page-header">
        <h1>Your Achievements</h1>
        <p>Unlock badges as you grow with GrowButtler</p>
      </header>

      {/* Stats */}
      <div className="badge-stats">
        <div className="stat">
          <span className="stat-value">{awardedBadges.length}</span>
          <span className="stat-label">Badges Earned</span>
        </div>
        <div className="stat">
          <span className="stat-value">{unlockedBadges.length}</span>
          <span className="stat-label">In Progress</span>
        </div>
      </div>

      {/* Awarded Badges */}
      {awardedBadges.length > 0 && (
        <section>
          <h2>Your Earned Badges</h2>
          <div className="badges-grid">
            {awardedBadges.map(badge => (
              <div key={badge.id} className="badge-card earned">
                <div className="badge-icon-large">{badge.icon}</div>
                <h3>{badge.name}</h3>
                <p className="badge-description">{badge.description}</p>
                <p className="badge-date">Earned: {badge.awardedAt}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* In Progress Badges */}
      {unlockedBadges.length > 0 && (
        <section>
          <h2>Unlock Next Badges</h2>
          <div className="badges-grid">
            {unlockedBadges.map(badge => (
              <Card key={badge.id} className="badge-card-detailed">
                <div className="badge-icon-medium">{badge.icon}</div>
                <h3>{badge.name}</h3>
                <p className="badge-description">{badge.description}</p>
                
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{badge.progress}% Complete</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Badge Details */}
      <Card title="Badge System">
        <div className="badge-info">
          <h3>How to Earn Badges</h3>
          <ul className="badge-rules">
            <li>
              <strong>First Consultation:</strong> Complete your first consultation session
            </li>
            <li>
              <strong>Growing Strong:</strong> Complete 5 consultation sessions
            </li>
            <li>
              <strong>Expert Learner:</strong> Take consultations from at least 10 different experts
            </li>
            <li>
              <strong>Knowledge Master:</strong> Complete 20 total consultations
            </li>
            <li>
              <strong>Feedback Giver:</strong> Leave reviews on 10 consultations
            </li>
            <li>
              <strong>Perfect Score:</strong> Give 5 consecutive 5-star ratings
            </li>
          </ul>
        </div>
      </Card>

      {/* Share Badges */}
      <Card title="Share Your Achievements">
        <div className="share-section">
          <p>Showcase your badges on social media and your profile</p>
          <div className="share-options">
            <button className="btn btn--secondary">Share to Twitter</button>
            <button className="btn btn--secondary">Share to LinkedIn</button>
            <button className="btn btn--secondary">Copy Badge Link</button>
          </div>
        </div>
      </Card>
    </div>
  )
}
