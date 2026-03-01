import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { entryDate, narrative, temperature, humidity, nutrientMix, phLevel, featuredMediaId, plantId } = body

    if (!entryDate && !narrative) {
      return NextResponse.json({ error: 'At least date or narrative required' }, { status: 400 })
    }

    if (!plantId) {
      return NextResponse.json({ error: 'Plant ID is required' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })

    // Fetch plant details to include in entry
    const plantsRes = await fetch('/api/plants', { credentials: 'include' })
    let plantName = 'Unknown Plant'
    let plantStage = ''
    if (plantsRes.ok) {
      const { plants } = await plantsRes.json()
      const plant = plants.find((p: any) => p.id === plantId)
      if (plant) {
        plantName = plant.name
        plantStage = plant.stage
      }
    }

    const acf = {
      plant_id: plantId,
      plant_name: plantName,
      entry_date: entryDate ? new Date(entryDate).toISOString().replace('T', ' ').substring(0, 19) : new Date().toISOString().replace('T', ' ').substring(0, 19),
      entry_type: 'observation',
      author_type: 'user',
      temperature_fahrenheit: temperature,
      humidity_percent: humidity,
      nutrient_mix: nutrientMix,
      ph_level: phLevel ? parseFloat(phLevel) : null,
    }

    const journalEntry: any = {
      title: `${plantName} - Entry - ${entryDate || 'Today'}`,
      status: 'publish',
      author: user.userId,
      content: narrative || '',
      acf,
    }

    if (featuredMediaId) journalEntry.featured_media = parseInt(featuredMediaId)

    const wpUsername = process.env.WORDPRESS_USERNAME
    const wpPassword = process.env.APPLICATION_PASSWORD?.replace(/\s/g, '')
    if (!wpUsername || !wpPassword) return NextResponse.json({ error: 'WordPress credentials not configured' }, { status: 500 })

    const authHeader = 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')

    const response = await fetch(`${backendUrl}/wp-json/wp/v2/journal_entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
      body: JSON.stringify(journalEntry),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('WordPress API error:', errorText)
      return NextResponse.json({ error: 'Failed to save journal entry' }, { status: 500 })
    }

    return NextResponse.json({ success: true, entryId: (await response.json()).id })
  } catch (error) {
    console.error('Add journal entry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
