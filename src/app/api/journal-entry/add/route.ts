import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { entryDate, narrative, temperature, humidity, nutrientMix, phLevel, featuredMediaId, additionalImageIds, featuredImageUrl, additionalImageUrls, plantId } = body

    if (!entryDate && !narrative) return NextResponse.json({ error: 'At least date or narrative required' }, { status: 400 })
    if (!plantId) return NextResponse.json({ error: 'Plant ID is required' }, { status: 400 })

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })

    // Fetch plant name for title from WordPress directly
    let plantName = 'Unknown Plant'
    try {
      const plantRes = await fetch(`${backendUrl}/wp-json/wp/v2/plants/${plantId}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (plantRes.ok) {
        const plant = await plantRes.json()
        plantName = plant.title?.rendered || plant.name || 'Unknown Plant'
      }
    } catch (e) {
      console.warn('Could not fetch plant name:', e)
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
      additional_images: additionalImageIds || [], // Store additional image IDs (if using WordPress media)
      featured_image_url: featuredImageUrl || '', // Store direct URL for locally uploaded images
      additional_image_urls: additionalImageUrls || [], // Store direct URLs for additional images
    }

    const journalEntry: any = {
      title: `${plantName} - ${entryDate || 'Entry'}`,
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
      console.error('WordPress API error:', response.status, errorText)
      return NextResponse.json({ 
        error: 'Failed to save journal entry',
        details: errorText,
        status: response.status 
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, entryId: (await response.json()).id })
  } catch (error: any) {
    console.error('Add journal entry error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 })
  }
}
