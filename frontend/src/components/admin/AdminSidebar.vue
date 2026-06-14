<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const navItems = [
  { name: '数据概览', path: '/admin', icon: 'DataAnalysis' },
  { name: '用户管理', path: '/admin/users', icon: 'User' },
  { name: '内容审核', path: '/admin/content', icon: 'Document' },
  { name: '评论管理', path: '/admin/comments', icon: 'ChatDotRound' },
  { name: '举报管理', path: '/admin/reports', icon: 'Warning' },
  { name: '标签管理', path: '/admin/tags', icon: 'CollectionTag' },
  { name: '话题管理', path: '/admin/topics', icon: 'Collection' },
]
</script>

<template>
  <nav class="py-3">
    <div class="px-4 py-2"><span class="text-xs font-semibold text-text-tertiary uppercase tracking-wider">管理菜单</span></div>
    <ul class="space-y-0.5 px-2">
      <li v-for="item in navItems" :key="item.path">
        <router-link :to="item.path" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
          :class="route.path === item.path ? 'bg-primary/15 text-primary font-semibold' : 'text-text-secondary hover:bg-bg-hover'">
          <el-icon :size="18"><component :is="item.icon" /></el-icon><span>{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
    <div class="px-4 py-4 mt-4 border-t border-border">
      <router-link to="/" class="flex items-center gap-2 text-sm text-text-tertiary hover:text-primary transition-colors">
        <el-icon :size="16"><ArrowLeft /></el-icon><span>返回主站</span>
      </router-link>
    </div>
  </nav>
</template>
