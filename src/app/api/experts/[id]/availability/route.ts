export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const WORDPRESS_API = process.env.WORDPRESS_API_URL || 'https://growbuttler-back.felixseeger.de/wp-json'
const APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD

/**
 * GET /api/experts/[id]/availability
 * Fetch expert availability slots
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expertId = params.id
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') // Optional: filter by specific date

    const url = `${WORDPRESS_API}/wp/v2/experts/${expertId}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`felix:${APP_PASSWORD}`).toString('base64')}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Expert not found' }, { status: 404 })
      }
      throw new Error(`WordPress API error: ${response.status}`)
    }

    const expert = await response.json()

    // Parse availability from ACF fields
    // Format: { "monday": ["09:00", "10:00", "14:00"], "tuesday": [...], ... }
    const availability = expert.acf?.availability_slots || {}

    // Parse blocked dates/times (for bookings, time off, etc.)
    const blockedSlots = expert.acf?.blocked_slots || []

    // If date is provided, filter availability for that specific date
    if (date) {
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
      const daySlots = availability[dayOfWeek] || []

      return NextResponse.json({
        date,
        dayOfWeek,
        availableSlots: daySlots,
        blockedSlots: blockedSlots.filter((slot: any) => slot.date === date),
      })
    }

    return NextResponse.json({
      expertId,
      availability,
      blockedSlots,
    })
  } catch (error: any) {
    console.error('Error fetching expert availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/experts/[id]/availability
 * Update expert availability slots (admin/expert only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expertId = params.id
    const body = await request.json()

    const { availability, blockedSlots } = body

    if (!availability) {
      return NextResponse.json(
        { error: 'Availability data is required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.BACKEND_URL
    const username = process.env.WORDPRESS_USERNAME
    const appPassword = process.env.APPLICATION_PASSWORD

    if (!backendUrl || !username || !appPassword) {
      return NextResponse.json(
        { error: 'Backend configuration missing' },
        { status: 500 }
      )
    }

    const auth = Buffer.from(`${username}:${appPassword.replace(/\s+/g, '')}`).toString('base64')

    // Update expert ACF fields
    const updateData = {
      acf: {
        availability_slots: availability,
        blocked_slots: blockedSlots || [],
      },
    }

    const response = await fetch(`${backendUrl}/wp-json/wp/v2/experts/${expertId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Failed to update availability:', errorData)
      return NextResponse.json(
        { error: 'Failed to update availability' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Availability updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating expert availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
