import type { Tag } from '@/types'
import { generateId, randomInt } from '../utils'

const TAG_NAMES = [
  '穿搭', 'OOTD', '每日穿搭', 'ootd', '街拍', '时尚',
  '美食', '早餐', '午餐', '晚餐', '甜品', '烘焙', '家常菜', '探店',
  '旅行', '自驾游', '周末去哪', '旅行摄影', '背包客', '民宿',
  '摄影', '手机摄影', '人像摄影', '风景摄影', '胶片', '后期',
  '家居', '收纳', '装修日记', '软装', '小户型', '北欧风',
  '美妆', '护肤', '口红', '眼影', '面膜', '平价好物',
  '健身', '减脂', '增肌', '瑜伽', '跑步', '撸铁',
  '读书', '书单', '阅读笔记', '文学', '小说', '书摘',
  '音乐', '歌单', '独立音乐', '摇滚', '民谣', '流行',
  '宠物', '猫咪', '狗狗', '喵星人', '汪星人', '领养',
  '数码', '苹果', '手机评测', '耳机', '智能家居', '开箱',
  '插画', '水彩', '速写', '数位板', 'procreate', '手绘',
  '咖啡', '手冲', '拿铁', '咖啡拉花', '咖啡馆', '意式',
  '户外', '露营', '登山', '徒步', '骑行', '滑雪',
  '电影', '影评', '院线', '纪录片', '小众电影', '豆瓣',
]

export function createMockTags(): Tag[] {
  const now = new Date().toISOString()
  return TAG_NAMES.map((name) => ({
    id: generateId('tag'),
    name,
    note_count: randomInt(5, 2000),
    created_at: now,
  }))
}

export const mockTags: Tag[] = createMockTags()
