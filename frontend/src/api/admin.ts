import mockDB from '@/mock'
import { PAGE_SIZE } from '@/utils/constants'

export const adminApi = {
  async getDashboardStats() {
    return mockDB.getDashboardStats()
  },

  async getUsers(page = 1, pageSize = PAGE_SIZE) {
    return mockDB.getUsersForAdmin(page, pageSize)
  },

  async updateUserStatus(userId: string, status: string) {
    const user = mockDB.users.get(userId)
    if (user) {
      (user as Record<string, unknown>).status = status
    }
    return mockDB.wrap(user)
  },

  async deleteUser(userId: string) {
    mockDB.users.delete(userId)
    return mockDB.wrap(null)
  },

  async getNotes(page = 1, pageSize = PAGE_SIZE) {
    return mockDB.getNotesForAdmin(page, pageSize)
  },

  async updateNoteStatus(noteId: string, status: string) {
    const note = mockDB.notes.get(noteId)
    if (note) {
      note.status = status as 'published' | 'draft' | 'reviewing' | 'rejected'
    }
    return mockDB.wrap(note)
  },

  async deleteNote(noteId: string) {
    mockDB.notes.delete(noteId)
    return mockDB.wrap(null)
  },

  async getComments(page = 1, pageSize = PAGE_SIZE) {
    return mockDB.paginate([...mockDB.comments.values()], page, pageSize)
  },

  async deleteComment(commentId: string) {
    mockDB.comments.delete(commentId)
    return mockDB.wrap(null)
  },

  async getReports(page = 1, pageSize = PAGE_SIZE) {
    return mockDB.getReportsForAdmin(page, pageSize)
  },

  async handleReport(reportId: string, action: 'resolved' | 'dismissed', handlerNote: string) {
    const report = mockDB.reports.get(reportId)
    if (report) {
      report.status = action === 'resolved' ? 'resolved' : 'dismissed'
      report.handler_note = handlerNote
      report.updated_at = new Date().toISOString()
    }
    return mockDB.wrap(report)
  },

  async getTopics() {
    return mockDB.wrap([...mockDB.topics.values()])
  },

  async createTopic(data: { name: string; icon: string; description: string }) {
    const now = new Date().toISOString()
    const topic = {
      id: `topic_${Date.now()}`,
      ...data,
      cover_image: '',
      note_count: 0,
      follower_count: 0,
      is_following: false,
      created_at: now,
      updated_at: now,
    }
    mockDB.topics.set(topic.id, topic)
    return mockDB.wrap(topic)
  },

  async getTags() {
    return mockDB.wrap([...mockDB.tags.values()])
  },

  async createTag(data: { name: string }) {
    const now = new Date().toISOString()
    const tag = {
      id: `tag_${Date.now()}`,
      name: data.name,
      note_count: 0,
      created_at: now,
    }
    mockDB.tags.set(tag.id, tag)
    return mockDB.wrap(tag)
  },
}
