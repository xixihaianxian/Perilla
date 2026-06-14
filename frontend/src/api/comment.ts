import mockDB from '@/mock'
import { PAGE_SIZE } from '@/utils/constants'

export const commentApi = {
  async getComments(noteId: string, page = 1, pageSize = PAGE_SIZE) {
    return mockDB.getComments(noteId, page, pageSize)
  },

  async createComment(data: {
    note_id: string
    user_id: string
    parent_id?: string
    content: string
  }) {
    return mockDB.createComment(data)
  },

  async deleteComment(commentId: string) {
    return mockDB.deleteComment(commentId)
  },
}
