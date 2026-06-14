<script setup lang="ts">
interface Props {
  type?: 'spinner' | 'skeleton' | 'card'
  count?: number
}

withDefaults(defineProps<Props>(), {
  type: 'spinner',
  count: 6,
})
</script>

<template>
  <!-- Spinner -->
  <div v-if="type === 'spinner'" class="flex items-center justify-center py-16">
    <div class="flex flex-col items-center gap-3">
      <el-icon :size="28" class="animate-spin text-primary"><Loading /></el-icon>
      <p class="text-sm text-text-tertiary">加载中...</p>
    </div>
  </div>

  <!-- Card skeleton grid (waterfall-style) -->
  <div v-else-if="type === 'card'" class="flex gap-4">
    <div
      v-for="col in [0, 1, 2, 3]"
      :key="col"
      class="flex-1 flex flex-col gap-4"
      :class="{ 'hidden md:flex': col >= 2, 'hidden lg:flex': col >= 3 }"
    >
      <div
        v-for="i in Math.ceil(count / (col < 2 ? 2 : col < 3 ? 3 : 4))"
        :key="`${col}-${i}`"
        class="bg-white rounded-2xl overflow-hidden shadow-sm"
      >
        <!-- Image skeleton with varied aspect ratio -->
        <div
          class="shimmer-skeleton"
          :style="{
            paddingBottom: `${[120, 80, 140, 100, 75, 130, 90, 110][(col * count + i) % 8]}%`,
          }"
        />
        <!-- Content skeleton -->
        <div class="p-3 space-y-2">
          <div class="shimmer-skeleton h-4 rounded w-3/4" />
          <div class="shimmer-skeleton h-3 rounded w-1/2" />
          <div class="flex items-center gap-2 pt-1">
            <div class="shimmer-skeleton w-6 h-6 rounded-full" />
            <div class="shimmer-skeleton h-3 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Skeleton lines -->
  <div v-else class="space-y-4 p-4">
    <div
      v-for="i in count"
      :key="i"
      class="shimmer-skeleton h-4 rounded"
      :style="{ width: `${65 + (i % 3) * 18}%` }"
    />
  </div>
</template>
