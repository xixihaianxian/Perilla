<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Report } from '@/types'
import { ReportStatus } from '@/types'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'
import DataTable from '@/components/admin/DataTable.vue'
import ReviewStatusBadge from '@/components/admin/ReviewStatusBadge.vue'

const reports = ref<Report[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)

const columns = [
  { prop: 'reporter', label: '举报人', slot: 'reporter' },
  { prop: 'target_type', label: '类型' },
  { prop: 'reason', label: '原因' },
  { prop: 'status', label: '状态', slot: 'status' },
  { prop: 'created_at', label: '时间' },
  { prop: 'actions', label: '操作', slot: 'actions', width: '180' },
]

async function fetchReports() {
  loading.value = true
  try {
    const res = await adminApi.getReports(page.value)
    reports.value = res.data.items as Report[]
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function handleReport(report: Report, action: 'resolved' | 'dismissed') {
  await adminApi.handleReport(report.id, action, action === 'resolved' ? '已处理，内容已下架' : '举报不成立')
  report.status = action === 'resolved' ? ReportStatus.RESOLVED : ReportStatus.DISMISSED
  ElMessage.success(action === 'resolved' ? '已处理' : '已驳回')
}

onMounted(() => fetchReports())
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">举报管理</h1>
    <div class="bg-white rounded-xl shadow-sm">
      <DataTable
        :columns="columns"
        :data="reports as any"
        :loading="loading"
        :total="total"
        :page="page"
        @page-change="page = $event; fetchReports()"
      >
        <template #reporter="{ row }">
          <div class="flex items-center gap-2">
            <img :src="row.reporter?.avatar" class="w-6 h-6 rounded-full" />
            <span class="text-sm">{{ row.reporter?.nickname }}</span>
          </div>
        </template>
        <template #status="{ row }">
          <ReviewStatusBadge :status="row.status" />
        </template>
        <template #actions="{ row }">
          <div class="flex gap-1" v-if="row.status === 'pending'">
            <el-button size="small" type="success" plain @click="handleReport(row as Report, 'resolved')">处理</el-button>
            <el-button size="small" type="info" plain @click="handleReport(row as Report, 'dismissed')">驳回</el-button>
          </div>
          <span v-else class="text-sm text-text-tertiary">已处理</span>
        </template>
      </DataTable>
    </div>
  </div>
</template>
