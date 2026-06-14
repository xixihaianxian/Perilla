import mockDB from '@/mock'
import { PAGE_SIZE } from '@/utils/constants'

export const noteApi = {
  async getFeed(params: {
    type: 'recommended' | 'hot' | 'following'
    page?: number
    pageSize?: number
    userId?: string
    tagName?: string
  }) {
    return mockDB.getFeed(
      params.type,
      params.userId || null,
      params.page || 1,
      params.pageSize || PAGE_SIZE,
      params.tagName,
    )
  },

  async getNoteDetail(noteId: string, userId?: string) {
    return mockDB.getNoteDetail(noteId, userId)
  },

  async createNote(data: {
    user_id: string
    title: string
    content: string
    cover_image: string
    media: string[]
    tag_ids: string[]
    topic_ids: string[]
  }) {
    return mockDB.createNote(data)
  },

  async updateNote(noteId: string, data: Record<string, unknown>) {
    return mockDB.updateNote(noteId, data)
  },

  async deleteNote(noteId: string) {
    return mockDB.deleteNote(noteId)
  },

  async getUserNotes(userId: string, page = 1, pageSize = PAGE_SIZE) {
    const notes = [...mockDB.notes.values()]
      .filter((n) => n.user_id === userId && n.status === 'published')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return mockDB.paginate(notes, page, pageSize)
  },
}
