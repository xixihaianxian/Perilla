/** Favorite folder */
export interface FavoriteFolder {
  id: string
  user_id: string
  name: string
  description: string
  cover_image: string
  note_count: number
  is_public: boolean
  created_at: string
}

/** Favorite item */
export interface Favorite {
  id: string
  user_id: string
  note_id: string
  folder_id: string | null
  note?: import('./note').Note
  created_at: string
}
