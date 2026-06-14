<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'generic' | 'search' | 'favorites' | 'following' | 'notes' | 'comments'
  description?: string
  showCta?: boolean
  ctaText?: string
  ctaLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'generic', description: '', showCta: false, ctaText: '去探索', ctaLink: '/explore',
})

const config = computed(() => {
  const map: Record<string, { icon: string; desc: string }> = {
    generic: { icon: 'Picture', desc: '暂无数据' },
    search: { icon: 'Search', desc: '没有找到相关内容，试试其他关键词吧' },
    favorites: { icon: 'CollectionTag', desc: '还没有收藏，去发现精彩内容吧' },
    following: { icon: 'User', desc: '关注你感兴趣的人，查看他们的动态' },
    notes: { icon: 'EditPen', desc: '还没有发布笔记，分享你的第一条内容吧' },
    comments: { icon: 'ChatDotRound', desc: '暂无评论，来说两句吧' },
  }
  return map[props.type] || map.generic
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-24 h-24 rounded-full bg-bg-tertiary flex items-center justify-center mb-5">
      <el-icon :size="40" class="text-text-tertiary opacity-40">
        <component :is="config.icon" />
      </el-icon>
    </div>
    <p class="text-sm text-text-tertiary mb-4">{{ description || config.desc }}</p>
    <slot>
      <router-link
        v-if="showCta"
        :to="ctaLink"
        class="inline-flex items-center px-5 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
      >{{ ctaText }}</router-link>
    </slot>
  </div>
</template>
