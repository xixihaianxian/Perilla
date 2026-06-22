<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Note } from '@/types'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'
import DataTable from '@/components/admin/DataTable.vue'
import ReviewStatusBadge from '@/components/admin/ReviewStatusBadge.vue'
import { getCoverUrl } from '@/utils/cover'

const notes = ref<Note[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)

const columns = [
  { prop: 'title', label: '标题', slot: 'title' },
  { prop: 'author', label: '作者', slot: 'author' },
  { prop: 'status', label: '状态', slot: 'status' },
  { prop: 'created_at', label: '发布时间' },
  { prop: 'actions', label: '操作', slot: 'actions', width: '200' },
]

async function fetchNotes() {
  loading.value = true
  try {
    const res = await adminApi.getNotes(page.value)
    notes.value = res.data.items as Note[]
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function approve(note: Note) {
  await adminApi.updateNoteStatus(note.id, 'published')
  Object.assign(note, { status: 'published' as const })
  ElMessage.success('已通过')
}

async function reject(note: Note) {
  await adminApi.updateNoteStatus(note.id, 'rejected')
  Object.assign(note, { status: 'rejected' as const })
  ElMessage.success('已驳回')
}

onMounted(() => fetchNotes())
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">内容审核</h1>

    <div class="bg-white rounded-xl shadow-sm">
      <DataTable
        :columns="columns"
        :data="notes as any"
        :loading="loading"
        :total="total"
        :page="page"
        @page-change="page = $event; fetchNotes()"
      >
        <template #title="{ row }">
          <div class="flex items-center gap-2">
            <img :src="getCoverUrl(row.cover_image)" class="w-10 h-10 rounded object-cover shrink-0" />
            <span class="text-sm text-ellipsis-1">{{ row.title }}</span>
          </div>
        </template>
        <template #author="{ row }">
          <span class="text-sm">{{ row.author?.nickname }}</span>
        </template>
        <template #status="{ row }">
          <ReviewStatusBadge :status="row.status" />
        </template>
        <template #actions="{ row }">
          <div class="flex gap-1">
            <el-button size="small" type="success" plain @click="approve(row as Note)">通过</el-button>
            <el-button size="small" type="danger" plain @click="reject(row as Note)">驳回</el-button>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
