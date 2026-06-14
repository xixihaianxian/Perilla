import type { Comment } from '@/types'
import { generateId, randomDate, randomItem, randomInt } from '../utils'
import { mockUsers } from './users'
import { mockNotes } from './notes'

const COMMENT_TEXTS = [
  '太棒了！收藏了！',
  '好喜欢这个风格 😍',
  '学到了，感谢分享！',
  '同款get！',
  '拍得好好看！',
  '这个色调太绝了',
  '第一次知道，涨知识了',
  '求链接！',
  '好想去！',
  '做得真好，手残党羡慕',
  '太美了吧！',
  '请问在哪里买的？',
  '学习了，准备试试看',
  '好治愈啊~',
  '这个真的绝了！',
  '漂亮！点赞',
  '太有感觉了',
  '已收藏，留着慢慢看',
  '好详细，谢谢分享',
  '这也太好看了吧',
  '绝绝子！',
  '想去打卡！',
  '好厉害！！',
  '太治愈了～',
  '审美在线！',
  '这是什么神仙地方',
  '太会拍了吧',
  '同款推荐！',
  '我的天呐这也太好看了',
  '每次看都像第一次见',
]

const REPLY_TEXTS = [
  '谢谢喜欢！💕',
  '链接私信发你哦~',
  '某宝搜同名店铺就有',
  '哈哈是的呢',
  '感谢支持！',
  '一起加油！',
  '可以试试看~',
  '对呀对呀！',
  '推荐你也去看看',
  '好滴！',
]

export function createMockComments(): Comment[] {
  const comments: Comment[] = []

  mockNotes.forEach((note) => {
    const commentCount = randomInt(0, 8)

    for (let i = 0; i < commentCount; i++) {
      const user = randomItem(mockUsers)
      const topComment: Comment = {
        id: generateId('comment'),
        note_id: note.id,
        user_id: user.id,
        parent_id: null,
        content: randomItem(COMMENT_TEXTS),
        like_count: randomInt(0, 100),
        is_liked: false,
        user,
        replies: [],
        reply_count: 0,
        created_at: randomDate(180),
      }

      // Add some replies
      const replyCount = randomInt(0, 3)
      for (let j = 0; j < replyCount; j++) {
        const replyUser = randomItem(mockUsers)
        const reply: Comment = {
          id: generateId('comment'),
          note_id: note.id,
          user_id: replyUser.id,
          parent_id: topComment.id,
          content: j === 0 && randomItem([true, false]) ? randomItem(REPLY_TEXTS) : randomItem(COMMENT_TEXTS),
          like_count: randomInt(0, 20),
          is_liked: false,
          user: replyUser,
          replies: [],
          reply_count: 0,
          created_at: randomDate(90),
        }
        topComment.replies.push(reply)
        topComment.reply_count++
        comments.push(reply)
      }

      comments.push(topComment)
    }
  })

  // Update note comment counts
  mockNotes.forEach((note) => {
    note.comment_count = comments.filter((c) => c.note_id === note.id).length
  })

  return comments
}

export const mockComments: Comment[] = createMockComments()
