
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasBackendUrl: !!process.env.BACKEND_URL,
    hasWpUsername: !!process.env.WORDPRESS_USERNAME,
    hasAppPassword: !!process.env.APPLICATION_PASSWORD,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasResendKey: !!process.env.RESEND_API_KEY,
    backendUrl: process.env.BACKEND_URL ? 'set' : 'missing',
  })
}
