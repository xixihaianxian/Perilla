<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Topic, Note } from '@/types'
import { mockDB } from '@/mock'
import { noteApi } from '@/api/note'
import TopicChip from '@/components/content/TopicChip.vue'
import NoteWaterfall from '@/components/content/NoteWaterfall.vue'

const topics = ref<Topic[]>([...mockDB.topics.values()])
const notes = ref<Note[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

async function fetchNotes(reset = false) {
  if (reset) { page.value = 1; notes.value = []; hasMore.value = true }
  loading.value = true
  try {
    const res = await noteApi.getFeed({ type: 'hot', page: page.value })
    if (reset) { notes.value = res.data.items } else { notes.value.push(...res.data.items) }
    hasMore.value = res.data.items.length >= res.data.pageSize
    page.value++
  } finally { loading.value = false }
}

onMounted(() => fetchNotes())
</script>

<template>
  <div class="page-container">
    <div class="rounded-2xl bg-gradient-to-br from-primary/10 via-bg-page to-bg-secondary p-6 sm:p-8 mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-text-primary mb-2">发现 Perilla</h1>
      <p class="text-text-secondary text-sm sm:text-base">发现你感兴趣的话题、笔记和创作者</p>
    </div>

    <h2 class="text-lg font-bold text-text-primary mb-3">热门话题</h2>
    <div class="flex flex-wrap gap-2 mb-8">
      <TopicChip v-for="topic in topics" :key="topic.id" :topic="topic" />
    </div>

    <h2 class="text-lg font-bold text-text-primary mb-4">热门笔记</h2>
    <NoteWaterfall :notes="notes" :loading="loading" :has-more="hasMore" @load-more="fetchNotes()" />
  </div>
</template>
