import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'growbuttler_super_secret_jwt_key_2026_change_in_prod'
)

export interface TokenPayload {
  userId: number
  email: string
  name: string
  firstName?: string
  lastName?: string
  roles: string[]
  iat?: number
  exp?: number
}

/**
 * Create a JWT token for authenticated user
 */
export async function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] })
    // Map payload to our expected shape
    const decoded = payload as unknown as TokenPayload
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
): Promise<{ id: number; name: string; firstName?: string; lastName?: string; roles: string[] } | null> {
  try {
    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set')
      return null
    }

    const response = await fetch(
      `${backendUrl}/wp-json/simple-jwt-login/v1/auth`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      console.error('WordPress authentication failed:', response.status)
      return null
    }

    const data = await response.json()
    if (!data.success || !data.data?.jwt) {
      console.error('Invalid response from Simple JWT Login')
      return null
    }

    const jwtPayload = JSON.parse(atob(data.data.jwt.split('.')[1]))
    const userId = parseInt(jwtPayload.id)

    let firstName: string | undefined
    let lastName: string | undefined

    try {
      const userResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        firstName = userData.first_name || undefined
        lastName = userData.last_name || undefined
      }
    } catch (err) {
      console.error('Failed to fetch user details:', err)
    }

    return {
      id: userId,
      name: jwtPayload.username || email,
      firstName,
      lastName,
      roles: ['subscriber'],
    }
  } catch (error) {
    console.error('Error verifying WordPress credentials:', error)
    return null
  }
}
