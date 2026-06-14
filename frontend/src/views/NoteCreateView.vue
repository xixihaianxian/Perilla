<script setup lang="ts">
import { ref } from 'vue'; import { useRouter } from 'vue-router'; import { useAuthStore } from '@/stores/authStore'; import { noteApi } from '@/api/note'
import type { NoteCreateDTO } from '@/types'; import { ElMessage } from 'element-plus'; import NoteForm from '@/components/content/NoteForm.vue'

const router = useRouter(); const authStore = useAuthStore(); const submitting = ref(false)

async function handleSubmit(data: NoteCreateDTO) {
  if (!authStore.user) { ElMessage.warning('请先登录'); router.push('/login'); return }
  submitting.value = true
  try { const res = await noteApi.createNote({ user_id: authStore.user.id, ...data }); ElMessage.success('发布成功！'); router.push(`/note/${res.data.id}`) }
  catch { ElMessage.error('发布失败，请稍后重试') } finally { submitting.value = false }
}
function handleCancel() { router.back() }
</script>

<template>
  <div class="page-container max-w-2xl">
    <h1 class="text-2xl font-bold text-text-primary py-6">发布笔记</h1>
    <div class="bg-surface rounded-xl p-6 shadow-sm border border-border-card">
      <NoteForm @submit="handleSubmit" @cancel="handleCancel" />
    </div>
  </div>
</template>
