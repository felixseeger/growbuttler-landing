import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

/**
 * Proxy checkout to headless WordPress backend (e.g. WooCommerce or custom PayPal flow).
 * Query: plan=monthly
 */
export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get('plan') || 'monthly'
  if (!BACKEND_URL) {
    return NextResponse.redirect(new URL('/signup?plan=' + plan, request.url))
  }
  try {
    const url = `${BACKEND_URL.replace(/\/$/, '')}/api/checkout?plan=${encodeURIComponent(plan)}`
    return NextResponse.redirect(url)
  } catch {
    return NextResponse.redirect(new URL('/signup?plan=' + plan, request.url))
  }
}
