<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Tag } from '@/types'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'

const tags = ref<Tag[]>([])
const newTagName = ref('')

async function fetchTags() {
  const res = await adminApi.getTags()
  tags.value = res.data
}

async function createTag() {
  if (!newTagName.value.trim()) return
  await adminApi.createTag({ name: newTagName.value.trim() })
  newTagName.value = ''
  ElMessage.success('标签已创建')
  fetchTags()
}

onMounted(() => fetchTags())
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">标签管理</h1>

    <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
      <h2 class="text-base font-semibold mb-3">新建标签</h2>
      <div class="flex gap-3">
        <el-input v-model="newTagName" placeholder="标签名称" maxlength="20" class="max-w-xs" @keyup.enter="createTag" />
        <el-button type="primary" @click="createTag">创建</el-button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <div class="flex flex-wrap gap-2 p-4">
        <el-tag
          v-for="tag in tags"
          :key="tag.id"
          size="large"
          closable
        >
          #{{ tag.name }}
          <span class="text-text-tertiary ml-1">({{ tag.note_count }})</span>
        </el-tag>
      </div>
    </div>
  </div>
</template>
