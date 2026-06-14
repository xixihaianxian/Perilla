/** Conversation */
export interface Conversation {
  id: string
  participants: import('./user').User[]
  last_message: Message | null
  unread_count: number
  created_at: string
  updated_at: string
}

/** Message */
export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  receiver_id: string
  content: string
  image_url: string | null
  is_read: boolean
  created_at: string
}

/** Message send DTO */
export interface MessageSendDTO {
  conversation_id?: string
  receiver_id: string
  content: string
  image_url?: string
}
