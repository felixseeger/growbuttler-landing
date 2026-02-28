import { NextResponse } from 'next/server'
import { createToken, verifyWordPressCredentials } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Verify credentials against WordPress
    const wpUser = await verifyWordPressCredentials(email, password)

    if (!wpUser) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = createToken({
      userId: wpUser.id,
      email,
      name: wpUser.name,
      roles: wpUser.roles,
    })

    // Set httpOnly cookie with token
    const cookieStore = await cookies()
    cookieStore.set('growbuttler_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: wpUser.id,
        email,
        name: wpUser.name,
        roles: wpUser.roles,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
