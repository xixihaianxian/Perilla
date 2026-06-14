<script setup lang="ts">
import { ref } from 'vue'
import type { Comment } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { commentApi } from '@/api/comment'
import { ElMessage } from 'element-plus'
import CommentItem from './CommentItem.vue'

interface Props {
  comments: Comment[]
  noteId: string
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasMore: false,
})

const emit = defineEmits<{
  loadMore: []
  commentCreated: [comment: Comment]
}>()

const authStore = useAuthStore()
const newComment = ref('')
const submitting = ref(false)

async function handleSubmit() {
  if (!newComment.value.trim()) return
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录')
    return
  }

  submitting.value = true
  try {
    const res = await commentApi.createComment({
      note_id: props.noteId,
      user_id: authStore.user!.id,
      content: newComment.value.trim(),
    })
    emit('commentCreated', res.data)
    newComment.value = ''
    ElMessage.success('评论成功')
  } catch {
    ElMessage.error('评论失败')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Comment input -->
    <div class="flex gap-3 mb-6">
      <img
        v-if="authStore.user"
        :src="authStore.user.avatar"
        class="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
      />
      <div class="flex-1">
        <el-input
          v-model="newComment"
          type="textarea"
          :rows="2"
          placeholder="写下你的评论..."
          maxlength="500"
        />
        <div class="flex justify-end mt-2">
          <el-button type="primary" size="small" :loading="submitting" @click="handleSubmit">
            发表评论
          </el-button>
        </div>
      </div>
    </div>

    <!-- Comments list -->
    <div v-if="comments.length === 0" class="text-center py-8 text-text-tertiary text-sm">
      暂无评论，来说两句吧
    </div>

    <div v-else class="space-y-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :note-id="noteId"
      />
    </div>

    <!-- Load more -->
    <div v-if="hasMore" class="text-center pt-4">
      <el-button text size="small" @click="emit('loadMore')">加载更多评论</el-button>
    </div>
  </div>
</template>
