import mockDB from '@/mock'
import { PAGE_SIZE } from '@/utils/constants'

export const messageApi = {
  async getConversations(userId: string) {
    return mockDB.getConversations(userId)
  },

  async getMessages(conversationId: string, page = 1, pageSize = PAGE_SIZE) {
    return mockDB.getMessages(conversationId, page, pageSize)
  },

  async sendMessage(data: {
    conversation_id: string
    sender_id: string
    receiver_id: string
    content: string
  }) {
    return mockDB.sendMessage(data)
  },

  async markRead(conversationId: string) {
    // Mark all messages in conversation as read
    ;[...mockDB.messages.values()]
      .filter((m) => m.conversation_id === conversationId)
      .forEach((m) => (m.is_read = true))
    return mockDB.wrap(null)
  },
}
