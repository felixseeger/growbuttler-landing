export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL
    const wpUsername = process.env.WORDPRESS_USERNAME
    const wpPassword = process.env.APPLICATION_PASSWORD?.replace(/\s/g, '')

    if (!backendUrl || !wpUsername || !wpPassword) {
      return NextResponse.json({ error: 'WordPress credentials not configured' }, { status: 500 })
    }

    const authHeader = 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')

    // Create a new form data for WordPress
    const wpFormData = new FormData()
    wpFormData.append('file', file)
    wpFormData.append('title', file.name)
    wpFormData.append('alt_text', 'Plant photo uploaded by ' + user.name)
    wpFormData.append('status', 'publish')

    // Upload to WordPress Media Library
    const response = await fetch(`${backendUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: wpFormData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('WordPress Media API error:', errorData)
      return NextResponse.json({ error: 'Failed to upload to WordPress' }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      id: data.id,
      url: data.source_url,
      mediaType: 'image',
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
