<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Comment } from '@/types'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'
import DataTable from '@/components/admin/DataTable.vue'

const comments = ref<Comment[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)

const columns = [
  { prop: 'content', label: '内容' },
  { prop: 'user', label: '用户', slot: 'user' },
  { prop: 'created_at', label: '时间' },
  { prop: 'actions', label: '操作', slot: 'actions', width: '120' },
]

async function fetchComments() {
  loading.value = true
  try {
    const res = await adminApi.getComments(page.value)
    comments.value = res.data.items as Comment[]
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function deleteComment(comment: Comment) {
  await adminApi.deleteComment(comment.id)
  ElMessage.success('已删除')
  fetchComments()
}

onMounted(() => fetchComments())
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">评论管理</h1>
    <div class="bg-white rounded-xl shadow-sm">
      <DataTable
        :columns="columns"
        :data="comments as any"
        :loading="loading"
        :total="total"
        :page="page"
        @page-change="page = $event; fetchComments()"
      >
        <template #user="{ row }">
          <div class="flex items-center gap-2">
            <img :src="row.user?.avatar" class="w-6 h-6 rounded-full" />
            <span class="text-sm">{{ row.user?.nickname }}</span>
          </div>
        </template>
        <template #actions="{ row }">
          <el-button size="small" type="danger" plain @click="deleteComment(row as Comment)">删除</el-button>
        </template>
      </DataTable>
    </div>
  </div>
</template>
