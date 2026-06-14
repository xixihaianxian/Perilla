<script setup lang="ts">
interface Props {
  status: string
}

defineProps<Props>()

const statusMap: Record<string, { label: string; type: string }> = {
  pending: { label: '待审核', type: 'warning' },
  approved: { label: '已通过', type: 'success' },
  rejected: { label: '已驳回', type: 'danger' },
  resolved: { label: '已处理', type: 'success' },
  dismissed: { label: '已驳回', type: 'info' },
  published: { label: '已发布', type: 'success' },
  draft: { label: '草稿', type: 'info' },
  reviewing: { label: '审核中', type: 'warning' },
}
</script>

<template>
  <el-tag
    :type="(statusMap[status]?.type || 'info') as any"
    size="small"
    effect="plain"
  >
    {{ statusMap[status]?.label || status }}
  </el-tag>
</template>
