import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    const wpUsername = process.env.WORDPRESS_USERNAME
    const wpPassword = process.env.APPLICATION_PASSWORD?.replace(/\s/g, '')

    if (!wpUsername || !wpPassword) {
      return NextResponse.json({ error: 'WordPress credentials not configured' }, { status: 500 })
    }

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const mediaResponse = await fetch(
      `${backendUrl}/wp-json/wp/v2/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          'Content-Disposition': `attachment; filename="${file.name}"`,
          'Authorization': 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64'),
        },
        body: buffer,
      }
    )

    if (!mediaResponse.ok) {
      const error = await mediaResponse.text()
      console.error('Media upload failed:', error)
      return NextResponse.json({ error: 'Failed to upload image to WordPress' }, { status: 500 })
    }

    const mediaData = await mediaResponse.json()

    return NextResponse.json({
      success: true,
      id: mediaData.id,
      url: mediaData.source_url,
      mediaType: 'image',
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
