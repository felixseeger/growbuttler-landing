/**
 * Dashboard and user management types
 */

export type UserType = 'master' | 'user'
export type ConsultationStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show'
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * User authentication session
 */
export interface DashboardUser {
  id: string
  email: string
  name: string
  userType: UserType
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Master Growbuttler (Expert) specific data
 */
export interface MasterProfile extends DashboardUser {
  certifications: Certification[]
  hourlyRate: number
  expertise: string[]
  availability: AvailabilitySlot[]
  totalEarnings: number
  totalConsultations: number
  avgRating: number
  badges: Badge[]
}

/**
 * Growbuttler (User) specific data
 */
export interface UserProfile extends DashboardUser {
  subscriptionStatus: 'active' | 'inactive' | 'paused'
  totalSpent: number
  totalConsultations: number
  badges: Badge[]
  preferredMasters: string[] // IDs of favorite masters
}

/**
 * Consultation/Session
 */
export interface Consultation {
  id: string
  masterId: string
  userId: string
  masterName: string
  userName: string
  scheduledAt: Date
  duration: number // in minutes
  status: ConsultationStatus
  notes?: string
  recordingUrl?: string
  joinUrl?: string // Zoom/Meet link
  feedback?: {
    rating: number
    comment?: string
  }
  cost: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Payment/Payout tracking
 */
export interface Payout {
  id: string
  userId: string
  amount: number
  status: PayoutStatus
  payoutMethod: 'bank_transfer' | 'paypal' | 'stripe'
  period: {
    startDate: Date
    endDate: Date
  }
  consultations: string[] // Consultation IDs included
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Subscription/Payment for users
 */
export interface Subscription {
  id: string
  userId: string
  plan: 'basic' | 'pro' | 'enterprise'
  status: 'active' | 'inactive' | 'paused'
  monthlyPrice: number
  startDate: Date
  renewalDate: Date
  autoRenew: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Achievement badges
 */
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'certification' | 'achievement' | 'milestone'
  awardedAt: Date
  unlockedAt?: Date
}

/**
 * Certificates
 */
export interface Certificate {
  id: string
  userId: string
  title: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  url?: string
  credentialId?: string
  category: 'professional' | 'completion' | 'achievement'
}

/**
 * Availability slots (for masters)
 */
export interface AvailabilitySlot {
  id: string
  dayOfWeek: number // 0-6
  startTime: string // HH:mm
  endTime: string // HH:mm
  isRecurring: boolean
}

/**
 * Certification
 */
export interface Certification {
  id: string
  title: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  verified: boolean
  credentialUrl?: string
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalConsultations: number
  upcomingConsultations: number
  totalEarnings: number
  avgRating: number
  pendingPayouts: number
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}
