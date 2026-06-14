/** Report status enum */
export enum ReportStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

/** Report type */
export type ReportType = 'note' | 'comment' | 'user'

/** Report */
export interface Report {
  id: string
  reporter_id: string
  reporter: import('./user').User
  target_type: ReportType
  target_id: string
  reason: string
  description: string
  status: ReportStatus
  handler_id: string | null
  handler_note: string
  created_at: string
  updated_at: string
}
