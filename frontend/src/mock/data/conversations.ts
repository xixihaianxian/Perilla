import type { Conversation, Message } from '@/types'
import { generateId, randomDate, randomItem, randomInt } from '../utils'
import { mockUsers } from './users'

const MESSAGE_TEXTS = [
  '你好呀！',
  '你的笔记拍得太好了！用的什么相机呀？',
  '谢谢喜欢！用的是索尼A7M4',
  '哇，我也想去试试',
  '可以加个好友吗？',
  '当然可以！',
  '今天天气真好',
  '是呀，适合出去玩',
  '周末有空吗？一起去拍照？',
  '好呀好呀！去哪？',
  '最近怎么样？',
  '挺好的，工作有点忙',
  '推荐你一家超棒的餐厅',
  '在哪里？叫什么名字？',
  '在三里屯那边，叫"深夜食堂"',
  '收到！改天去试试',
  '你的穿搭每天都好好看',
  '哈哈谢谢你！',
  '互相关注一下吧',
  '好啊，已经关注你啦',
  '在吗？',
  '在的，什么事？',
  '想请教一下摄影技巧',
  '没问题！你想了解什么？',
  '你的猫好可爱啊',
  '谢谢！它叫团子',
  '多大了呀？',
  '两岁了，特别黏人',
  '发几张新照片看看？',
  '好的，稍等！',
  '你住在哪个城市呀？',
  '我在上海，你呢？',
  '我在北京',
  '下次来北京可以一起玩',
  '没问题！来上海也找我',
  '晚安！明天聊',
  '晚安~好梦',
  '早安！新的一天开始了',
  '早呀！今天也要元气满满',
]

export function createMockConversations(): { conversations: Conversation[]; messages: Message[] } {
  const conversations: Conversation[] = []
  const allMessages: Message[] = []
  const currentUser = mockUsers[0] // User 0 is the "me" user

  // Create conversations between user 0 and other users
  for (let i = 1; i <= 25; i++) {
    const otherUser = mockUsers[i % mockUsers.length]
    const conversationId = generateId('conv')
    const msgCount = randomInt(5, 30)

    const msgList: Message[] = []
    for (let j = 0; j < msgCount; j++) {
      const isFromMe = j % 2 === randomInt(0, 1)
      const msg: Message = {
        id: generateId('msg'),
        conversation_id: conversationId,
        sender_id: isFromMe ? currentUser.id : otherUser.id,
        receiver_id: isFromMe ? otherUser.id : currentUser.id,
        content: MESSAGE_TEXTS[j % MESSAGE_TEXTS.length],
        image_url: j % 15 === 0 ? `https://picsum.photos/seed/msg${i}${j}/400/400` : null,
        is_read: j < msgCount - randomInt(1, 3),
        created_at: randomDate(30),
      }
      msgList.push(msg)
      allMessages.push(msg)
    }

    // Sort by date
    msgList.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    const lastMsg = msgList[msgList.length - 1]
    const unreadCount = msgList.filter((m) => m.receiver_id === currentUser.id && !m.is_read).length

    conversations.push({
      id: conversationId,
      participants: [currentUser, otherUser],
      last_message: lastMsg,
      unread_count: unreadCount,
      created_at: msgList[0].created_at,
      updated_at: lastMsg.created_at,
    })
  }

  // Sort by last message time desc
  conversations.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )

  return { conversations, messages: allMessages }
}

export const { conversations: mockConversations, messages: mockMessages } =
  createMockConversations()
