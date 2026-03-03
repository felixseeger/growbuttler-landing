export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

/**
 * GET /api/admin/master-growers
 * Get list of users with master_grower role (admin only)
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

    // Check if user is admin
    if (!user.roles?.includes('administrator')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const backendUrl = process.env.BACKEND_URL
    const username = process.env.WORDPRESS_USERNAME
    const appPassword = process.env.APPLICATION_PASSWORD

    if (!backendUrl || !username || !appPassword) {
      return NextResponse.json({ error: 'Backend configuration missing' }, { status: 500 })
    }

    const auth = Buffer.from(`${username}:${appPassword.replace(/\s+/g, '')}`).toString('base64')

    // Fetch users with master_grower role
    const response = await fetch(
      `${backendUrl}/wp-json/wp/v2/users?roles=master_grower&per_page=100`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch master growers')
    }

    const masterGrowers = await response.json()

    // Transform data for frontend
    const transformedMasterGrowers = masterGrowers.map((mg: any) => ({
      id: mg.id,
      name: mg.name,
      email: mg.email,
      registeredDate: mg.registered_date || null,
    }))

    return NextResponse.json({
      success: true,
      masterGrowers: transformedMasterGrowers,
      total: transformedMasterGrowers.length,
    })
  } catch (error: any) {
    console.error('Error fetching master growers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
