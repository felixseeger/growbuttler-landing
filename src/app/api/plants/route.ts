import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend not configured' },
        { status: 500 }
      )
    }

    // Fetch journal entries from WordPress for this user
    const response = await fetch(
      `${backendUrl}/wp-json/wp/v2/journal_entries?author=${user.userId}&per_page=100&orderby=date&order=desc`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('WordPress API error:', response.status)
      return NextResponse.json({ plants: [] })
    }

    const entries = await response.json()

    // Group journal entries by plant_id to get unique plants
    const plantsMap = new Map()

    entries.forEach((entry: any) => {
      const acf = entry.acf || {}
      const plantId = acf.plant_id

      if (plantId && !plantsMap.has(plantId)) {
        // Get the most recent entry for this plant
        plantsMap.set(plantId, {
          id: plantId,
          name: acf.plant_name || 'Unknown Plant',
          strain: '', // Can be added to ACF fields later
          stage: acf.stage || 'vegetative',
          dayNumber: acf.day_number || 1,
          weekNumber: acf.week_number || 1,
          imageUrl: entry.featured_media
            ? `${backendUrl}/wp-json/wp/v2/media/${entry.featured_media}`
            : null,
          lastUpdated: entry.modified,
        })
      }
    })

    const plants = Array.from(plantsMap.values())

    return NextResponse.json({ plants })
  } catch (error) {
    console.error('Fetch plants error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
