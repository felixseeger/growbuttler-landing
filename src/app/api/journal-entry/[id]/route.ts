import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

// Update journal entry
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { narrative, temperature, humidity, nutrientMix, phLevel } = body

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })

    const wpUsername = process.env.WORDPRESS_USERNAME
    const wpPassword = process.env.APPLICATION_PASSWORD?.replace(/\s/g, '')
    if (!wpUsername || !wpPassword) {
      return NextResponse.json({ error: 'WordPress credentials not configured' }, { status: 500 })
    }

    const authHeader = 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')

    // Get existing entry to preserve other fields
    const getRes = await fetch(`${backendUrl}/wp-json/wp/v2/journal_entries/${params.id}`, {
      headers: { 'Authorization': authHeader }
    })

    if (!getRes.ok) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    const existingEntry = await getRes.json()

    // Update the entry
    const updatedEntry: any = {
      content: narrative || existingEntry.content.rendered,
      acf: {
        ...existingEntry.acf,
        temperature_fahrenheit: temperature !== undefined ? temperature : existingEntry.acf?.temperature_fahrenheit,
        humidity_percent: humidity !== undefined ? humidity : existingEntry.acf?.humidity_percent,
        nutrient_mix: nutrientMix !== undefined ? nutrientMix : existingEntry.acf?.nutrient_mix,
        ph_level: phLevel !== undefined ? (phLevel ? parseFloat(phLevel) : null) : existingEntry.acf?.ph_level,
      },
    }

    const response = await fetch(`${backendUrl}/wp-json/wp/v2/journal_entries/${params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(updatedEntry),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('WordPress API error:', response.status, errorText)
      return NextResponse.json({
        error: 'Failed to update journal entry',
        details: errorText,
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update journal entry error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 })
  }
}

// Delete journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })

    const wpUsername = process.env.WORDPRESS_USERNAME
    const wpPassword = process.env.APPLICATION_PASSWORD?.replace(/\s/g, '')
    if (!wpUsername || !wpPassword) {
      return NextResponse.json({ error: 'WordPress credentials not configured' }, { status: 500 })
    }

    const authHeader = 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')

    const response = await fetch(`${backendUrl}/wp-json/wp/v2/journal_entries/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('WordPress API error:', response.status, errorText)
      return NextResponse.json({
        error: 'Failed to delete journal entry',
        details: errorText,
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete journal entry error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 })
  }
}
