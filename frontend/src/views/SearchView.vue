<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Note, User, Topic } from '@/types'
import { searchApi } from '@/api/search'
import { useAuthStore } from '@/stores/authStore'
import type { SearchHistory } from '@/types/search'
import NoteWaterfall from '@/components/content/NoteWaterfall.vue'
import UserCard from '@/components/user/UserCard.vue'
import TopicChip from '@/components/content/TopicChip.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const query = ref((route.query.q as string) || '')
const activeTab = ref<'notes' | 'users' | 'topics'>('notes')
const noteResults = ref<Note[]>([])
const userResults = ref<User[]>([])
const topicResults = ref<Topic[]>([])
const history = ref<SearchHistory[]>([])
const loading = ref(false)
const searched = ref(false)

async function doSearch() {
  if (!query.value.trim()) return
  loading.value = true; searched.value = true
  try {
    const res = await searchApi.search(query.value.trim())
    noteResults.value = res.data.notes.items
    userResults.value = res.data.users.items
    topicResults.value = res.data.topics.items
  } finally { loading.value = false }
}

async function loadHistory() {
  if (authStore.user) { const res = await searchApi.getSearchHistory(authStore.user.id); history.value = res.data }
}

watch(() => route.query.q, (val) => { if (val) { query.value = val as string; doSearch() } })

function onSearch() { router.push({ query: { q: query.value } }) }

onMounted(() => { loadHistory(); if (query.value) doSearch() })
</script>

<template>
  <div class="page-container max-w-5xl">
    <div class="py-4">
      <el-input v-model="query" placeholder="搜索笔记、用户、话题..." size="large" :prefix-icon="'Search'" clearable @keyup.enter="onSearch" />
    </div>

    <template v-if="searched">
      <div class="flex gap-6 border-b border-border mb-4">
        <button v-for="tab in [{ key: 'notes', label: `笔记 (${noteResults.length})` }, { key: 'users', label: `用户 (${userResults.length})` }, { key: 'topics', label: `话题 (${topicResults.length})` }]" :key="tab.key"
          class="pb-3 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-text-tertiary hover:text-text-secondary'"
          @click="activeTab = tab.key as any">{{ tab.label }}</button>
      </div>

      <NoteWaterfall v-if="activeTab === 'notes'" :notes="noteResults" :has-more="false" :empty-text="'未找到关于 ' + query + ' 的笔记'" :empty-type="'search'" />
      <div v-else-if="activeTab === 'users'" class="space-y-2">
        <UserCard v-for="user in userResults" :key="user.id" :user="user" />
        <p v-if="userResults.length === 0" class="text-center py-16 text-text-tertiary">未找到相关用户</p>
      </div>
      <div v-else class="flex flex-wrap gap-3">
        <TopicChip v-for="topic in topicResults" :key="topic.id" :topic="topic" />
        <p v-if="topicResults.length === 0" class="text-center py-16 text-text-tertiary w-full">未找到相关话题</p>
      </div>
    </template>

    <div v-else>
      <div v-if="history.length > 0" class="mb-8">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-bold text-text-primary">搜索历史</h2>
          <button class="text-sm text-text-tertiary hover:text-primary transition-colors" @click="authStore.user && searchApi.clearHistory(authStore.user.id); history = []">清除全部</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <el-tag v-for="item in history" :key="item.id" class="cursor-pointer" @click="query = item.query; onSearch()">{{ item.query }}</el-tag>
        </div>
      </div>
      <h2 class="text-base font-bold text-text-primary mb-3">热门搜索</h2>
      <div class="flex flex-wrap gap-2">
        <el-tag v-for="kw in ['穿搭', '美食', '旅行', '摄影', '家居', '美妆', '健身', '读书']" :key="kw" class="cursor-pointer" @click="query = kw; onSearch()">{{ kw }}</el-tag>
      </div>
    </div>
  </div>
</template>
