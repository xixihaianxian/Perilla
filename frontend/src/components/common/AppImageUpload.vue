<script setup lang="ts">
import { ref } from 'vue'
import { uploadApi } from '@/api/upload'
import { MAX_UPLOAD_IMAGES } from '@/utils/constants'

interface Props {
  modelValue: string[]
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  max: MAX_UPLOAD_IMAGES,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const uploading = ref(false)

async function handleFileChange(file: File) {
  uploading.value = true
  try {
    const res = await uploadApi.uploadImage(file)
    const urls = [...props.modelValue, res.data.url]
    emit('update:modelValue', urls)
  } finally {
    uploading.value = false
  }
}

function removeImage(index: number) {
  const urls = [...props.modelValue]
  urls.splice(index, 1)
  emit('update:modelValue', urls)
}
</script>

<template>
  <div class="app-image-upload">
    <div class="flex flex-wrap gap-3">
      <!-- Preview images -->
      <div
        v-for="(url, index) in modelValue"
        :key="index"
        class="relative w-24 h-24 rounded-lg overflow-hidden group"
      >
        <img :src="url" class="w-full h-full object-cover" />
        <div
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <button
            class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-danger hover:scale-110 transition-transform"
            @click="removeImage(index)"
          >
            <el-icon :size="16"><Delete /></el-icon>
          </button>
        </div>
      </div>

      <!-- Upload button -->
      <el-upload
        v-if="modelValue.length < max"
        :show-file-list="false"
        :http-request="({ file }: any) => handleFileChange(file as File)"
        accept="image/*"
      >
        <div
          class="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer text-text-tertiary hover:text-primary"
        >
          <el-icon :size="24" :class="{ 'animate-spin': uploading }">
            <Plus v-if="!uploading" />
            <Loading v-else />
          </el-icon>
          <span class="text-xs mt-1">{{ modelValue.length }}/{{ max }}</span>
        </div>
      </el-upload>
    </div>
  </div>
</template>
