import { getLocalStorage, setLocalStorage, removeLocalStorage } from './storage'

const TOKEN_KEY = 'perilla_token'
const REFRESH_TOKEN_KEY = 'perilla_refresh_token'

export function getToken(): string | null {
  return getLocalStorage<string | null>(TOKEN_KEY, null)
}

export function setToken(token: string): void {
  setLocalStorage(TOKEN_KEY, token)
}

export function removeToken(): void {
  removeLocalStorage(TOKEN_KEY)
  removeLocalStorage(REFRESH_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return getLocalStorage<string | null>(REFRESH_TOKEN_KEY, null)
}

export function setRefreshToken(token: string): void {
  setLocalStorage(REFRESH_TOKEN_KEY, token)
}

/**
 * Decode JWT payload (without verification)
 */
export function parseToken(token: string): { sub: string; exp: number; role: string } | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseToken(token)
  if (!payload) return true
  return payload.exp * 1000 < Date.now()
}
