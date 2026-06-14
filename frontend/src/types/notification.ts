/** Notification type enum */
export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  SYSTEM = 'system',
  FAVORITE = 'favorite',
}

/** Notification */
export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  actor_id: string | null
  actor: import('./user').User | null
  target_id: string | null
  target_type: string | null
  content: string
  is_read: boolean
  created_at: string
}
