<script setup lang="ts">
import { computed } from 'vue'; import type { Conversation } from '@/types'; import { useAuthStore } from '@/stores/authStore'
interface Props { conversation: Conversation; active?: boolean }
const props = defineProps<Props>(); const authStore = useAuthStore()
const otherUser = computed(() => props.conversation.participants.find((p) => p.id !== authStore.user?.id))
</script>
<template>
  <div class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors" :class="{ 'bg-primary-light/10': active }">
    <div class="relative">
      <img :src="otherUser?.avatar" class="w-12 h-12 rounded-full object-cover" />
      <span v-if="conversation.unread_count > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-white text-xs rounded-full px-1">{{ conversation.unread_count }}</span>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-text-card-primary truncate">{{ otherUser?.nickname }}</span>
        <span class="text-xs text-text-card-tertiary shrink-0 ml-2">{{ new Date(conversation.updated_at).toLocaleDateString('zh-CN') }}</span>
      </div>
      <p class="text-xs text-text-card-tertiary truncate mt-0.5">{{ conversation.last_message?.content || '暂无消息' }}</p>
    </div>
  </div>
</template>
