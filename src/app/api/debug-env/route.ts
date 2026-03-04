
import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    BACKEND_URL: { set: !!process.env.BACKEND_URL, value: process.env.BACKEND_URL || 'missing' },
    WORDPRESS_USERNAME: { set: !!process.env.WORDPRESS_USERNAME, value: process.env.WORDPRESS_USERNAME || 'missing' },
    APPLICATION_PASSWORD: { set: !!process.env.APPLICATION_PASSWORD, value: process.env.APPLICATION_PASSWORD ? 'PRESENT' : 'missing' },
    JWT_SECRET: { set: !!process.env.JWT_SECRET, value: process.env.JWT_SECRET ? 'PRESENT' : 'missing' },
    RESEND_API_KEY: { set: !!process.env.RESEND_API_KEY, value: process.env.RESEND_API_KEY ? 'PRESENT' : 'missing' },
  }

  return NextResponse.json({
    env: envVars,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
}
