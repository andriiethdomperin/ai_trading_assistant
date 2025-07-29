import { NextResponse } from 'next/server'

// CSRF token storage
const csrfTokens = new Map<string, { token: string; expires: number }>()

// Token expiration time (15 minutes)
const TOKEN_EXPIRATION = 15 * 60 * 1000

// Generate a random token using Web Crypto API
async function generateRandomToken(): Promise<string> {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function generateCSRFToken(): Promise<string> {
  const token = await generateRandomToken()
  const expires = Date.now() + TOKEN_EXPIRATION
  
  // Store token with expiration
  csrfTokens.set(token, { token, expires })
  
  // Clean up expired tokens
  cleanupExpiredTokens()
  
  return token
}

export function validateCSRFToken(token: string): boolean {
  const tokenData = csrfTokens.get(token)
  
  if (!tokenData) {
    return false
  }
  
  // Check if token is expired
  if (Date.now() > tokenData.expires) {
    csrfTokens.delete(token)
    return false
  }
  
  // Remove token after use (one-time use)
  csrfTokens.delete(token)
  return true
}

function cleanupExpiredTokens() {
  const now = Date.now()
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(token)
    }
  }
}

// Middleware helper to add CSRF token to response
export async function addCSRFTokenToResponse(response: NextResponse): Promise<NextResponse> {
  const token = await generateCSRFToken()
  response.headers.set('X-CSRF-Token', token)
  return response
}

// Middleware helper to validate CSRF token from request
export function validateCSRFTokenFromRequest(request: Request): boolean {
  const token = request.headers.get('X-CSRF-Token')
  if (!token) {
    return false
  }
  return validateCSRFToken(token)
} 