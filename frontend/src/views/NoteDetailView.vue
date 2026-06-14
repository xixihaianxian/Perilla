<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Note, Comment } from '@/types'
import { noteApi } from '@/api/note'
import { commentApi } from '@/api/comment'
import { useAuthStore } from '@/stores/authStore'
import NoteDetailComponent from '@/components/content/NoteDetail.vue'
import CommentList from '@/components/content/CommentList.vue'
import AppLoading from '@/components/common/AppLoading.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const note = ref<Note | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const commentPage = ref(1)
const hasMoreComments = ref(true)

async function fetchNote() {
  loading.value = true
  try {
    const noteId = route.params.id as string
    const res = await noteApi.getNoteDetail(noteId, authStore.user?.id)
    note.value = res.data
    await fetchComments(true)
  } catch { note.value = null } finally { loading.value = false }
}

async function fetchComments(reset = false) {
  if (reset) { commentPage.value = 1; comments.value = []; hasMoreComments.value = true }
  try {
    const res = await commentApi.getComments(route.params.id as string, commentPage.value)
    if (reset) { comments.value = res.data.items } else { comments.value.push(...res.data.items) }
    hasMoreComments.value = res.data.items.length >= res.data.pageSize; commentPage.value++
  } catch { /* ignore */ }
}

function handleCommentCreated(newComment: Comment) { comments.value.unshift(newComment) }
function close() { if (window.history.length > 1) router.back(); else router.push('/') }

onMounted(() => fetchNote())
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 sm:py-10 px-4 bg-black/60 backdrop-blur-sm" @click.self="close">
    <button class="fixed top-4 right-4 z-[60] w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg hover:scale-110 transition-all duration-200" @click="close">
      <el-icon :size="20"><Close /></el-icon>
    </button>

    <div class="bg-surface rounded-2xl shadow-overlay w-full max-w-[960px] animate-scale-in my-auto">
      <AppLoading v-if="loading" type="skeleton" :count="3" />

      <template v-else-if="note">
        <NoteDetailComponent :note="note" @update="(n) => (note = n)" />
        <div class="border-t border-border-card p-6">
          <h2 class="text-lg font-bold text-text-card-primary mb-4">评论 ({{ note.comment_count }})</h2>
          <CommentList :comments="comments" :note-id="note.id" :has-more="hasMoreComments" @load-more="fetchComments()" @comment-created="handleCommentCreated" />
        </div>
      </template>

      <div v-else class="p-16 text-center text-text-tertiary">
        <p class="text-lg mb-4">笔记不存在或已被删除</p>
        <el-button @click="router.push('/')">回到首页</el-button>
      </div>
    </div>
  </div>
</template>
