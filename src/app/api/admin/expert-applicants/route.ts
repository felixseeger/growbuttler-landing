export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

/**
 * GET /api/admin/expert-applicants
 * Get list of expert applicants (admin and master_grower only)
 */
export async function GET(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('growbuttler_auth')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user has admin or master_grower role
    const hasPermission = user.roles?.includes('administrator') || user.roles?.includes('master_grower')
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const backendUrl = process.env.BACKEND_URL
    const username = process.env.WORDPRESS_USERNAME
    const appPassword = process.env.APPLICATION_PASSWORD

    if (!backendUrl || !username || !appPassword) {
      return NextResponse.json({ error: 'Backend configuration missing' }, { status: 500 })
    }

    const auth = Buffer.from(`${username}:${appPassword.replace(/\s+/g, '')}`).toString('base64')

    // Fetch users with expert_applicant role
    const response = await fetch(
      `${backendUrl}/wp-json/wp/v2/users?roles=expert_applicant&per_page=100`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch expert applicants')
    }

    const applicants = await response.json()

    // Transform data for frontend
    const transformedApplicants = applicants.map((applicant: any) => ({
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      phone: applicant.meta?.phone || '',
      location: applicant.meta?.location || '',
      specializations: applicant.meta?.specialization?.split(',') || [],
      yearsExperience: applicant.meta?.years_experience || '',
      certifications: applicant.meta?.certifications || '',
      serviceRate: applicant.meta?.service_rate || '',
      applicationStatus: applicant.meta?.application_status || 'pending_review',
      applicationDate: applicant.meta?.application_date || '',
      portfolioImages: applicant.meta?.portfolio_images?.split(',') || [],
      portfolioImageCount: applicant.meta?.portfolio_image_count || 0,
      bio: applicant.meta?.bio || '',
      successStories: applicant.meta?.success_stories || '',
      availableInterviewTimes: applicant.meta?.available_interview_times?.split(',') || [],
      interviewAssignedTo: applicant.meta?.interview_assigned_to || null,
      interviewScheduledDate: applicant.meta?.interview_scheduled_date || null,
      interviewRecommendation: applicant.meta?.interview_recommendation || null,
      interviewNotes: applicant.meta?.interview_notes || null,
    }))

    return NextResponse.json({
      success: true,
      applicants: transformedApplicants,
      total: transformedApplicants.length,
    })
  } catch (error: any) {
    console.error('Error fetching expert applicants:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
