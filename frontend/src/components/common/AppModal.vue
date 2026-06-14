<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  width?: string
  showFooter?: boolean
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  width: '520px',
  showFooter: true,
  confirmText: '确认',
  cancelText: '取消',
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
    <template v-if="showFooter" #footer>
      <div class="dialog-footer">
        <el-button @click="emit('cancel')">{{ cancelText }}</el-button>
        <el-button type="primary" :loading="loading" @click="emit('confirm')">
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
