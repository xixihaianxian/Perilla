<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { User, Note } from '@/types'
import { userApi } from '@/api/user'
import UserInfo from '@/components/user/UserInfo.vue'
import NoteWaterfall from '@/components/content/NoteWaterfall.vue'
import AppLoading from '@/components/common/AppLoading.vue'

const route = useRoute()
const user = ref<User | null>(null)
const notes = ref<Note[]>([])
const loading = ref(true)
const notePage = ref(1)
const hasMoreNotes = ref(true)
const loadingNotes = ref(false)
const activeTab = ref<'notes' | 'favorites'>('notes')

async function fetchUser() {
  loading.value = true
  try { const res = await userApi.getProfile(route.params.userId as string); user.value = res.data; await fetchNotes(true) }
  catch { /* ignore */ } finally { loading.value = false }
}

async function fetchNotes(reset = false) {
  if (loadingNotes.value) return
  if (reset) { notePage.value = 1; notes.value = []; hasMoreNotes.value = true }
  loadingNotes.value = true
  try {
    const res = await userApi.getUserNotes(route.params.userId as string, notePage.value)
    if (reset) { notes.value = res.data.items } else { notes.value.push(...res.data.items) }
    hasMoreNotes.value = res.data.items.length >= res.data.pageSize; notePage.value++
  } catch { /* ignore */ } finally { loadingNotes.value = false }
}

onMounted(() => fetchUser())
</script>

<template>
  <div class="page-container max-w-5xl">
    <AppLoading v-if="loading" type="skeleton" :count="3" />
    <template v-else-if="user">
      <UserInfo :user="user" />
      <div class="flex gap-6 mt-6 border-b border-border">
        <button class="pb-3 text-sm font-medium border-b-2 transition-colors" :class="activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-text-tertiary hover:text-text-secondary'" @click="activeTab = 'notes'">笔记</button>
        <button class="pb-3 text-sm font-medium border-b-2 transition-colors" :class="activeTab === 'favorites' ? 'border-primary text-primary' : 'border-transparent text-text-tertiary hover:text-text-secondary'" @click="activeTab = 'favorites'">收藏</button>
      </div>
      <div v-if="activeTab === 'notes'" class="mt-4">
        <NoteWaterfall :notes="notes" :loading="loadingNotes" :has-more="hasMoreNotes" empty-text="暂无笔记" @load-more="fetchNotes()" />
      </div>
      <div v-else class="mt-4 text-center py-16 text-text-tertiary">收藏内容仅自己可见</div>
    </template>
  </div>
</template>
