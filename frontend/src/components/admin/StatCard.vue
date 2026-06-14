<script setup lang="ts">
interface Props { icon: string; label: string; value: string | number; trend?: number; color?: string }
withDefaults(defineProps<Props>(), { color: '#8B5CF6' })
</script>
<template>
  <div class="bg-surface rounded-xl p-5 shadow-sm border border-border-card">
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm text-text-card-tertiary">{{ label }}</span>
      <div class="w-10 h-10 rounded-lg flex items-center justify-center" :style="{ backgroundColor: `${color}18` }">
        <el-icon :size="20" :color="color"><component :is="icon" /></el-icon>
      </div>
    </div>
    <p class="text-2xl font-bold text-text-card-primary">{{ value }}</p>
    <p v-if="trend !== undefined" class="text-xs mt-1" :class="trend >= 0 ? 'text-green-500' : 'text-red-400'">{{ trend >= 0 ? '↑' : '↓' }}{{ Math.abs(trend) }}% 较上周</p>
  </div>
</template>
