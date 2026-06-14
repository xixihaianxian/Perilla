/**
 * Format relative time (Chinese)
 */
export function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 1) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days === 1) return '昨天'
  if (days < 3) return `${days}天前`
  if (days < 30) return `${days}天前`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}个月前`

  const years = Math.floor(days / 365)
  return `${years}年前`
}

/**
 * Format count (e.g., 1.2k, 10万+)
 */
export function formatCount(count: number): string {
  if (count >= 10000000) return `${(count / 10000000).toFixed(1)}千万`
  if (count >= 100000) return `${(count / 10000).toFixed(1)}万`
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}

/**
 * Format date to locale string
 */
export function formatDate(dateStr: string, format = 'zh-CN'): string {
  return new Date(dateStr).toLocaleDateString(format, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Format date with time
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
