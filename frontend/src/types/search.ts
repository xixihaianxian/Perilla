import type { Note } from './note'
import type { User } from './user'
import type { Topic } from './topic'

/** Search result */
export interface SearchResult {
  notes: Note[]
  users: User[]
  topics: Topic[]
}

/** Search history item */
export interface SearchHistory {
  id: string
  user_id: string
  query: string
  created_at: string
}
