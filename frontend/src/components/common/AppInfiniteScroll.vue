<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  loading?: boolean
  hasMore?: boolean
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: true,
  threshold: 100,
})

const emit = defineEmits<{
  load: []
}>()

const sentinelRef = ref<HTMLDivElement>()
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sentinelRef.value) return
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !props.loading && props.hasMore) {
          emit('load')
        }
      })
    },
    { rootMargin: `${props.threshold}px` },
  )
  observer.observe(sentinelRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div>
    <slot />

    <!-- Sentinel element for intersection detection -->
    <div ref="sentinelRef" class="h-px" />

    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center py-6">
      <el-icon :size="24" class="animate-spin text-primary">
        <Loading />
      </el-icon>
    </div>

    <!-- End of list -->
    <div v-else-if="!hasMore" class="text-center py-6 text-text-tertiary text-sm">
      — 已经到底了 —
    </div>
  </div>
</template>
