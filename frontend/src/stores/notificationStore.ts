import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification } from '@/types'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)

  async function fetchNotifications() {
    // Will be implemented in Phase 10
  }

  async function fetchUnreadCount() {
    // Will be implemented in Phase 10
  }

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
  }
})
