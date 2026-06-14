import mockDB from '@/mock'

export const followApi = {
  async follow(followerId: string, followingId: string) {
    return mockDB.follow(followerId, followingId)
  },

  async unfollow(followerId: string, followingId: string) {
    return mockDB.unfollow(followerId, followingId)
  },

  async checkFollow(followerId: string, followingId: string) {
    const exists = [...mockDB.follows.values()].some(
      (f) => f.follower_id === followerId && f.following_id === followingId,
    )
    return mockDB.wrap({ following: exists })
  },
}
