
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

    // 1. Find user in WordPress to get their ID (and verify they exist)
    const backendUrl = process.env.BACKEND_URL
    const wpUser = process.env.WORDPRESS_USERNAME
    const wpPass = process.env.APPLICATION_PASSWORD?.replace(/\s+/g, '')
    
    if (!backendUrl || !wpUser || !wpPass) {
      return NextResponse.json({ error: 'Backend configuration missing' }, { status: 500 })
    }

    const authHeader = `Basic ${Buffer.from(`${wpUser}:${wpPass}`).toString('base64')}`
    
    // Search for user by email
    const searchResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users?search=${encodeURIComponent(email)}&context=edit`, {
      headers: { 'Authorization': authHeader },
      cache: 'no-store'
    })

    if (!searchResponse.ok) {
      // Don't reveal if user exists or not for security, but log it
      console.error('WordPress user search failed:', searchResponse.status)
      // We still return success to prevent user enumeration
      return NextResponse.json({ success: true })
    }

    const users = await searchResponse.json()
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      console.log(`Password reset requested for non-existent user: ${email}`)
      // Return success to prevent enumeration
      return NextResponse.json({ success: true })
    }

    // 2. Generate a reset token (JWT)
    const resetToken = await new SignJWT({ 
      userId: user.id,
      email: user.email,
      type: 'password_reset'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(JWT_SECRET)

    // 3. Send the email
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
