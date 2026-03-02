import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

// Update plant details
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, strain, stage, location, featuredImageUrl } = body
    const plantId = params.id

    if (!name && !stage) {
      return NextResponse.json({ error: 'At least name or stage required' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })

    const wpUsername = process.env.WORDPRESS_USERNAME
    const wpPassword = process.env.APPLICATION_PASSWORD?.replace(/\s/g, '')
    if (!wpUsername || !wpPassword) {
      return NextResponse.json({ error: 'WordPress credentials not configured' }, { status: 500 })
    }

    const authHeader = 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')

    // Find all journal entries for this plant
    const entriesRes = await fetch(
      `${backendUrl}/wp-json/wp/v2/journal_entries?author=${user.userId}&per_page=100`,
      { headers: { 'Authorization': authHeader } }
    )

    if (!entriesRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch plant entries' }, { status: 500 })
    }

    const entries = await entriesRes.json()
    const plantEntries = entries.filter((entry: any) => entry.acf?.plant_id === plantId)

    if (plantEntries.length === 0) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
    }

    // Update all entries with the new plant details
    const updatePromises = plantEntries.map(async (entry: any) => {
      const updatedEntry: any = {
        acf: {
          ...entry.acf,
          plant_name: name || entry.acf?.plant_name,
          stage: stage ? stage.toLowerCase() : entry.acf?.stage,
        },
      }

      // Update title if name changed
      if (name) {
        updatedEntry.title = `${name} - ${entry.title.rendered.split(' - ')[1] || 'Entry'}`
      }

      // Update featured image URL if provided
      if (featuredImageUrl !== undefined) {
        updatedEntry.acf.featured_image_url = featuredImageUrl
      }

      return fetch(`${backendUrl}/wp-json/wp/v2/journal_entries/${entry.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(updatedEntry),
      })
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      plant: {
        id: plantId,
        name: name || plantEntries[0].acf?.plant_name,
        strain,
        stage: stage || plantEntries[0].acf?.stage,
        location,
      }
    })
  } catch (error: any) {
    console.error('Update plant error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 })
  }
}

// Delete plant and all its journal entries
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const plantId = params.id

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })

    const wpUsername = process.env.WORDPRESS_USERNAME
    const wpPassword = process.env.APPLICATION_PASSWORD?.replace(/\s/g, '')
    if (!wpUsername || !wpPassword) {
      return NextResponse.json({ error: 'WordPress credentials not configured' }, { status: 500 })
    }

    const authHeader = 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')

    // Find all journal entries for this plant
    const entriesRes = await fetch(
      `${backendUrl}/wp-json/wp/v2/journal_entries?author=${user.userId}&per_page=100`,
      { headers: { 'Authorization': authHeader } }
    )

    if (!entriesRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch plant entries' }, { status: 500 })
    }

    const entries = await entriesRes.json()
    const plantEntries = entries.filter((entry: any) => entry.acf?.plant_id === plantId)

    if (plantEntries.length === 0) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
    }

    // Delete all journal entries for this plant
    const deletePromises = plantEntries.map((entry: any) =>
      fetch(`${backendUrl}/wp-json/wp/v2/journal_entries/${entry.id}?force=true`, {
        method: 'DELETE',
        headers: { 'Authorization': authHeader },
      })
    )

    await Promise.all(deletePromises)

    return NextResponse.json({
      success: true,
      deletedEntries: plantEntries.length
    })
  } catch (error: any) {
    console.error('Delete plant error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 })
  }
}
