<script setup lang="ts">
import { ref } from 'vue'
import type { Comment } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { commentApi } from '@/api/comment'
import { ElMessage } from 'element-plus'

interface Props {
  comment: Comment
  noteId: string
  isReply?: boolean
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const showReplyInput = ref(false)
const replyContent = ref('')
const submitting = ref(false)

async function handleReply() {
  if (!replyContent.value.trim()) return
  submitting.value = true
  try {
    await commentApi.createComment({
      note_id: props.noteId,
      user_id: authStore.user!.id,
      parent_id: props.comment.id,
      content: replyContent.value.trim(),
    })
    replyContent.value = ''
    showReplyInput.value = false
    ElMessage.success('回复成功')
  } catch {
    ElMessage.error('回复失败')
  } finally {
    submitting.value = false
  }
}

function formatTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}
</script>

<template>
  <div :class="{ 'ml-10 mt-3 pl-3 border-l-2 border-border/60': isReply }">
    <div class="flex gap-2.5">
      <img
        :src="comment.user.avatar"
        class="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-bg-tertiary"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2">
          <span class="text-sm font-medium text-text-primary">{{ comment.user.nickname }}</span>
          <span class="text-xs text-text-tertiary">{{ formatTime(comment.created_at) }}</span>
        </div>
        <p class="text-sm text-text-secondary mt-1 leading-relaxed">{{ comment.content }}</p>

        <div class="flex items-center gap-4 mt-1.5">
          <button
            class="text-xs text-text-tertiary hover:text-like transition-colors flex items-center gap-0.5"
          >
            <el-icon :size="12"><Star /></el-icon>
            <span v-if="comment.like_count">{{ comment.like_count }}</span>
          </button>
          <button
            v-if="!isReply"
            class="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            @click="showReplyInput = !showReplyInput"
          >
            回复
          </button>
        </div>

        <!-- Reply input -->
        <div v-if="showReplyInput" class="mt-2.5 flex gap-2">
          <el-input
            v-model="replyContent"
            size="small"
            placeholder="写下回复..."
            maxlength="200"
          />
          <el-button size="small" type="primary" :loading="submitting" @click="handleReply">
            回复
          </el-button>
        </div>

        <!-- Nested replies -->
        <div v-if="comment.replies && comment.replies.length > 0">
          <CommentItem
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :note-id="noteId"
            :is-reply="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
