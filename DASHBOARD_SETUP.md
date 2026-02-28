# GrowButtler Dashboard Setup

## Overview

This document describes the complete dashboard system for GrowButtler with separate interfaces for MasterGrowbuttlers (Experts) and Growbuttlers (Users).

## Project Structure

### Directory Layout

```
src/
├── app/
│   ├── master/                          # Expert Dashboard
│   │   ├── layout.tsx                   # Master dashboard layout
│   │   ├── dashboard/page.tsx           # Overview, stats, upcoming interviews
│   │   ├── interviews/page.tsx          # Interview management & scheduling
│   │   ├── payouts/page.tsx             # Payment history & earnings tracking
│   │   ├── badges-certificates/page.tsx # Achievements & credentials
│   │   ├── calendar/page.tsx            # Appointment calendar & availability
│   │   ├── profile/page.tsx             # Expert profile & bio
│   │   └── settings/page.tsx            # Account configuration
│   │
│   └── user/                            # User Dashboard
│       ├── layout.tsx                   # User dashboard layout
│       ├── dashboard/page.tsx           # Overview & consultation history
│       ├── upcoming-consultations/page.tsx  # Scheduled sessions
│       ├── consultations-archive/page.tsx   # Past consultations & recordings
│       ├── badges/page.tsx              # Earned achievements
│       ├── certificates/page.tsx        # Completion certificates
│       ├── calendar/page.tsx            # Personal calendar
│       ├── payouts/page.tsx             # Subscription/payment status
│       ├── profile/page.tsx             # User profile & preferences
│       └── settings/page.tsx            # Account settings
│
├── components/
│   ├── DashboardNav.tsx                 # Navigation & breadcrumbs
│   └── DashboardComponents.tsx          # Reusable UI components
│
├── lib/
│   └── auth.ts                          # Authentication utilities
│
├── types/
│   ├── dashboard.ts                     # Dashboard TypeScript types
│   └── wordpress.ts                     # WordPress types (existing)
│
└── styles/
    └── dashboard.scss                   # Dashboard styling
```

## Features

### Master Growbuttler (Expert) Dashboard

**Routes**: `/master/*`

1. **Dashboard** (`/master/dashboard`)
   - Overview with key statistics
   - Upcoming interviews
   - Pending payouts
   - Quick action buttons

2. **Interviews** (`/master/interviews`)
   - List and filter consultations
   - Schedule and manage sessions
   - Session notes and details
   - Join links for video calls

3. **Payouts** (`/master/payouts`)
   - Earnings summary
   - Payout request form
   - Payment history
   - Tax documentation

4. **Badges & Certificates** (`/master/badges-certificates`)
   - Display earned badges
   - Manage certifications
   - Add new credentials
   - Verify qualifications

5. **Calendar** (`/master/calendar`)
   - Appointment calendar
   - Availability management
   - Time slot configuration
   - Timezone settings

6. **Profile** (`/master/profile`)
   - Expert information
   - Professional bio
   - Areas of expertise
   - Hourly rates and languages
   - Service details

7. **Settings** (`/master/settings`)
   - Account security
   - Notification preferences
   - Payout settings
   - Privacy controls
   - Connected apps

### Growbuttler (User) Dashboard

**Routes**: `/user/*`

1. **Dashboard** (`/user/dashboard`)
   - Consultation overview
   - Upcoming sessions
   - Recent consultations
   - Subscription status
   - Getting started tips

2. **Upcoming Consultations** (`/user/upcoming-consultations`)
   - Scheduled sessions
   - Join links
   - Reschedule options
   - Preparation tips

3. **Consultations Archive** (`/user/consultations-archive`)
   - Past consultations
   - Session recordings
   - Feedback/reviews
   - Export history

4. **Badges** (`/user/badges`)
   - Earned achievements
   - In-progress badges
   - Badge requirements
   - Social sharing

5. **Certificates** (`/user/certificates`)
   - Completion certificates
   - Certificate programs
   - Progress tracking
   - Shareable credentials

6. **Calendar** (`/user/calendar`)
   - Personal calendar view
   - Event timeline
   - Calendar sync
   - Settings and export

7. **Account & Billing** (`/user/payouts`)
   - Subscription details
   - Plan comparison
   - Payment methods
   - Billing history

8. **Profile** (`/user/profile`)
   - Personal information
   - Growing interests
   - Expert preferences
   - Privacy settings
   - Favorite experts

9. **Settings** (`/user/settings`)
   - Password & security
   - Notification preferences
   - Email settings
   - Language & timezone
   - Data privacy

## Data Models

### Core Types (see `src/types/dashboard.ts`)

```typescript
// User Types
interface DashboardUser {
  id: string
  email: string
  name: string
  userType: 'master' | 'user'
  avatar?: string
  bio?: string
}

interface MasterProfile extends DashboardUser {
  certifications: Certification[]
  hourlyRate: number
  expertise: string[]
  totalEarnings: number
  avgRating: number
}

interface UserProfile extends DashboardUser {
  subscriptionStatus: 'active' | 'inactive'
  totalSpent: number
}

// Consultations
interface Consultation {
  id: string
  masterId: string
  userId: string
  scheduledAt: Date
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled'
  recordingUrl?: string
  joinUrl?: string
}

// Payments
interface Payout {
  id: string
  userId: string
  amount: number
  status: 'pending' | 'processing' | 'completed'
}

interface Subscription {
  id: string
  userId: string
  plan: 'basic' | 'pro' | 'enterprise'
  status: 'active' | 'inactive'
}

// Achievements
interface Badge {
  id: string
  name: string
  icon: string
  awardedAt?: Date
}

interface Certificate {
  id: string
  title: string
  issuer: string
  issueDate: Date
  category: 'professional' | 'completion'
}
```

## Components

### DashboardNav Component
Navigation bar and breadcrumbs component.

```tsx
<DashboardNav 
  userType="master"
  userName="Jane Expert"
  avatar="https://..."
/>

<Breadcrumbs items={[
  { label: 'Dashboard', href: '/master/dashboard' },
  { label: 'Interviews' }
]}/>
```

### Reusable Components

- **StatCard**: Display key metrics
- **Card**: Container component with optional header/footer
- **Table**: Data table with pagination
- **EmptyState**: Placeholder for empty sections
- **Alert**: Success/error/warning messages
- **Badge**: Styled badge labels
- **Pagination**: Page navigation

## Styling

Dashboard styling is managed in `src/styles/dashboard.scss` with:

- CSS Grid and Flexbox layouts
- Responsive design (mobile-first)
- Consistent color scheme using CSS variables
- Accessibility-first component design
- Smooth transitions and hover effects

### Color Palette

- **Primary**: #2ecc71 (Green)
- **Secondary**: #3498db (Blue)
- **Success**: #27ae60 (Dark Green)
- **Warning**: #f39c12 (Orange)
- **Danger**: #e74c3c (Red)
- **Neutral**: #95a5a6 (Gray)

## Authentication

Currently using mock authentication in `src/lib/auth.ts`. To implement real authentication:

1. **NextAuth.js** (recommended)
   - Easy integration with Next.js
   - Support for OAuth providers
   - Session management

2. **Supabase**
   - Built-in authentication
   - Database integration
   - Real-time updates

3. **Auth0**
   - Enterprise-grade auth
   - Advanced security features
   - Multi-tenancy support

### Implementation Pattern

```typescript
// Replace mockUsers with actual database queries
async function getCurrentUser() {
  const session = await getSession() // From NextAuth, Supabase, etc.
  return session?.user || null
}

// Add route guards
async function verifyDashboardAccess(requiredType: UserType) {
  const user = await getCurrentUser()
  return canAccessRoute(user.userType, requiredType)
}
```

## Database Integration

The pages are structured to support easy database integration:

1. Replace mock data with API calls
2. Use React hooks (useState, useEffect) for data fetching
3. Implement error boundaries for failed requests
4. Add loading states using spinner components

Example integration:

```typescript
import { useEffect, useState } from 'react'
import { Consultation } from '@/types/dashboard'

export default function MasterInterviews() {
  const [interviews, setInterviews] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInterviews()
  }, [])

  async function fetchInterviews() {
    const response = await fetch('/api/master/interviews')
    const data = await response.json()
    setInterviews(data)
    setLoading(false)
  }

  return (
    // Component JSX
  )
}
```

## API Routes

Create these API routes to support the dashboard:

```
/api/auth/login              POST
/api/auth/logout             POST
/api/master/dashboard        GET
/api/master/interviews       GET, POST, PATCH
/api/master/payouts          GET, POST
/api/user/dashboard          GET
/api/user/consultations      GET
/api/consultations/:id       GET, PATCH
/api/subscriptions           GET, PATCH
```

## SEO & Metadata

Dashboard pages have `robots: { index: false }` in their metadata to prevent indexing of user-specific pages.

## Accessibility

All components follow WCAG 2.1 guidelines:

- Semantic HTML (nav, main, section, etc.)
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Focus management

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live consultation updates
2. **Mobile App**: React Native version
3. **Analytics**: Usage tracking and insights
4. **Notifications**: Email and push notification system
5. **Video Integration**: Zoom/Meet API integration
6. **Chat System**: Real-time messaging between experts and users
7. **Payment Processing**: Stripe/PayPal integration
8. **Search & Filters**: Advanced filtering and search
9. **Export Functions**: PDF generation for certificates and invoices
10. **Mobile-First Redesign**: Progressive web app capabilities

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`

3. Run development server:
   ```bash
   npm run dev
   ```

4. Visit dashboard routes:
   - Expert: http://localhost:3000/master/dashboard
   - User: http://localhost:3000/user/dashboard

## Production Deployment

Before deploying:

1. Implement real authentication
2. Set up database
3. Create API routes
4. Test all pages and functionality
5. Implement error handling and logging
6. Set up monitoring and analytics
7. Configure environment variables
8. Run security audit
9. Test on multiple devices and browsers

## Support

For questions or issues:
- Check dashboard types in `src/types/dashboard.ts`
- Review component docs in `src/components/`
- See styling guide in `src/styles/dashboard.scss`
