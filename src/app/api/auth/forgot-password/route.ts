
import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { sendEmail } from '@/lib/email'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'growbuttler_super_secret_jwt_key_2026_change_in_prod'
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL
    const username = process.env.WORDPRESS_USERNAME
    const password = process.env.WORDPRESS_PASSWORD

    if (!backendUrl || !username || !password) {
      console.error('Forgot Password - Missing env vars:', { 
        backendUrl: !!backendUrl, 
        username: !!username, 
        password: !!password 
      })
      return NextResponse.json({ error: 'Backend configuration missing' }, { status: 500 })
    }

    const auth = Buffer.from(`${username}:${password}`).toString('base64')
    
    // Search for user by email - use a simpler search if the first one fails
    let searchResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users?search=${encodeURIComponent(email)}&context=edit`, {
      headers: { 'Authorization': `Basic ${auth}` },
      cache: 'no-store'
    })

    if (!searchResponse.ok) {
      // Fallback search without edit context
      searchResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users?search=${encodeURIComponent(email)}`, {
        cache: 'no-store'
      })
    }

    if (!searchResponse.ok) {
      console.error('WordPress user search failed:', searchResponse.status)
      return NextResponse.json({ success: true })
    }

    const users = await searchResponse.json()
    console.log('WP Users found:', users.length, 'Searching for:', email)
    
    // Check name and username as well if email search is restrictive
    let user = users.find((u: any) => 
      u.email?.toLowerCase() === email.toLowerCase() || 
      u.slug?.toLowerCase() === email.replace(/[@.]/g, '-').toLowerCase() ||
      u.name?.toLowerCase() === email.toLowerCase()
    )

    if (!user && users.length === 1) {
      // If we only found one user with that search term, it's likely the right one
      user = users[0]
      console.log('Using single search result as match:', user.id)
    }

    if (!user) {
      return NextResponse.json({ success: true })
    }

    const resetToken = await new SignJWT({ 
      userId: user.id,
      email: user.email,
      type: 'password_reset'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(JWT_SECRET)

    const emailResult = await sendEmail({
      to: email,
      subject: 'Reset your GrowButtler password',
      templateType: 'password_reset',
      data: {
        name: user.name || 'Grower',
        email: user.email,
        token: resetToken
      }
    })

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error)
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Forgot password API error:', error)
    return NextResponse.json({ error: 'An error occurred. Please try again later.' }, { status: 500 })
  }
}
