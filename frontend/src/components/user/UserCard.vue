<script setup lang="ts">
import type { User } from '@/types'
import FollowButton from './FollowButton.vue'
interface Props { user: User; showFollow?: boolean }
withDefaults(defineProps<Props>(), { showFollow: true })
function formatCount(n: number): string { if (n >= 10000) return `${(n / 10000).toFixed(1)}万`; if (n >= 1000) return `${(n / 1000).toFixed(1)}k`; return String(n) }
</script>

<template>
  <div class="flex items-center gap-3 p-3.5 bg-surface rounded-xl shadow-sm border border-border-card hover:shadow-md transition-shadow">
    <router-link :to="`/user/${user.id}`" class="shrink-0">
      <img :src="user.avatar" class="w-[52px] h-[52px] rounded-full object-cover ring-2 ring-bg-tertiary" />
    </router-link>
    <div class="flex-1 min-w-0">
      <router-link :to="`/user/${user.id}`" class="text-sm font-medium text-text-card-primary hover:text-primary transition-colors">{{ user.nickname }}</router-link>
      <p class="text-xs text-text-card-tertiary mt-0.5">{{ formatCount(user.follower_count) }} 粉丝 · {{ user.note_count }} 笔记</p>
    </div>
    <FollowButton v-if="showFollow" :user-id="user.id" :is-following="user.is_following" size="small" />
  </div>
</template>
