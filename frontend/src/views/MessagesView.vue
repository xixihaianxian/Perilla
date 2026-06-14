<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Conversation, Message } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { messageApi } from '@/api/message'
import ConversationList from '@/components/message/ConversationList.vue'
import MessageList from '@/components/message/MessageList.vue'
import MessageInput from '@/components/message/MessageInput.vue'

const authStore = useAuthStore()
const showList = ref(true)
const conversations = ref<Conversation[]>([])
const messages = ref<Message[]>([])
const activeConvId = ref<string | null>(null)

const otherUser = computed(() => {
  if (!activeConvId.value) return null
  return conversations.value.find((c) => c.id === activeConvId.value)?.participants.find((p) => p.id !== authStore.user?.id)
})

async function fetchConversations() {
  if (!authStore.user) return
  const res = await messageApi.getConversations(authStore.user.id)
  conversations.value = res.data
}

async function selectConversation(id: string) {
  activeConvId.value = id; showList.value = false
  const res = await messageApi.getMessages(id)
  messages.value = res.data.items
}

async function handleSend(content: string) {
  if (!activeConvId.value || !authStore.user || !otherUser.value) return
  const res = await messageApi.sendMessage({ conversation_id: activeConvId.value, sender_id: authStore.user.id, receiver_id: otherUser.value.id, content })
  messages.value.push(res.data)
}

onMounted(() => fetchConversations())
</script>

<template>
  <div class="page-container p-0! h-[calc(100vh-3.5rem)] max-w-5xl">
    <div class="flex h-full bg-surface rounded-xl shadow-sm overflow-hidden">
      <div class="w-full md:w-80 border-r border-border-card shrink-0" :class="{ 'hidden md:block': !showList }">
        <ConversationList :conversations="conversations" :active-id="activeConvId" @select="selectConversation" />
      </div>
      <div class="flex-1 flex flex-col" :class="{ 'hidden md:flex': showList }">
        <template v-if="activeConvId && otherUser">
          <div class="flex items-center gap-3 p-3 border-b border-border-card">
            <button class="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100" @click="showList = true">
              <el-icon :size="18"><ArrowLeft /></el-icon>
            </button>
            <img :src="otherUser.avatar" class="w-8 h-8 rounded-full" />
            <span class="text-sm font-medium text-text-card-primary">{{ otherUser.nickname }}</span>
          </div>
          <MessageList :messages="messages" />
          <MessageInput @send="handleSend" />
        </template>
        <div v-else class="flex-1 flex items-center justify-center text-text-tertiary text-sm">选择一个会话开始聊天</div>
      </div>
    </div>
  </div>
</template>
