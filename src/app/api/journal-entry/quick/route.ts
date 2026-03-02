import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plantId, content, postId } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (!plantId) {
      return NextResponse.json({ error: 'Plant ID is required' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend not configured' }, { status: 500 })
    }

    const wpUsername = process.env.WORDPRESS_USERNAME
    const wpPassword = process.env.APPLICATION_PASSWORD?.replace(/\s/g, '')
    if (!wpUsername || !wpPassword) {
      return NextResponse.json({ error: 'WordPress credentials not configured' }, { status: 500 })
    }

    const authHeader = 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')

    // If no postId provided, we need to find or create a journal entry post for this plant
    let targetPostId = postId

    if (!targetPostId) {
      // Fetch existing journal entries for this plant
      const entriesRes = await fetch(
        `${backendUrl}/wp-json/wp/v2/journal_entries?author=${user.userId}&per_page=100`,
        {
          headers: { 'Authorization': authHeader },
        }
      )

      if (entriesRes.ok) {
        const entries = await entriesRes.json()
        const plantEntry = entries.find((entry: any) => entry.acf?.plant_id === plantId)
        if (plantEntry) {
          targetPostId = plantEntry.id
        }
      }
    }

    // If still no post found, create a quick journal entry post
    if (!targetPostId) {
      const newPostRes = await fetch(`${backendUrl}/wp-json/wp/v2/journal_entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({
          title: `Journal - ${plantId}`,
          status: 'publish',
          content: '',
          author: user.userId,
          acf: {
            plant_id: plantId,
            entry_type: 'observation',
            author_type: 'user',
          },
        }),
      })

      if (newPostRes.ok) {
        const newPost = await newPostRes.json()
        targetPostId = newPost.id
      } else {
        return NextResponse.json({ error: 'Failed to create journal post' }, { status: 500 })
      }
    }

    // Now create the comment
    const commentRes = await fetch(`${backendUrl}/wp-json/wp/v2/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        post: targetPostId,
        content: content.trim(),
        author_name: user.name || 'User',
        author_email: user.email,
      }),
    })

    if (!commentRes.ok) {
      const errorText = await commentRes.text()
      console.error('WordPress comment API error:', commentRes.status, errorText)
      return NextResponse.json(
        {
          error: 'Failed to add comment',
          details: errorText,
        },
        { status: commentRes.status }
      )
    }

    const comment = await commentRes.json()

    return NextResponse.json({
      success: true,
      commentId: comment.id,
      postId: targetPostId,
    })
  } catch (error: any) {
    console.error('Add quick entry error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
