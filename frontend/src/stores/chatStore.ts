import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Conversation, Message } from '@/types'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([])
  const messages = ref<Map<string, Message[]>>(new Map())
  const activeConversationId = ref<string | null>(null)
  const unreadCount = ref(0)

  const activeConversation = computed(() =>
    conversations.value.find((c) => c.id === activeConversationId.value),
  )

  const activeMessages = computed(() => {
    if (!activeConversationId.value) return []
    return messages.value.get(activeConversationId.value) || []
  })

  async function fetchConversations() {
    // Will be implemented in Phase 9
  }

  async function fetchMessages(conversationId: string) {
    // Will be implemented in Phase 9
  }

  async function sendMessage(conversationId: string, content: string) {
    // Will be implemented in Phase 9
  }

  return {
    conversations,
    messages,
    activeConversationId,
    unreadCount,
    activeConversation,
    activeMessages,
    fetchConversations,
    fetchMessages,
    sendMessage,
  }
})
