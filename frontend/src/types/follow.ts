/** Follow relationship */
export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

/** Follow statistics */
export interface FollowStat {
  follower_count: number
  following_count: number
  is_following: boolean
  is_followed: boolean
}
