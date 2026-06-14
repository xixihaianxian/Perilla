import type { Notification } from '@/types'
import { NotificationType } from '@/types'
import { generateId, randomDate, randomItem, randomInt } from '../utils'
import { mockUsers } from './users'

export function createMockNotifications(): Notification[] {
  const notifications: Notification[] = []
  const types = Object.values(NotificationType)

  for (let i = 0; i < 150; i++) {
    const type = randomItem(types)
    const actor = randomItem(mockUsers)
    const userIndex = randomInt(0, 4) // Target user is one of first 5 users
    const targetUser = mockUsers[userIndex]

    let content = ''
    let targetId: string | null = null
    let targetType: string | null = null

    switch (type) {
      case NotificationType.LIKE:
        content = `赞了你的笔记`
        targetId = generateId('note')
        targetType = 'note'
        break
      case NotificationType.COMMENT:
        content = `评论了你的笔记："${randomItem(['好看！', '学到了', '太棒了', '想去打卡', '已收藏'])}"`
        targetId = generateId('note')
        targetType = 'note'
        break
      case NotificationType.FOLLOW:
        content = '关注了你'
        targetId = actor.id
        targetType = 'user'
        break
      case NotificationType.FAVORITE:
        content = '收藏了你的笔记'
        targetId = generateId('note')
        targetType = 'note'
        break
      case NotificationType.SYSTEM:
        content = randomItem([
          '欢迎加入Perilla！完善你的个人资料吧',
          '你的笔记被推荐到热门页',
          '社区规范更新，请查看最新规范',
          'Perilla新功能上线：支持话题标签',
        ])
        targetId = null
        targetType = null
        break
    }

    notifications.push({
      id: generateId('notif'),
      user_id: targetUser.id,
      type,
      actor_id: type !== NotificationType.SYSTEM ? actor.id : null,
      actor: type !== NotificationType.SYSTEM ? actor : null,
      target_id: targetId,
      target_type: targetType,
      content,
      is_read: i > 20, // First 20 unread
      created_at: randomDate(30),
    })
  }

  // Sort by date descending
  notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return notifications
}

export const mockNotifications: Notification[] = createMockNotifications()
