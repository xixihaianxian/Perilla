/** Generic pagination parameters */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** Sort order */
export type SortOrder = 'asc' | 'desc'

/** Sort options */
export interface SortOptions {
  field: string
  order: SortOrder
}

/** Feed type */
export type FeedType = 'recommended' | 'hot' | 'following'

/** User role */
export type UserRole = 'user' | 'admin'

/** User status */
export type UserStatus = 'active' | 'banned'

/** Content status */
export type ContentStatus = 'published' | 'draft' | 'reviewing' | 'rejected'

/** Gender */
export type Gender = 'male' | 'female' | 'other'
