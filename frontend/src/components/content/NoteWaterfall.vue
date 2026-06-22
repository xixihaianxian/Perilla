<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Note } from '@/types'
import { useWaterfall } from '@/composables/useWaterfall'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import NoteCard from './NoteCard.vue'
import AppLoading from '@/components/common/AppLoading.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'

interface Props {
  notes: Note[]
  loading?: boolean
  hasMore?: boolean
  emptyText?: string
  emptyType?: 'generic' | 'notes' | 'search' | 'following'
  emptyShowCta?: boolean
  emptyCtaText?: string
  emptyCtaLink?: string
  clickMode?: 'navigate' | 'emit'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: true,
  emptyText: '暂无内容',
  emptyType: 'notes',
  emptyShowCta: false,
  emptyCtaText: '去探索',
  emptyCtaLink: '/explore',
  clickMode: 'navigate',
})

const emit = defineEmits<{
  loadMore: []
  favoriteToggle: [noteId: string, isFavorited: boolean]
  cardClick: [note: Note]
}>()

const containerRef = ref<HTMLElement | null>(null)
const waterfallGap = 28
const { columnCount } = useWaterfall(containerRef, 260, waterfallGap)

function getEstimatedHeight(note: Note): number {
  const titleLines = Math.ceil((note.title.length * 0.65) / 18)
  const titleHeight = Math.min(titleLines, 2) * 20
  if (note.media.length > 0 && note.media[0].width && note.media[0].height) {
    const imgRatio = note.media[0].height / note.media[0].width
    const colWidth = ((containerRef.value?.clientWidth || 1200) - waterfallGap * (columnCount.value - 1)) / columnCount.value
    return colWidth * imgRatio + titleHeight + 52 + 24
  }
  return 280 + titleHeight + 52
}

const columns = computed(() => {
  const cols: Note[][] = Array.from({ length: columnCount.value }, () => [])
  const heights: number[] = new Array(columnCount.value).fill(0)

  props.notes.forEach((note) => {
    const shortestIdx = heights.indexOf(Math.min(...heights))
    cols[shortestIdx].push(note)
    heights[shortestIdx] += getEstimatedHeight(note)
  })

  return cols
})

const { sentinelRef } = useInfiniteScroll(
  async () => {
    if (!props.loading && props.hasMore) {
      emit('loadMore')
    }
  },
  { threshold: 500 },
)
</script>

<template>
  <div ref="containerRef" class="w-full">
    <!-- Loading state -->
    <AppLoading v-if="loading && notes.length === 0" type="card" :count="8" />

    <!-- Empty state -->
    <AppEmpty
      v-else-if="!loading && notes.length === 0"
      :type="emptyType"
      :description="emptyText"
      :show-cta="emptyShowCta"
      :cta-text="emptyCtaText"
      :cta-link="emptyCtaLink"
    />

    <!-- Waterfall grid -->
    <div v-else class="waterfall-grid" :style="{ minHeight: '200px' }">
      <div
        v-for="(col, colIndex) in columns"
        :key="colIndex"
        class="flex-1 flex flex-col"
        :style="{ minWidth: 0 }"
      >
        <NoteCard
          v-for="(note, noteIndex) in col"
          :key="note.id"
          :note="note"
          :stagger-index="(noteIndex + 1)"
          :click-mode="clickMode"
          @favorite-toggle="(noteId, fav) => emit('favoriteToggle', noteId, fav)"
          @card-click="(note) => emit('cardClick', note)"
        />
      </div>
    </div>

    <!-- Sentinel -->
    <div ref="sentinelRef" />

    <!-- Bottom loading -->
    <div v-if="loading && notes.length > 0" class="flex justify-center py-8">
      <el-icon :size="24" class="animate-spin text-primary"><Loading /></el-icon>
    </div>
    <div
      v-else-if="!hasMore && notes.length > 0"
      class="text-center py-10 text-text-tertiary text-sm"
    >
      — 已经到底了 —
    </div>
  </div>
</template>

<style scoped>
.waterfall-grid {
  display: flex;
  gap: 28px;
}

.waterfall-grid > div {
  gap: 22px;
}

@media (max-width: 768px) {
  .waterfall-grid {
    gap: 12px;
  }

  .waterfall-grid > div {
    gap: 14px;
  }
}
</style>
