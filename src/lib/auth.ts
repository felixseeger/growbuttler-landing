import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'growbuttler_super_secret_jwt_key_2026_change_in_prod'

export interface TokenPayload {
  userId: number
  email: string
  name: string
  roles: string[]
  iat?: number
  exp?: number
}

/**
 * Create a JWT token for authenticated user
 */
export function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token valid for 7 days
  })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Get token from cookies (server-side)
 */
export async function getTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('growbuttler_auth')?.value
    return token || null
  } catch (error) {
    console.error('Failed to get token from cookies:', error)
    return null
  }
}

/**
 * Get authenticated user from token (server-side)
 */
export async function getAuthenticatedUser(): Promise<TokenPayload | null> {
  const token = await getTokenFromCookies()
  if (!token) return null
  return verifyToken(token)
}

/**
 * Verify password against WordPress user using Simple JWT Login
 */
export async function verifyWordPressCredentials(
  email: string,
  password: string
): Promise<{ id: number; name: string; roles: string[] } | null> {
  try {
    const backendUrl = process.env.BACKEND_URL

    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set')
      return null
    }

    // Call Simple JWT Login endpoint instead of Basic Auth
    const response = await fetch(
      `${backendUrl}/wp-json/simple-jwt-login/v1/auth`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      console.error('WordPress authentication failed:', response.status)
      return null
    }

    const data = await response.json()

    // Simple JWT Login response format: { success: true, data: { jwt: "..." } }
    if (!data.success || !data.data?.jwt) {
      console.error('Invalid response from Simple JWT Login')
      return null
    }

    // Decode JWT to get user info (payload contains: id, email, username, etc.)
    const jwtPayload = JSON.parse(atob(data.data.jwt.split('.')[1]))

    return {
      id: parseInt(jwtPayload.id),
      name: jwtPayload.username || email,
      roles: ['subscriber'], // Default role, can be enhanced if needed
    }
  } catch (error) {
    console.error('Error verifying WordPress credentials:', error)
    return null
  }
}
