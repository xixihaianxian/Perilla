import type { Topic } from '@/types'
import { generateId, randomDate, randomInt } from '../utils'

const TOPICS = [
  { name: '时尚穿搭', icon: 'yifu',                description: '分享每日穿搭灵感与时尚趋势', cover: 'fashion1' },
  { name: '美食探店', icon: 'meishi',               description: '发现城市中的美味餐厅与料理', cover: 'food1' },
  { name: '旅行攻略', icon: 'lvhang',               description: '探索世界各地的旅行目的地', cover: 'travel1' },
  { name: '摄影技巧', icon: 'sheying',              description: '学习摄影构图与后期处理', cover: 'nature1' },
  { name: '家居装修', icon: 'jiaju',                description: '打造理想中的居家空间', cover: 'life1' },
  { name: '美妆护肤', icon: 'meizhuang-meizhuangdan', description: '分享美妆心得与护肤技巧', cover: 'fashion2' },
  { name: '健身塑形', icon: 'jianshen',             description: '科学健身与健康饮食指南', cover: 'life2' },
  { name: '读书分享', icon: 'tubiaozhizuomoban-',  description: '好书推荐与深度阅读笔记', cover: 'art1' },
  { name: '音乐推荐', icon: 'yinle',                description: '分享你喜欢的音乐与歌单', cover: 'art2' },
  { name: '宠物日常', icon: 'a-Group46',           description: '记录毛孩子的可爱时光', cover: 'pet1' },
  { name: '数码科技', icon: 'jiqiren',              description: '数码产品评测与科技资讯', cover: 'life3' },
  { name: '手绘插画', icon: 'huihualaoshi-01',     description: '用画笔描绘美好世界', cover: 'art3' },
  { name: '咖啡文化', icon: 'kafei',                description: '探索咖啡的世界，从豆子到杯子', cover: 'food2' },
  { name: '户外运动', icon: 'huwaihuodong',         description: '登山露营徒步骑行全攻略', cover: 'nature2' },
  { name: '电影评论', icon: 'dianying',             description: '深度影评与观影推荐', cover: 'art4' },
  { name: '手工制作', icon: 'shougong',             description: 'DIY手工与创意制作', cover: 'life4' },
  { name: '植物园艺', icon: 'huadian-daxingzhiwu',  description: '绿植养护与花园设计', cover: 'nature3' },
  { name: '母婴育儿', icon: 'muying',               description: '育儿经验与亲子活动分享', cover: 'life5' },
  { name: '汽车生活', icon: 'qiche',                description: '汽车评测与自驾旅行', cover: 'travel2' },
  { name: '极简生活', icon: 'xingxing',             description: '断舍离与简约生活哲学', cover: 'life6' },
]

export function createMockTopics(): Topic[] {
  const now = new Date().toISOString()
  return TOPICS.map((t, index) => ({
    id: generateId('topic'),
    name: t.name,
    icon: t.icon,
    description: t.description,
    cover_image: `https://picsum.photos/seed/${t.cover}/640/480`,
    note_count: randomInt(50, 5000),
    follower_count: randomInt(100, 10000),
    is_following: index < 3,
    created_at: randomDate(400),
    updated_at: now,
  }))
}

export const mockTopics: Topic[] = createMockTopics()
