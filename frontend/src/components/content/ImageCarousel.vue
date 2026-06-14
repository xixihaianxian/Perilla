<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  images: { url: string; thumbnail_url?: string }[]
  height?: string
}

withDefaults(defineProps<Props>(), {
  height: 'min(500px, 60vh)',
})

const currentIndex = defineModel<number>('currentIndex', { default: 0 })

const zoomed = ref(false)

function toggleZoom() {
  zoomed.value = !zoomed.value
}

function resetZoom() {
  zoomed.value = false
}
</script>

<template>
  <div class="image-carousel relative bg-black rounded-xl overflow-hidden" :style="{ height }">
    <!-- Zoom overlay -->
    <div
      class="relative w-full h-full overflow-hidden"
      :class="zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'"
      @dblclick="toggleZoom"
    >
      <div
        class="w-full h-full transition-transform duration-300"
        :class="zoomed ? 'scale-[2.5]' : 'scale-100'"
        :style="{ transformOrigin: 'center center' }"
      >
        <img
          :src="images[currentIndex]?.url"
          class="w-full h-full object-contain"
          loading="lazy"
          @dblclick.prevent="toggleZoom"
        />
      </div>
    </div>

    <!-- Navigation arrows -->
    <button
      v-if="images.length > 1 && currentIndex > 0"
      class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 z-10"
      @click.stop="currentIndex--; resetZoom()"
    >
      <el-icon :size="18"><ArrowLeft /></el-icon>
    </button>
    <button
      v-if="images.length > 1 && currentIndex < images.length - 1"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 z-10"
      @click.stop="currentIndex++; resetZoom()"
    >
      <el-icon :size="18"><ArrowRight /></el-icon>
    </button>

    <!-- Image counter -->
    <div
      v-if="images.length > 1"
      class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full z-10 font-medium"
    >
      {{ currentIndex + 1 }} / {{ images.length }}
    </div>

    <!-- Dot indicators -->
    <div
      v-if="images.length > 1"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
    >
      <button
        v-for="(_, idx) in images"
        :key="idx"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="
          idx === currentIndex
            ? 'bg-white w-5'
            : 'bg-white/50 hover:bg-white/80'
        "
        @click.stop="currentIndex = idx; resetZoom()"
      />
    </div>
  </div>
</template>
