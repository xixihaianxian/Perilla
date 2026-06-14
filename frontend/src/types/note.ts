import type { ContentStatus } from './common'

/** Note media (images) */
export interface NoteMedia {
  id: string
  note_id: string
  url: string
  thumbnail_url: string
  width: number
  height: number
  sort_order: number
  created_at: string
}

/** Note */
export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  cover_image: string
  status: ContentStatus
  view_count: number
  like_count: number
  comment_count: number
  favorite_count: number
  share_count: number
  is_liked: boolean
  is_favorited: boolean
  author: import('./user').User
  media: NoteMedia[]
  tags: import('./tag').Tag[]
  topics: import('./topic').Topic[]
  created_at: string
  updated_at: string
}

/** Note create DTO */
export interface NoteCreateDTO {
  title: string
  content: string
  cover_image: string
  media: string[]
  tag_ids: string[]
  topic_ids: string[]
}

/** Note update DTO */
export interface NoteUpdateDTO {
  title?: string
  content?: string
  cover_image?: string
  media?: string[]
  tag_ids?: string[]
  topic_ids?: string[]
}
