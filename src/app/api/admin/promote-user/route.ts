export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { sendEmail } from '@/lib/email'

/**
 * POST /api/admin/promote-user
 * Promote user to different role (admin only)
 * Use cases:
 * - expert_applicant → approved_expert (after approval)
 * - approved_expert → master_grower (promote to MasterGrowButtler)
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

    // Check if user is admin
    if (!currentUser.roles?.includes('administrator')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { userId, newRole, notify = true } = await request.json()

    if (!userId || !newRole) {
      return NextResponse.json({ error: 'Missing userId or newRole' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['subscriber', 'expert_applicant', 'approved_expert', 'master_grower', 'administrator']
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL
    const username = process.env.WORDPRESS_USERNAME
    const appPassword = process.env.APPLICATION_PASSWORD

    if (!backendUrl || !username || !appPassword) {
      return NextResponse.json({ error: 'Backend configuration missing' }, { status: 500 })
    }

    const auth = Buffer.from(`${username}:${appPassword.replace(/\s+/g, '')}`).toString('base64')

    // Fetch current user data
    const userResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users/${userId}`, {
      headers: { Authorization: `Basic ${auth}` },
    })

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = await userResponse.json()

    // Update user role
    const updateResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        roles: [newRole],
      }),
    })

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      console.error('Failed to update user role:', errorData)
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
    }

    const updatedUser = await updateResponse.json()

    // Send notification emails based on role change
    if (notify) {
      if (newRole === 'approved_expert') {
        // Expert approved - send welcome email
        await sendEmail({
          to: userData.email,
          subject: 'Welcome to the GrowButtler Expert Network! 🎉',
          templateType: 'expert_approved',
          data: {
            name: userData.name,
            expertId: userId,
          },
        })
      } else if (newRole === 'master_grower') {
        // Promoted to MasterGrowButtler
        await sendEmail({
          to: userData.email,
          subject: 'You\'ve been promoted to Master Grower! 🌿',
          templateType: 'welcome', // We can create a specific template for this
          data: {
            name: userData.name,
          },
        })

        // Notify admin
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'felixseeger@googlemail.com',
          subject: `User promoted to Master Grower: ${userData.name}`,
          templateType: 'welcome',
          data: {
            name: 'Admin',
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        roles: updatedUser.roles,
      },
      message: `User successfully promoted to ${newRole}`,
    })
  } catch (error: any) {
    console.error('Error promoting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
