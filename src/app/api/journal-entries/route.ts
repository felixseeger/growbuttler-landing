import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const plantId = searchParams.get('plantId')

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })
    }

    let url = `${backendUrl}/wp-json/wp/v2/journal_entries?author=${user.userId}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`
    
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } })

    if (!response.ok) {
      console.error('WordPress API error:', response.status)
      return NextResponse.json({ entries: [] })
    }

    const entries = await response.json()

    let processedEntries = entries.map((entry: any) => {
      let imageUrl: string | null = null
      const featuredMedia = entry._embedded?.['wp:featuredmedia']
      if (featuredMedia?.[0]?.source_url) {
        imageUrl = featuredMedia[0].source_url
      }

      return {
        id: entry.id,
        date: entry.date,
        title: entry.title.rendered,
        content: entry.content.rendered,
        imageUrl,
        acf: {
          plant_id: entry.acf?.plant_id,
          plant_name: entry.acf?.plant_name,
          day_number: entry.acf?.day_number,
          week_number: entry.acf?.week_number,
          stage: entry.acf?.stage,
          entry_type: entry.acf?.entry_type,
          temperature_fahrenheit: entry.acf?.temperature_fahrenheit,
          humidity_percent: entry.acf?.humidity_percent,
          nutrient_mix: entry.acf?.nutrient_mix,
          ph_level: entry.acf?.ph_level,
        },
      }
    })

    if (plantId) {
      processedEntries = processedEntries.filter((entry: any) => entry.acf?.plant_id === plantId)
    }

    return NextResponse.json({ entries: processedEntries })
  } catch (error) {
    console.error('Fetch journal entries error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
