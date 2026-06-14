<script setup lang="ts">
import type { Conversation } from '@/types'; import ConversationItem from './ConversationItem.vue'
interface Props { conversations: Conversation[]; activeId: string | null }; defineProps<Props>(); const emit = defineEmits<{ select: [id: string] }>()
</script>
<template>
  <div class="h-full overflow-y-auto">
    <div class="p-3 border-b border-border-card"><h2 class="text-base font-bold text-text-card-primary">私信</h2></div>
    <div v-if="conversations.length === 0" class="p-6 text-center text-text-tertiary text-sm">暂无会话</div>
    <ConversationItem v-for="conv in conversations" :key="conv.id" :conversation="conv" :active="conv.id === activeId" @click="emit('select', conv.id)" />
  </div>
</template>
