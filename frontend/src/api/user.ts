import mockDB from '@/mock'
import instance from './index'
import type { UserUpdateDTO } from '@/types'

export const userApi = {
  async getUserInfo() {
    return instance.get('/user/info')
  },

  async getProfile(userId: string) {
    const user = mockDB.users.get(userId)
    if (!user) throw new Error('用户不存在')
    return mockDB.wrap(user)
  },

  async updateProfile(userId: string, data: UserUpdateDTO) {
    const user = mockDB.users.get(userId)
    if (!user) throw new Error('用户不存在')
    Object.assign(user, data, { updated_at: new Date().toISOString() })
    return mockDB.wrap(user)
  },

  async getUserNotes(userId: string, page = 1, pageSize = 20) {
    const notes = [...mockDB.notes.values()]
      .filter((n) => n.user_id === userId && n.status === 'published')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return mockDB.paginate(notes, page, pageSize)
  },

  async getUserFavorites(userId: string, page = 1, pageSize = 20) {
    const favs = [...mockDB.favorites.values()].filter((f) => f.user_id === userId)
    const notes = favs
      .map((f) => mockDB.notes.get(f.note_id))
      .filter(Boolean)
      .sort((a, b) => new Date(b!.created_at).getTime() - new Date(a!.created_at).getTime())
    // 取后一半作为"收藏"，与"点赞"做区分
    const start = Math.ceil(notes.length / 2)
    const collectedNotes = notes.slice(start)
    return mockDB.paginate(collectedNotes, page, pageSize)
  },

  async getUserLikes(userId: string, page = 1, pageSize = 20) {
    const favs = [...mockDB.favorites.values()].filter((f) => f.user_id === userId)
    const notes = favs
      .map((f) => mockDB.notes.get(f.note_id))
      .filter(Boolean)
      .sort((a, b) => new Date(b!.created_at).getTime() - new Date(a!.created_at).getTime())
    // 取前一半作为"点赞"，与"收藏"做区分
    const likedNotes = notes.slice(0, Math.ceil(notes.length / 2))
    return mockDB.paginate(likedNotes, page, pageSize)
  },

  async getFollowers(userId: string, page = 1, pageSize = 20) {
    const followerIds = [...mockDB.follows.values()]
      .filter((f) => f.following_id === userId)
      .map((f) => f.follower_id)
    const users = followerIds.map((id) => mockDB.users.get(id)).filter(Boolean)
    return mockDB.paginate(users, page, pageSize)
  },

  async getFollowing(userId: string, page = 1, pageSize = 20) {
    const followingIds = [...mockDB.follows.values()]
      .filter((f) => f.follower_id === userId)
      .map((f) => f.following_id)
    const users = followingIds.map((id) => mockDB.users.get(id)).filter(Boolean)
    return mockDB.paginate(users, page, pageSize)
  },
}
