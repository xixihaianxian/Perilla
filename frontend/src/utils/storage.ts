/**
 * localStorage wrapper with JSON serialization
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const value = localStorage.getItem(key)
    if (value === null) return defaultValue
    return JSON.parse(value) as T
  } catch {
    return defaultValue
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Storage unavailable
  }
}
