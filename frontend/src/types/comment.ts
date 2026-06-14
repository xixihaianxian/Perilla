/** Comment */
export interface Comment {
  id: string
  note_id: string
  user_id: string
  parent_id: string | null
  content: string
  like_count: number
  is_liked: boolean
  user: import('./user').User
  replies: Comment[]
  reply_count: number
  created_at: string
}

/** Comment create DTO */
export interface CommentCreateDTO {
  note_id: string
  parent_id?: string
  content: string
}
