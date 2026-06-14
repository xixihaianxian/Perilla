/** Page size for paginated lists */
export const PAGE_SIZE = 20

/** Storage keys */
export const TOKEN_KEY = 'perilla_token'
export const REFRESH_TOKEN_KEY = 'perilla_refresh_token'

/** Notification types */
export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  like: '赞了你的笔记',
  comment: '评论了你的笔记',
  follow: '关注了你',
  system: '系统通知',
  favorite: '收藏了你的笔记',
}

/** Report types */
export const REPORT_TYPE_LABELS: Record<string, string> = {
  note: '笔记',
  comment: '评论',
  user: '用户',
}

/** Content status labels */
export const CONTENT_STATUS_LABELS: Record<string, string> = {
  published: '已发布',
  draft: '草稿',
  reviewing: '审核中',
  rejected: '已驳回',
}

/** Breakpoints (matching Tailwind) */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

/** Max upload images per note */
export const MAX_UPLOAD_IMAGES = 9

/** Polling intervals (ms) */
export const POLL_INTERVAL = {
  messages: 5000,
  notifications: 10000,
  unreadCount: 15000,
} as const
