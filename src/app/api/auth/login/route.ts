import { NextResponse } from 'next/server'
import { createToken, verifyWordPressCredentials } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const wpUser = await verifyWordPressCredentials(email, password)
    if (!wpUser) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await createToken({
      userId: wpUser.id,
      email,
      name: wpUser.name,
      firstName: wpUser.firstName,
      lastName: wpUser.lastName,
      roles: wpUser.roles,
    })

    const cookieStore = await cookies()
    cookieStore.set('growbuttler_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: wpUser.id,
        email,
        name: wpUser.name,
        firstName: wpUser.firstName,
        lastName: wpUser.lastName,
        roles: wpUser.roles,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}
