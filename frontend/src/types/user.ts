import type { UserRole, UserStatus, Gender } from './common'

/** User profile */
export interface User {
  id: string
  username: string
  email: string
  nickname: string
  avatar: string
  bio: string
  gender: Gender
  birthday: string | null
  location: string
  website: string
  role: UserRole
  status: UserStatus
  follower_count: number
  following_count: number
  note_count: number
  is_following: boolean
  created_at: string
  updated_at: string
}

/** User settings */
export interface UserSetting {
  id: string
  user_id: string
  allow_notifications: boolean
  allow_email: boolean
  privacy_show_favorites: boolean
  privacy_show_following: boolean
  language: string
  theme: string
}

/** User profile update DTO */
export interface UserUpdateDTO {
  nickname?: string
  avatar?: string
  bio?: string
  gender?: Gender
  birthday?: string
  location?: string
  website?: string
}
