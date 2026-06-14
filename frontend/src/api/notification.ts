import mockDB from '@/mock'
import { PAGE_SIZE } from '@/utils/constants'

export const notificationApi = {
  async getNotifications(userId: string, page = 1, pageSize = PAGE_SIZE) {
    return mockDB.getNotifications(userId, page, pageSize)
  },

  async getUnreadCount(userId: string) {
    return mockDB.getUnreadCount(userId)
  },

  async markRead(notificationId: string) {
    return mockDB.markNotificationRead(notificationId)
  },

  async markAllRead(userId: string) {
    return mockDB.markAllNotificationsRead(userId)
  },
}
