export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { sendEmail } from '@/lib/email'

/**
 * POST /api/admin/assign-interview
 * Assign a MasterGrowButtler to interview an expert applicant
 */
export async function POST(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('growbuttler_auth')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await verifyToken(token)
    if (!currentUser) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check permissions (admin only for now)
    if (!currentUser.roles?.includes('administrator')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { applicantId, masterGrowerId, scheduledDate, notes } = await request.json()

    if (!applicantId || !masterGrowerId) {
      return NextResponse.json(
        { error: 'Missing applicantId or masterGrowerId' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.BACKEND_URL
    const username = process.env.WORDPRESS_USERNAME
    const appPassword = process.env.APPLICATION_PASSWORD

    if (!backendUrl || !username || !appPassword) {
      return NextResponse.json({ error: 'Backend configuration missing' }, { status: 500 })
    }

    const auth = Buffer.from(`${username}:${appPassword.replace(/\s+/g, '')}`).toString('base64')

    // Fetch applicant data
    const applicantResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users/${applicantId}`, {
      headers: { Authorization: `Basic ${auth}` },
    })

    if (!applicantResponse.ok) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 })
    }

    const applicant = await applicantResponse.json()

    // Fetch MasterGrower data
    const masterResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users/${masterGrowerId}`, {
      headers: { Authorization: `Basic ${auth}` },
    })

    if (!masterResponse.ok) {
      return NextResponse.json({ error: 'Master Grower not found' }, { status: 404 })
    }

    const masterGrower = await masterResponse.json()

    // Verify MasterGrower has correct role
    if (!masterGrower.roles?.includes('master_grower') && !masterGrower.roles?.includes('administrator')) {
      return NextResponse.json(
        { error: 'Selected user is not a Master Grower' },
        { status: 400 }
      )
    }

    // Update applicant metadata
    const updateResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users/${applicantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        meta: {
          ...applicant.meta,
          interview_assigned_to: masterGrowerId,
          interview_assigned_to_name: masterGrower.name,
          interview_scheduled_date: scheduledDate || null,
          interview_assignment_date: new Date().toISOString(),
          interview_notes: notes || '',
          application_status: 'interview_scheduled',
        },
      }),
    })

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      console.error('Failed to update applicant:', errorData)
      return NextResponse.json({ error: 'Failed to assign interview' }, { status: 500 })
    }

    // Send email to MasterGrower
    await sendEmail({
      to: masterGrower.email,
      subject: `New Interview Assigned: ${applicant.name}`,
      templateType: 'welcome', // TODO: Create specific interview_assignment template
      data: {
        name: masterGrower.name,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
        scheduledDate: scheduledDate
          ? new Date(scheduledDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'To be scheduled',
      },
    })

    // Send email to applicant
    await sendEmail({
      to: applicant.email,
      subject: 'Interview Scheduled - GrowButtler Expert Application',
      templateType: 'welcome', // TODO: Create specific interview_scheduled template
      data: {
        name: applicant.name,
        masterGrowerName: masterGrower.name,
        scheduledDate: scheduledDate
          ? new Date(scheduledDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'To be scheduled - you will be contacted shortly',
      },
    })

    return NextResponse.json({
      success: true,
      message: `Interview assigned to ${masterGrower.name}`,
      interview: {
        applicantId,
        applicantName: applicant.name,
        masterGrowerId,
        masterGrowerName: masterGrower.name,
        scheduledDate,
        status: 'interview_scheduled',
      },
    })
  } catch (error: any) {
    console.error('Error assigning interview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
