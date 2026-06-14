<script setup lang="ts">
import { ref, onMounted } from 'vue'; import { useRoute, useRouter } from 'vue-router'; import { useAuthStore } from '@/stores/authStore'
import { noteApi } from '@/api/note'; import type { Note, NoteCreateDTO } from '@/types'; import { ElMessage } from 'element-plus'
import NoteForm from '@/components/content/NoteForm.vue'; import AppLoading from '@/components/common/AppLoading.vue'

const route = useRoute(); const router = useRouter(); const authStore = useAuthStore()
const note = ref<Note | null>(null); const loading = ref(true); const error = ref('')

async function fetchNote() {
  try {
    const res = await noteApi.getNoteDetail(route.params.id as string)
    if (res.data.user_id !== authStore.user?.id) { error.value = '无权编辑此笔记'; return }
    note.value = res.data
  } catch { error.value = '笔记不存在' } finally { loading.value = false }
}

async function handleSubmit(data: NoteCreateDTO) {
  if (!note.value) return
  try { await noteApi.updateNote(note.value.id, data as unknown as Record<string, unknown>); ElMessage.success('保存成功！'); router.push(`/note/${note.value.id}`) }
  catch { ElMessage.error('保存失败') }
}
function handleCancel() { router.back() }
onMounted(() => fetchNote())
</script>

<template>
  <div class="page-container max-w-2xl">
    <AppLoading v-if="loading" type="skeleton" :count="4" />
    <div v-else-if="error" class="text-center py-16"><p class="text-text-tertiary">{{ error }}</p><el-button class="mt-4" @click="$router.push('/')">回到首页</el-button></div>
    <template v-else-if="note">
      <h1 class="text-2xl font-bold text-text-primary py-6">编辑笔记</h1>
      <div class="bg-surface rounded-xl p-6 shadow-sm border border-border-card">
        <NoteForm :initial-data="note" @submit="handleSubmit" @cancel="handleCancel" />
      </div>
    </template>
  </div>
</template>
