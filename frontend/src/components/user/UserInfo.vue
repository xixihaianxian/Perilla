<script setup lang="ts">
import type { User } from '@/types'
import FollowButton from './FollowButton.vue'
import UserStatsBar from './UserStatsBar.vue'
import { useAuthStore } from '@/stores/authStore'

interface Props { user: User }
defineProps<Props>()
const authStore = useAuthStore()
</script>

<template>
  <div class="bg-surface rounded-xl p-6 shadow-sm border border-border-card">
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
      <img :src="user.avatar" :alt="user.nickname" class="w-20 h-20 rounded-full object-cover" />
      <div class="flex-1 text-center sm:text-left">
        <h1 class="text-xl font-bold text-text-card-primary">{{ user.nickname }}</h1>
        <p class="text-sm text-text-card-secondary mt-1">{{ user.bio || '这个人很懒，什么都没写...' }}</p>
        <p v-if="user.location" class="text-xs text-text-card-tertiary mt-1"><el-icon :size="12"><Location /></el-icon> {{ user.location }}</p>
        <UserStatsBar :note-count="user.note_count" :follower-count="user.follower_count" :following-count="user.following_count" :user-id="user.id" class="mt-3" />
      </div>
      <div v-if="authStore.user?.id !== user.id" class="shrink-0">
        <FollowButton :user-id="user.id" :is-following="user.is_following" size="large" />
      </div>
    </div>
  </div>
</template>
