<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Message } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import MessageBubble from './MessageBubble.vue'

interface Props {
  messages: Message[]
}

defineProps<Props>()

const authStore = useAuthStore()
const listRef = ref<HTMLDivElement>()

function isMine(msg: Message): boolean {
  return msg.sender_id === authStore.user?.id
}

watch(
  () => ({}), // Trigger on any update
  () => {
    nextTick(() => {
      if (listRef.value) {
        listRef.value.scrollTop = listRef.value.scrollHeight
      }
    })
  },
  { deep: true },
)
</script>

<template>
  <div ref="listRef" class="flex-1 overflow-y-auto p-4">
    <MessageBubble
      v-for="msg in messages"
      :key="msg.id"
      :message="msg"
      :is-mine="isMine(msg)"
    />
  </div>
</template>
