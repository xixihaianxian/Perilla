import mockDB from '@/mock'

export const favoriteApi = {
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
