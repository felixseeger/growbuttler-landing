import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })
    }

    const response = await fetch(
      `${backendUrl}/wp-json/wp/v2/journal_entries?author=${user.userId}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!response.ok) {
      console.error('WordPress API error:', response.status)
      return NextResponse.json({ plants: [] })
    }

    const entries = await response.json()
    const plantsMap = new Map()

    entries.forEach((entry: any) => {
      const acf = entry.acf || {}
      const plantId = acf.plant_id

      if (plantId && !plantsMap.has(plantId)) {
        let imageUrl = null
        const featuredMedia = (entry._embedded as any)?.['wp:featuredmedia']
        if (featuredMedia?.[0]?.source_url) {
          imageUrl = featuredMedia[0].source_url
        }

        plantsMap.set(plantId, {
          id: plantId,
          name: acf.plant_name || 'Unknown Plant',
          strain: '',
          stage: acf.stage || 'vegetative',
          dayNumber: acf.day_number || 1,
          weekNumber: acf.week_number || 1,
          imageUrl,
          lastUpdated: entry.modified,
        })
      }
    })

    return NextResponse.json({ plants: Array.from(plantsMap.values()) })
  } catch (error) {
    console.error('Fetch plants error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
