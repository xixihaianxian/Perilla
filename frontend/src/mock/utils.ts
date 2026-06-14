/**
 * Random generation utilities for mock data
 */

let idCounter = 0
export function generateId(prefix = ''): string {
  idCounter++
  return `${prefix}${prefix ? '_' : ''}${Date.now().toString(36)}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

export function randomDate(daysAgo = 365): string {
  const d = new Date()
  d.setDate(d.getDate() - randomInt(0, daysAgo))
  d.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59))
  return d.toISOString()
}

export function randomItem<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)]
}

export function randomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = randomInt(min, max)
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function randomAvatar(gender?: 'male' | 'female'): string {
  const seed = randomInt(1, 99)
  if (gender === 'male') {
    return `https://randomuser.me/api/portraits/men/${seed}.jpg`
  }
  if (gender === 'female') {
    return `https://randomuser.me/api/portraits/women/${seed}.jpg`
  }
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}

export function randomImage(width = 640, height?: number): string {
  const h = height || randomItem([480, 640, 800, 960])
  const seed = randomInt(1, 1000)
  return `https://picsum.photos/seed/${seed}/${width}/${h}`
}

export function randomCoverImage(): string {
  const w = 640
  const ratios = [3 / 4, 1, 4 / 3, 2 / 3]
  const ratio = randomItem(ratios)
  const h = Math.round(w / ratio)
  return randomImage(w, h)
}

export function randomImages(count: number): string[] {
  return Array.from({ length: count }, () => randomImage(640, randomItem([480, 640, 800, 960])))
}

export function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability
}

export function randomSubset<T>(arr: T[], minCount: number, maxCount: number): T[] {
  const count = Math.min(randomInt(minCount, maxCount), arr.length)
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count)
}

/** Simulate network delay (200-800ms) */
export function simulateDelay(): Promise<void> {
  const ms = randomInt(200, 800)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Simulate occasional error (5% chance) */
export function simulateError(): void {
  if (Math.random() < 0.05) {
    throw new Error('网络请求失败，请稍后重试')
  }
}
