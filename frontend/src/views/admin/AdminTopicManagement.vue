<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Topic } from '@/types'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'

const topics = ref<Topic[]>([])
const newTopic = ref({ name: '', icon: 'xingxing', description: '' })

async function fetchTopics() {
  const res = await adminApi.getTopics()
  topics.value = res.data
}

async function createTopic() {
  if (!newTopic.value.name.trim()) return
  await adminApi.createTopic({ ...newTopic.value })
  newTopic.value = { name: '', icon: 'xingxing', description: '' }
  ElMessage.success('话题已创建')
  fetchTopics()
}

onMounted(() => fetchTopics())
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">话题管理</h1>

    <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
      <h2 class="text-base font-semibold mb-3">新建话题</h2>
      <div class="flex gap-3 flex-wrap">
        <el-input v-model="newTopic.name" placeholder="话题名称" maxlength="20" class="max-w-[200px]" />
        <el-input v-model="newTopic.icon" placeholder="图标类名" maxlength="50" class="max-w-[200px]" />
        <el-input v-model="newTopic.description" placeholder="描述" maxlength="100" class="max-w-xs" />
        <el-button type="primary" @click="createTopic">创建</el-button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm divide-y divide-border">
      <div v-for="topic in topics" :key="topic.id" class="flex items-center gap-4 p-4">
        <svg class="icon-svg" style="width: 24px; height: 24px" aria-hidden="true">
          <use :href="'#icon-' + topic.icon"></use>
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ topic.name }}</p>
          <p class="text-xs text-text-tertiary">{{ topic.description }}</p>
        </div>
        <span class="text-sm text-text-tertiary">{{ topic.note_count }} 笔记</span>
        <el-button size="small" type="danger" plain>删除</el-button>
      </div>
    </div>
  </div>
</template>
