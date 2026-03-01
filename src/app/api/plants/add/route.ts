import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, strain, stage, location, startDate, featuredMediaId } = body

    if (!name || !stage) {
      return NextResponse.json(
        { error: 'Name and stage are required' },
        { status: 400 }
      )
    }

    const start = startDate ? new Date(startDate) : new Date()
    const today = new Date()
    const daysDiff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    const dayNumber = Math.max(1, daysDiff + 1)
    const weekNumber = Math.max(1, Math.ceil(dayNumber / 7))

    const plantId = `plant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })
    }

    const journalEntry = {
      title: `${name} - Day ${dayNumber}`,
      status: 'publish',
      acf: {
        plant_id: plantId,
        plant_name: name,
        day_number: dayNumber,
        week_number: weekNumber,
        stage: stage.toLowerCase(),
        type: 'observation',
        author_type: 'user',
      },
    }

    // Set featured image if provided
    if (featuredMediaId) {
      journalEntry.featured_media = parseInt(featuredMediaId)
    }

    const wpUsername = process.env.WORDPRESS_USERNAME
    const wpPassword = process.env.APPLICATION_PASSWORD?.replace(/\s/g, '')

    if (!wpUsername || !wpPassword) {
      return NextResponse.json({ error: 'WordPress credentials not configured' }, { status: 500 })
    }

    const authHeader = 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')

    const response = await fetch(
      `${backendUrl}/wp-json/wp/v2/journal_entries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(journalEntry),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('WordPress API error:', error)
      return NextResponse.json({ error: 'Failed to create plant entry' }, { status: 500 })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      plant: {
        id: plantId,
        name,
        strain,
        stage,
        location,
        dayNumber,
        weekNumber,
        startDate: start.toISOString(),
        imageId: featuredMediaId ? parseInt(featuredMediaId) : null,
      },
      journalEntryId: data.id,
    })
  } catch (error) {
    console.error('Add plant error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
