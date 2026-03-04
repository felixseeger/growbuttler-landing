
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'growbuttler_super_secret_jwt_key_2026_change_in_prod'
)

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // 1. Verify the reset token
    let payload
    try {
      const decoded = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] })
      payload = decoded.payload
    } catch (error) {
      console.error('Reset token verification failed:', error)
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
    }

    if (payload.type !== 'password_reset' || !payload.userId) {
      return NextResponse.json({ error: 'Invalid reset token' }, { status: 400 })
    }

    // 2. Update the password in WordPress
    const backendUrl = process.env.BACKEND_URL
    const wpUser = process.env.WORDPRESS_USERNAME
    const wpPass = process.env.APPLICATION_PASSWORD?.replace(/\s+/g, '')
    
    if (!backendUrl || !wpUser || !wpPass) {
      return NextResponse.json({ error: 'Backend configuration missing' }, { status: 500 })
    }

    const authHeader = `Basic ${Buffer.from(`${wpUser}:${wpPass}`).toString('base64')}`
    
    const response = await fetch(`${backendUrl}/wp-json/wp/v2/users/${payload.userId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authHeader 
      },
      body: JSON.stringify({
        password: password
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('WordPress password update failed:', errorData)
      return NextResponse.json({ error: 'Failed to update password in WordPress' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Password has been reset successfully' })
  } catch (error: any) {
    console.error('Reset password API error:', error)
    return NextResponse.json({ error: 'An error occurred. Please try again later.' }, { status: 500 })
  }
}
