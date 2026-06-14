<script setup lang="ts">
interface Props {
  type?: 'primary' | 'default' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'default' | 'large'
  loading?: boolean
  disabled?: boolean
  round?: boolean
  block?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  loading: false,
  disabled: false,
  round: false,
  block: false,
})
</script>

<template>
  <el-button
    :type="type"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :round="round"
    class="app-button"
    :class="{ 'w-full': block }"
  >
    <slot />
  </el-button>
</template>

<style scoped>
.app-button {
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}
</style>
