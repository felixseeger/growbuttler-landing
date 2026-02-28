import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'growbuttler_super_secret_jwt_key_2026_change_in_prod'
)

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/settings',
  '/journal',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    const token = request.cookies.get('growbuttler_auth')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Use jose for Edge-compatible JWT verification
      await jwtVerify(token, JWT_SECRET)
    } catch (error) {
      console.error('Middleware token verification failed:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/journal/:path*'],
}
