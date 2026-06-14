<script setup lang="ts">
import { ref } from 'vue'
import type { Topic } from '@/types'
import TopicDetailDialog from './TopicDetailDialog.vue'

interface Props {
  topic: Topic
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), { size: 'md' })
const dialogVisible = ref(false)
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-1.5 rounded-full border border-border hover:border-primary hover:shadow-sm hover:bg-primary/10 hover:text-primary transition-all duration-200"
    :class="size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'"
    @click="dialogVisible = true"
  >
    <svg
      class="icon-svg"
      :style="{ width: props.size === 'sm' ? '16px' : '20px', height: props.size === 'sm' ? '16px' : '20px' }"
      aria-hidden="true"
    >
      <use :href="'#icon-' + props.topic.icon"></use>
    </svg>
    <span>{{ topic.name }}</span>
  </button>

  <TopicDetailDialog v-model="dialogVisible" :topic="topic" />
</template>
