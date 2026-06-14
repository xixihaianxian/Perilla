import type { UserRole, UserStatus, ContentStatus } from './common'

/** Admin user */
export interface AdminUser {
  id: string
  username: string
  email: string
  role: UserRole
  status: UserStatus
  last_login: string
  created_at: string
}

/** Admin log */
export interface AdminLog {
  id: string
  admin_id: string
  admin_name: string
  action: string
  target_type: string
  target_id: string
  detail: string
  created_at: string
}

/** User behavior record */
export interface UserBehavior {
  id: string
  user_id: string
  action: string
  target_type: string
  target_id: string
  metadata: Record<string, string>
  created_at: string
}

/** Dashboard statistics */
export interface DashboardStats {
  total_users: number
  total_notes: number
  total_comments: number
  new_users_today: number
  new_notes_today: number
  pending_reviews: number
  active_reports: number
  daily_stats: DailyStat[]
  category_distribution: CategoryDistribution[]
}

/** Daily statistic */
export interface DailyStat {
  date: string
  new_users: number
  new_notes: number
  active_users: number
}

/** Category distribution */
export interface CategoryDistribution {
  name: string
  count: number
  percentage: number
}

/** Review action */
export interface ReviewAction {
  target_id: string
  action: 'approve' | 'reject'
  reason?: string
}
