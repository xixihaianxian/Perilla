<script setup lang="ts">
import { ref } from 'vue'
import type { Note } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { favoriteApi } from '@/api/favorite'
import { followApi } from '@/api/follow'
import { ElMessage } from 'element-plus'
import ImageCarousel from './ImageCarousel.vue'
import TagList from './TagList.vue'
import TopicChip from './TopicChip.vue'
import ShareButton from './ShareButton.vue'

interface Props { note: Note }
const props = defineProps<Props>()

const authStore = useAuthStore()
const isLiked = ref(props.note.is_liked)
const isFavorited = ref(props.note.is_favorited)
const isFollowing = ref(props.note.author.is_following)
const likeCount = ref(props.note.like_count)

async function toggleLike() {
  if (!authStore.isAuthenticated) { ElMessage.warning('请先登录'); return }
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

async function toggleFavorite() {
  if (!authStore.isAuthenticated) { ElMessage.warning('请先登录'); return }
  try {
    const res = await favoriteApi.toggleFavorite(authStore.user!.id, props.note.id)
    isFavorited.value = res.data.favorited
    ElMessage.success(isFavorited.value ? '已收藏' : '已取消收藏')
  } catch { /* ignore */ }
}

async function toggleFollow() {
  if (!authStore.isAuthenticated) { ElMessage.warning('请先登录'); return }
  try {
    if (isFollowing.value) { await followApi.unfollow(authStore.user!.id, props.note.author.id) }
    else { await followApi.follow(authStore.user!.id, props.note.author.id) }
    isFollowing.value = !isFollowing.value
    ElMessage.success(isFollowing.value ? '已关注' : '已取消关注')
  } catch { /* ignore */ }
}
</script>

<template>
  <div class="bg-surface rounded-xl overflow-hidden border border-border-card">
    <div class="flex flex-col lg:flex-row">
      <div class="lg:w-[55%] bg-black">
        <ImageCarousel
          v-if="note.media.length > 0"
          :images="note.media.map((m) => ({ url: m.url, thumbnail_url: m.thumbnail_url }))"
          height="min(500px, 60vh)"
        />
        <img v-else :src="note.cover_image" class="w-full object-cover" style="max-height: 60vh" />
      </div>

      <div class="lg:w-[45%] flex flex-col">
        <!-- Author header -->
        <div class="flex items-center justify-between p-4 border-b border-border-card">
          <router-link :to="`/user/${note.author.id}`" class="flex items-center gap-3">
            <img :src="note.author.avatar" class="w-10 h-10 rounded-full object-cover" />
            <div>
              <p class="text-sm font-medium text-text-card-primary">{{ note.author.nickname }}</p>
              <p class="text-xs text-text-card-tertiary">{{ note.author.follower_count }} 粉丝</p>
            </div>
          </router-link>
          <button
            v-if="authStore.user?.id !== note.author.id"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="isFollowing ? 'bg-gray-100 text-text-card-secondary hover:bg-red-50 hover:text-red-500' : 'bg-primary text-white hover:bg-primary-dark'"
            @click="toggleFollow"
          >{{ isFollowing ? '已关注' : '关注' }}</button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <h1 class="text-lg font-bold text-text-card-primary mb-3">{{ note.title }}</h1>
          <p class="text-sm text-text-card-secondary leading-relaxed whitespace-pre-wrap mb-4">{{ note.content }}</p>
          <TagList v-if="note.tags.length > 0" :tags="note.tags" class="mb-3" />
          <div v-if="note.topics.length > 0" class="flex flex-wrap gap-2 mb-3">
            <TopicChip v-for="topic in note.topics" :key="topic.id" :topic="topic" size="sm" />
          </div>
          <p class="text-xs text-text-card-tertiary">{{ new Date(note.created_at).toLocaleDateString('zh-CN') }} 发布</p>
        </div>

        <!-- Action bar -->
        <div class="flex items-center gap-1 px-4 py-3 border-t border-border-card">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm" :class="isLiked ? 'text-like' : 'text-text-card-secondary'" @click="toggleLike">
            <el-icon :size="18"><StarFilled v-if="isLiked" /><Star v-else /></el-icon>
            <span>{{ likeCount }}</span>
          </button>
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm" :class="isFavorited ? 'text-primary' : 'text-text-card-secondary'" @click="toggleFavorite">
            <el-icon :size="18"><Collection v-if="isFavorited" /><CollectionTag v-else /></el-icon>
            <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
          </button>
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-text-card-secondary text-sm">
            <el-icon :size="18"><ChatDotRound /></el-icon>
            <span>{{ note.comment_count }}</span>
          </button>
          <ShareButton :note-id="note.id" />
          <span class="ml-auto text-xs text-text-card-tertiary">{{ note.view_count }} 浏览</span>
        </div>
      </div>
    </div>
  </div>
</template>
