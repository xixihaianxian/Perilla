<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Notification } from '@/types'
import { NotificationType } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { notificationApi } from '@/api/notification'

const router = useRouter()
const authStore = useAuthStore()
const notifications = ref<Notification[]>([])
const loading = ref(false)

const typeConfig: Record<string, { icon: string; color: string }> = {
  [NotificationType.LIKE]: { icon: 'StarFilled', color: '#F43F5E' },
  [NotificationType.COMMENT]: { icon: 'ChatDotRound', color: '#3B82F6' },
  [NotificationType.FOLLOW]: { icon: 'UserFilled', color: '#22C55E' },
  [NotificationType.FAVORITE]: { icon: 'Collection', color: '#8B5CF6' },
  [NotificationType.SYSTEM]: { icon: 'Bell', color: '#A1A1AA' },
}

async function fetchNotifications() {
  if (!authStore.user) return
  loading.value = true
  try { const res = await notificationApi.getNotifications(authStore.user.id); notifications.value = res.data.items } finally { loading.value = false }
}

function handleClick(notif: Notification) {
  notificationApi.markRead(notif.id); notif.is_read = true
  if ([NotificationType.LIKE, NotificationType.COMMENT, NotificationType.FAVORITE].includes(notif.type) && notif.target_id) router.push(`/note/${notif.target_id}`)
  else if (notif.type === NotificationType.FOLLOW && notif.actor_id) router.push(`/user/${notif.actor_id}`)
}

function handleMarkAllRead() {
  if (!authStore.user) return
  notificationApi.markAllRead(authStore.user.id)
  notifications.value.forEach((n) => (n.is_read = true))
}

function groupByDate(items: Notification[]): Record<string, Notification[]> {
  const groups: Record<string, Notification[]> = {}
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)
  items.forEach((item) => {
    const d = new Date(item.created_at)
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    let key: string
    if (day.getTime() === today.getTime()) key = '今天'
    else if (day.getTime() === yesterday.getTime()) key = '昨天'
    else if (day.getTime() > today.getTime() - 7 * 86400000) key = '本周'
    else key = '更早'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })
  return groups
}

onMounted(() => fetchNotifications())
</script>

<template>
  <div class="page-container max-w-2xl">
    <div class="flex items-center justify-between py-4">
      <h1 class="text-2xl font-bold text-text-primary">通知</h1>
      <button class="text-sm text-text-secondary hover:text-primary transition-colors" @click="handleMarkAllRead">全部已读</button>
    </div>
    <div class="bg-surface rounded-xl shadow-sm border border-border-card divide-y divide-border-card">
      <template v-for="(items, group) in groupByDate(notifications)" :key="group">
        <div class="px-4 py-2 bg-gray-50 text-xs text-text-card-tertiary font-medium">{{ group }}</div>
        <div v-for="notif in items" :key="notif.id" class="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors" :class="{ 'bg-primary-light/10': !notif.is_read }" @click="handleClick(notif)">
          <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5" :style="{ backgroundColor: (typeConfig[notif.type]?.color || '#999') + '20' }">
            <el-icon :size="18" :color="typeConfig[notif.type]?.color || '#999'"><component :is="typeConfig[notif.type]?.icon || 'Bell'" /></el-icon>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start gap-2">
              <img v-if="notif.actor" :src="notif.actor.avatar" class="w-5 h-5 rounded-full shrink-0 mt-0.5" />
              <div>
                <p class="text-sm text-text-card-primary"><span v-if="notif.actor" class="font-medium">{{ notif.actor.nickname }}</span> {{ notif.content }}</p>
                <p class="text-xs text-text-card-tertiary mt-0.5">{{ new Date(notif.created_at).toLocaleString('zh-CN') }}</p>
              </div>
            </div>
          </div>
          <div v-if="!notif.is_read" class="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
        </div>
      </template>
      <div v-if="notifications.length === 0 && !loading" class="p-16 text-center text-text-tertiary">暂无通知</div>
    </div>
  </div>
</template>
