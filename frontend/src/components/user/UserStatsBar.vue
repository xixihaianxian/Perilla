<script setup lang="ts">
interface Props { noteCount: number; followerCount: number; followingCount: number; userId: string }
defineProps<Props>()
function formatCount(n: number): string { if (n >= 10000) return `${(n / 10000).toFixed(1)}万`; return String(n) }
</script>

<template>
  <div class="flex items-center gap-6 justify-center sm:justify-start">
    <span class="text-sm"><strong class="text-text-card-primary">{{ formatCount(noteCount) }}</strong><span class="text-text-card-tertiary ml-1">笔记</span></span>
    <span class="text-sm"><strong class="text-text-card-primary">{{ formatCount(followerCount) }}</strong><span class="text-text-card-tertiary ml-1">粉丝</span></span>
    <span class="text-sm"><strong class="text-text-card-primary">{{ formatCount(followingCount) }}</strong><span class="text-text-card-tertiary ml-1">关注</span></span>
  </div>
</template>
