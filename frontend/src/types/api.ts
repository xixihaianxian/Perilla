/** Standard API response wrapper */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** Paginated response */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/** API error */
export interface ApiError {
  code: number
  message: string
  details?: Record<string, string[]>
}
