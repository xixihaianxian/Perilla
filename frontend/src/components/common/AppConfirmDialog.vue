<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

withDefaults(defineProps<Props>(), {
  title: '确认操作',
  message: '确定要执行此操作吗？',
  confirmText: '确认',
  cancelText: '取消',
  type: 'warning',
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
    width="400px"
    :close-on-click-modal="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex items-start gap-3">
      <el-icon
        :size="24"
        :color="type === 'danger' ? '#ff4d4f' : type === 'warning' ? '#faad14' : '#1890ff'"
      >
        <WarningFilled v-if="type !== 'info'" />
        <InfoFilled v-else />
      </el-icon>
      <p class="text-text-primary text-sm leading-6">{{ message }}</p>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="emit('cancel')">{{ cancelText }}</el-button>
        <el-button
          :type="type === 'danger' ? 'danger' : 'primary'"
          @click="emit('confirm')"
        >
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
