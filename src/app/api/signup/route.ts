import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sendEmail } from '@/lib/email'
import { createToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.BACKEND_URL
    const username = process.env.WORDPRESS_USERNAME
    const appPassword = process.env.APPLICATION_PASSWORD

    if (!backendUrl || !username || !appPassword) {
      console.error('Missing env vars:', {
        BACKEND_URL: !!backendUrl,
        WORDPRESS_USERNAME: !!username,
        APPLICATION_PASSWORD: !!appPassword,
      })
      return NextResponse.json(
        { error: 'Backend configuration missing. Please contact support.' },
        { status: 500 }
      )
    }

    // WordPress requires a username. We'll use the email as the username.
    const wpUser = {
      username: email,
      name: name,
      email: email,
      password: password,
      roles: ['subscriber'], // Default role for new signups
    }

    const auth = Buffer.from(`${username}:${appPassword.replace(/\s+/g, '')}`).toString('base64')

    const response = await fetch(`${backendUrl}/wp-json/wp/v2/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(wpUser),
    })

    const data = await response.json()

    if (!response.ok) {
      // Provide clearer error messages
      let errorMessage = data.message || 'Failed to create account'
      if (data.code === 'existing_user_login' || data.code === 'existing_user_email') {
        errorMessage = 'An account with this email already exists. Please log in instead.'
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    // Auto-login: Create JWT token and set cookie so user is immediately authenticated
    const token = createToken({
      userId: data.id,
      email: data.email,
      name: data.name,
      roles: data.roles || ['subscriber'],
    })

    const cookieStore = await cookies()
    cookieStore.set('growbuttler_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    // Send welcome email (non-blocking — don't fail signup if email fails)
    sendEmail({
      to: data.email,
      subject: 'Welcome to GrowButtler!',
      templateType: 'welcome',
      data: {
        name: data.name,
      },
    }).catch((err) => {
      console.error('Welcome email failed (non-blocking):', err)
    })

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
      },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
