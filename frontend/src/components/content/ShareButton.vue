<script setup lang="ts">
import { ElMessage } from 'element-plus'

interface Props {
  noteId: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})

async function copyLink() {
  const url = `${window.location.origin}/note/${props.noteId}`
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('链接已复制')
  } catch {
    ElMessage.info('复制失败，请手动复制')
  }
}
</script>

<template>
  <el-dropdown trigger="click" placement="bottom">
    <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary text-sm">
      <el-icon :size="16"><Share /></el-icon>
      <span>分享</span>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="copyLink">
          <el-icon><Link /></el-icon>
          <span>复制链接</span>
        </el-dropdown-item>
        <el-dropdown-item disabled>
          <el-icon><ChatLineSquare /></el-icon>
          <span>微信（即将上线）</span>
        </el-dropdown-item>
        <el-dropdown-item disabled>
          <el-icon><Picture /></el-icon>
          <span>微博（即将上线）</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
