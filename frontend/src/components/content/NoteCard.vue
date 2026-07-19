<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Note } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { favoriteApi } from '@/api/favorite'
import { ElMessage } from 'element-plus'
import { getCoverUrl } from '@/utils/cover'

interface Props {
  note: Note
  staggerIndex?: number
  clickMode?: 'navigate' | 'emit'
}

const props = withDefaults(defineProps<Props>(), {
  clickMode: 'navigate',
})
const emit = defineEmits<{
  favoriteToggle: [noteId: string, isFavorited: boolean]
  cardClick: [note: Note]
}>()

const router = useRouter()

function onCardClick() {
  if (props.clickMode === 'emit') {
    emit('cardClick', props.note)
  } else {
    router.push(`/note/${props.note.id}`)
  }
}

const authStore = useAuthStore()
const justSaved = ref<string | null>(null)
const isFavorited = ref(props.note.is_favorited)
// 收藏数展示（本地维护，收藏/取消后乐观增减）
const likeCount = ref(props.note.like_count)

function formatCount(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}

async function toggleSave(e: Event) {
  e.stopPropagation()
  e.preventDefault()
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录')
    return
  }
  try {
    const res = await favoriteApi.proactiveCollection(Number(props.note.id))
    const body = res.data
    if (body?.code === 200) {
      // 后端 method 字段即收藏状态："favorite"=已收藏，"cancel"=已取消（message 恒为 "success"）
      isFavorited.value = body.method === 'favorite'
      justSaved.value = props.note.id
      emit('favoriteToggle', props.note.id, isFavorited.value)
      setTimeout(() => { justSaved.value = null }, 500)
      ElMessage.success(isFavorited.value ? '收藏成功' : '取消收藏成功')
      // 把收藏结果同步给后端更新收藏数，成功后本地展示 ±1（失败不影响收藏状态）
      favoriteApi
        .updateFavoriteNumber({ topic_id: Number(props.note.id), method: body.method })
        .then(() => {
          likeCount.value += body.method === 'favorite' ? 1 : -1
        })
        .catch(() => {})
    } else {
      ElMessage.error(body?.message || '操作失败')
    }
  } catch (e: any) {
    ElMessage.error(
      e?.response?.data?.detail || e?.response?.data?.message || '操作失败，请稍后重试',
    )
  }
}
</script>

<template>
  <div
    class="note-card group/card bg-surface rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    :class="staggerIndex ? `stagger-${Math.min(staggerIndex, 10)}` : ''"
    @click="onCardClick"
  >
    <div class="relative overflow-hidden bg-bg-tertiary">
      <img
        :src="getCoverUrl(note.cover_image)"
        :alt="note.title"
        class="w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        loading="lazy"
        :style="{
          aspectRatio: note.media[0]?.width && note.media[0]?.height
            ? `${note.media[0].width} / ${note.media[0].height}`
            : '3 / 4',
        }"
      />
      <div
        v-if="note.media.length > 1"
        class="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] rounded-full flex items-center gap-1"
      >
        <el-icon :size="10"><PictureFilled /></el-icon>
        {{ note.media.length }}
      </div>

      <button
        class="absolute top-2.5 right-2.5 z-10 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-200 hover:scale-110 shadow-md"
        :class="{ 'text-violet-500': isFavorited, 'text-violet-300': !isFavorited, 'animate-bookmark-pop': justSaved === note.id }"
        @click="toggleSave"
      >
        <el-icon :size="16"><StarFilled v-if="isFavorited" /><Star v-else /></el-icon>
      </button>

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3"
      >
        <span class="text-white text-xs flex items-center gap-1 font-medium">
          <el-icon :size="12"><StarFilled /></el-icon>
          {{ formatCount(likeCount) }}
        </span>
        <span class="text-white text-xs">{{ formatCount(note.comment_count) }} 评论</span>
      </div>
    </div>

    <div class="p-3">
      <h3 class="text-[14px] font-medium text-text-card-primary text-ellipsis-2 leading-5 mb-2.5">
        {{ note.title }}
      </h3>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 min-w-0">
          <img
            :src="note.author.avatar"
            :alt="note.author.nickname"
            class="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-bg-tertiary"
          />
          <span class="text-xs text-text-card-secondary truncate">{{ note.author.nickname }}</span>
        </div>
        <div class="flex items-center gap-1 text-text-card-tertiary shrink-0">
          <el-icon :size="14"><StarFilled v-if="note.is_liked" class="text-like" /><Star v-else /></el-icon>
          <span class="text-xs">{{ formatCount(likeCount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-card { break-inside: avoid; }
</style>
