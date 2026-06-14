import type { User } from '@/types'
import { generateId, randomDate, randomItem, randomAvatar, randomInt } from '../utils'

const USERNAMES = [
  '小鹿斑比', '城市旅人', '美食猎人', '摄影小明', '设计小王',
  '码农小张', '画画的小红', '旅行日记', '咖啡研究所', '穿搭达人',
  '健身教练Alex', '读书人小林', '音乐旅人', '家居生活家', '美妆博主Coco',
  '数码先锋', '花艺师Lucy', '烘焙妈妈', '街舞少年', '摄影师老刘',
  '极简主义者', '户外探险家', '手账女孩', '猫咪控', '狗狗家长',
  '瑜伽修行者', '茶艺师', '插画师Mia', '美食博主大胃王', '时尚编辑',
  '跑步爱好者', '登山达人', '潜水教练', '滑雪小白', '冲浪少女',
  '古风爱好者', '汉服小姐姐', 'Lolita少女', 'JK制服控', '潮牌玩家',
  '胶片摄影师', '独立音乐人', '吉他老师', '钢琴小公主', '说唱新人',
  '电影发烧友', '追剧达人', '二次元宅', '手办收藏家', '模型制作',
  '程序员鼓励师', '产品经理日记', 'UI设计师', '前端小课堂', '数据分析师',
]

const BIOS = [
  '热爱生活，记录美好瞬间 ✨',
  '吃吃喝喝，快乐生活 🍜',
  '用镜头记录这个世界 📷',
  '设计改变生活 🎨',
  '代码写累了就出去走走 🚶',
  '画笔下的世界更精彩 🖌️',
  '世界那么大，我想去看看 🌍',
  '一杯咖啡，一本书，一个下午 ☕',
  '今天穿什么？👗',
  '运动让生活更美好 💪',
  '阅读是心灵的旅行 📚',
  '音乐是灵魂的语言 🎵',
  '家是温暖的港湾 🏠',
  '美丽不设限 💄',
  '科技改变未来 🔮',
  '花开花落，都是风景 🌸',
  '烘焙甜蜜时光 🍰',
  '舞蹈是藏在灵魂里的语言 💃',
  '抓住每一个精彩瞬间 📸',
  '简单生活，简单快乐 🌿',
  '山不见我，我自去见山 ⛰️',
  '记录手账，记录生活 📔',
  '猫咪教我做铲屎官 🐱',
  '狗狗是人类最好的朋友 🐕',
  '瑜伽让我找到内心的平静 🧘',
  '一茶一世界 🍵',
  '用插画温暖世界 🎨',
  '唯有美食不可辜负 🍔',
  '时尚是一种态度 👠',
  '跑起来，风会拥抱你 🏃',
]

const LOCATIONS = [
  '北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '武汉',
  '南京', '西安', '长沙', '青岛', '厦门', '苏州', '昆明', '大理',
]

export function createMockUsers(): User[] {
  return USERNAMES.map((name, index) => {
    const gender = index % 3 === 0 ? 'male' as const : 'female' as const
    const now = new Date().toISOString()
    return {
      id: generateId('user'),
      username: `user_${(index + 1).toString().padStart(3, '0')}`,
      email: `user${index + 1}@perilla.com`,
      nickname: name,
      avatar: randomAvatar(index % 2 === 0 ? 'female' : 'male'),
      bio: BIOS[index % BIOS.length],
      gender,
      birthday: index % 4 === 0 ? randomDate(10000) : null!,
      location: randomItem(LOCATIONS),
      website: index % 5 === 0 ? `https://user${index + 1}.blog.com` : '',
      role: index === 0 ? 'admin' : 'user',
      status: 'active',
      follower_count: randomInt(10, 5000),
      following_count: randomInt(10, 500),
      note_count: 0, // Will be calculated after notes are generated
      is_following: false,
      created_at: randomDate(500),
      updated_at: now,
    }
  })
}

export const mockUsers: User[] = createMockUsers()
