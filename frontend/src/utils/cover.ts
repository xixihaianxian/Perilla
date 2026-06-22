/** 将封面 URL 转为完整本地路径 */
export function getCoverUrl(url: string | null | undefined): string {
  if (!url) return ''
  // 已是绝对路径
  if (url.startsWith('/static/')) return url
  if (url.startsWith('http')) {
    // picsum 占位图
    const m = url.match(/random=(\d+)/)
    if (m) return `/static/covers/${m[1]}.png`
    return url
  }
  // 相对路径如 "covers/1.png" → "/static/covers/1.png"
  return `/static/${url}`
}
