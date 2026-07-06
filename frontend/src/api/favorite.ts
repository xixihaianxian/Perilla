import mockDB from '@/mock'
import instance from './index'

export const favoriteApi = {
  // 收藏 / 取消收藏（后端用唯一约束自动切换）
  // 响应 { code:200, message:"favorite"|"cancel", ... }，message 即为新状态
  // 后端 topic_id 为 query 参数（非 body），故用 params 传递
  async proactiveCollection(topicId: number) {
    return instance.post('/favorite/proactive/collection', null, { params: { topic_id: topicId } })
  },

  async toggleFavorite(userId: string, noteId: string, folderId?: string) {
    return mockDB.toggleFavorite(userId, noteId, folderId)
  },

  async getFolders(userId: string) {
    return mockDB.getFolders(userId)
  },

  async createFolder(userId: string, name: string) {
    return mockDB.createFolder(userId, name)
  },

  async getFavorites(userId: string, page = 1, pageSize = 20) {
    const favs = [...mockDB.favorites.values()].filter((f) => f.user_id === userId)
    const notes = favs
      .map((f) => mockDB.notes.get(f.note_id))
      .filter(Boolean)
      .sort((a, b) => new Date(b!.created_at).getTime() - new Date(a!.created_at).getTime())
    return mockDB.paginate(notes, page, pageSize)
  },
}
