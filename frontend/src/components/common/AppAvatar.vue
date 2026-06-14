<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  showOnline?: boolean
  online?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  size: 'md',
  showOnline: false,
  online: false,
})

const sizeMap: Record<string, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

const sizePx = typeof props.size === 'number' ? props.size : sizeMap[props.size] || 40
</script>

<template>
  <div class="relative inline-flex shrink-0" :style="{ width: `${sizePx}px`, height: `${sizePx}px` }">
    <img
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover rounded-full bg-bg-tertiary"
    />
    <span
      v-if="showOnline"
      class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
      :class="online ? 'bg-green-500' : 'bg-gray-400'"
      :style="{ transform: 'translate(10%, 10%)' }"
    />
  </div>
</template>
