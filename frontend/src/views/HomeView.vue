<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Note } from '@/types'
import type { FeedType } from '@/types/common'
import { tagApi, type Category } from '@/api/tag'
import { topicApi, type TopicItem } from '@/api/topic'
import { favoriteApi } from '@/api/favorite'
import { useAuthStore } from '@/stores/authStore'
import NoteWaterfall from '@/components/content/NoteWaterfall.vue'
import TopicDetailDialog, { type TopicDialogData } from '@/components/content/TopicDetailDialog.vue'
import { getCoverUrl } from '@/utils/cover'
import { getAvatarUrl } from '@/utils/avatar'

const activeTab = ref<FeedType>('recommended')
const activeCatId = ref(0) // 0 = "全部"
const showAllTags = ref(false)
const MAX_VISIBLE = 10
// Sentinel category IDs for UI markers
const CAT_ALL = 0
const CAT_MORE = -1
const CAT_COLLAPSE = -2
const CATEGORY_ALL: Category = { id: CAT_ALL, name: '全部' }
const CATEGORY_MORE: Category = { id: CAT_MORE, name: '更多' }
const CATEGORY_COLLAPSE: Category = { id: CAT_COLLAPSE, name: '' }
const tabs = [
  { key: 'recommended' as FeedType, label: '推荐' },
  { key: 'hot' as FeedType, label: '热门' },
  { key: 'following' as FeedType, label: '关注' },
]

// Dynamic tags from backend API
const tags = ref<Category[]>([])
const tagsLoading = ref(false)

/** 折叠态: "全部" + 前9个 + "更多"; 展开态: 全部 + 收起图标 */
const visibleCategories = computed<Category[]>(() => {
  const all = tags.value
  if (all.length <= MAX_VISIBLE) {
    return [CATEGORY_ALL, ...all]
  }
  if (showAllTags.value) {
    return [CATEGORY_ALL, ...all, CATEGORY_COLLAPSE]
  }
  return [CATEGORY_ALL, ...all.slice(0, MAX_VISIBLE - 1), CATEGORY_MORE]
})

// Topic feed state（替代原来的 note feed）
const topics = ref<Note[]>([])
const topicPage = ref(1)
const topicHasMore = ref(true)
const topicLoading = ref(false)

// 当前用户已收藏的话题 id 集合（用于点亮卡片收藏按钮）
const authStore = useAuthStore()
const collectedIds = ref<Set<string>>(new Set())

async function fetchCollectedIds() {
  try {
    const ids = await favoriteApi.getCollectedTopicIds()
    collectedIds.value = new Set(ids.map(String))
  } catch {
    /* 静默：接口异常时不影响列表展示 */
  }
}

// Topic dialog state
const topicDialogVisible = ref(false)
const selectedTopic = ref<TopicDialogData | null>(null)
// Store original TopicItems keyed by topic id for cover_url / avatar lookup
const topicItemMap = new Map<string, TopicItem>()

async function onCardClick(note: Note) {
  const item = topicItemMap.get(note.id)
  if (!item) return
  try {
    const [detail, stats] = await Promise.all([
      topicApi.getTopicDetail(item.id),
      topicApi.getTopicStats(item.id),
    ])
    selectedTopic.value = {
      title: detail.title,
      description: detail.content,
      cover_image: getCoverUrl(item.cover_url),
      avatar: getAvatarUrl(item.avatar),
      username: detail.author,
      bio: detail.bio,
      created_at: detail.publish_time,
      topic_id: item.id,
      star_count: stats.start,
      view_count: stats.browser,
    }
    topicDialogVisible.value = true
  } catch {
    // fallback with cached data
    selectedTopic.value = {
      title: item.title,
      description: item.description ?? '',
      cover_image: getCoverUrl(item.cover_url),
      avatar: getAvatarUrl(item.avatar),
      username: item.username,
      bio: '',
      created_at: item.created_at,
      topic_id: item.id,
    }
    topicDialogVisible.value = true
  }
}

/** Map backend TopicItem to Note-compatible format for NoteWaterfall */
function topicToNote(item: TopicItem): Note {
  return {
    id: String(item.id),
    user_id: String(item.author_id ?? ''),
    title: item.title,
    content: item.description ?? '',
    cover_image: getCoverUrl(item.cover_url),
    status: 'published',
    view_count: 0,
    like_count: 0,
    comment_count: 0,
    favorite_count: 0,
    share_count: 0,
    is_liked: false,
    is_favorited: false,
    author: {
      id: String(item.author_id ?? ''),
      nickname: item.username,
      avatar: getAvatarUrl(item.avatar),
      email: '',
      phone: '',
      bio: '',
      gender: 0,
      birthday: '',
      status: 0,
      created_at: '',
      updated_at: '',
    },
    media: [],
    tags: [],
    topics: [],
    created_at: item.created_at,
    updated_at: item.updated_at,
  } as Note
}

async function fetchTopics(reset = false) {
  if (topicLoading.value) return
  if (!reset && !topicHasMore.value) return
  if (reset) {
    topics.value = []
    topicPage.value = 1
    topicHasMore.value = true
  }
  topicLoading.value = true
  try {
    const res = await topicApi.getTopicFeed({
      page: topicPage.value,
      page_size: 10,
      category_id: activeCatId.value,
    })
    const notes = res.topics.map((item) => {
      topicItemMap.set(String(item.id), item)
      const note = topicToNote(item)
      // 按已收藏 id 集合点亮收藏按钮
      note.is_favorited = collectedIds.value.has(String(item.id))
      return note
    })
    // 批量获取每个话题的收藏数
    const statsResults = await Promise.allSettled(
      res.topics.map((t) => topicApi.getTopicStats(t.id)),
    )
    statsResults.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        notes[i].like_count = r.value.start
      }
    })
    if (reset) {
      topics.value = notes
    } else {
      topics.value.push(...notes)
    }
    topicHasMore.value = res.hashMore
    topicPage.value++
  } finally {
    topicLoading.value = false
  }
}

function onCatChange(cat: Category) {
  if (cat.id === CAT_MORE) {
    showAllTags.value = true
    return
  }
  if (cat.id === CAT_COLLAPSE) {
    showAllTags.value = false
    return
  }
  activeCatId.value = cat.id
  fetchTopics(true)
}

function onTabChange(tab: FeedType) {
  activeTab.value = tab
}

async function fetchTags() {
  tagsLoading.value = true
  try {
    const data = await tagApi.getRecommendedTags()
    console.log('[fetchTags] 原始数据:', data)
    console.log('[fetchTags] 类型:', typeof data, '| 是数组:', Array.isArray(data))
    tags.value = data
    console.log('[fetchTags] tags.value:', tags.value)
    console.log('[fetchTags] visibleCategories:', visibleCategories.value)
  } catch (e) {
    console.error('获取推荐标签失败:', e)
    tags.value = []
  } finally {
    tagsLoading.value = false
  }
}

onMounted(async () => {
  fetchTags()
  // 登录用户先拉取已收藏话题 id，再加载列表以便点亮收藏按钮
  if (authStore.isAuthenticated) await fetchCollectedIds()
  fetchTopics(true)
})
</script>

<template>
  <div class="page-container home-page">
    <div class="feed-tabs sticky top-14 md:top-[108px] z-30">
      <div class="feed-tabs__surface">
        <div class="flex items-center justify-center gap-8 md:gap-11">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="relative pb-2.5 text-[17px] md:text-[18px] transition-all duration-200"
            :class="activeTab === tab.key ? 'text-text-primary font-bold' : 'text-text-tertiary hover:text-text-secondary font-semibold'"
            @click="onTabChange(tab.key)"
          >
            {{ tab.label }}
            <div
              v-if="activeTab === tab.key"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-primary rounded-full"
              style="box-shadow: 0 0 10px rgba(139, 92, 246, 0.4)"
            />
          </button>
        </div>
        <div class="category-row scrollbar-hide">
          <button
            v-for="cat in visibleCategories"
            :key="cat.id"
            class="category-pill"
            :class="activeCatId === cat.id
              ? 'text-text-primary'
              : 'text-text-tertiary hover:text-text-secondary'"
            @click="onCatChange(cat)"
          >
            <template v-if="cat.id === CAT_COLLAPSE">
              <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </template>
            <template v-else>{{ cat.name }}</template>
          </button>
        </div>
      </div>
    </div>

    <div class="feed-body">
      <NoteWaterfall
        :notes="topics"
        :loading="topicLoading"
        :has-more="topicHasMore"
        empty-text="暂无内容"
        click-mode="emit"
        @load-more="fetchTopics()"
        @card-click="onCardClick"
      />
      <TopicDetailDialog
        v-if="selectedTopic"
        v-model="topicDialogVisible"
        :topic="selectedTopic"
      />
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.home-page {
  padding-top: 0;
}

.feed-tabs {
  margin: -12px auto 22px;
  padding: 0 12px 10px;
  background: linear-gradient(180deg, var(--color-bg-page) 0%, rgba(26, 26, 31, 0.94) 72%, rgba(26, 26, 31, 0) 100%);
}

.feed-tabs__surface {
  max-width: 980px;
  margin: 0 auto;
}

.category-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 28px;
  margin-top: 16px;
}

.category-pill {
  position: relative;
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  font-size: 15px;
  font-weight: 650;
  line-height: 1;
  cursor: pointer;
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.category-pill::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -9px;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--color-primary);
  opacity: 0;
  transform: translateX(-50%) scale(0.6);
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.category-pill.text-text-primary::after {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.category-pill:hover {
  transform: translateY(-1px);
}

.collapse-icon {
  width: 14px;
  height: 14px;
  display: block;
}

.feed-body {
  width: 100%;
}

@media (max-width: 768px) {
  .feed-tabs {
    margin-top: 0;
    padding-inline: 0;
  }

  .category-row {
    gap: 10px 18px;
    padding: 0 4px 8px;
  }
}
</style>
