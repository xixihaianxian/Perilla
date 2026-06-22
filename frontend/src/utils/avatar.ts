/** 规范化头像 URL：后端静态文件挂载在 /static 下 */
export function getAvatarUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/static/')) return path
  return `/static/${path}`
}
