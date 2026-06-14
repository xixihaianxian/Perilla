<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

interface MobileNavItem {
  name: string
  path: string
  icon: string
}

const navItems: MobileNavItem[] = [
  { name: '首页', path: '/', icon: 'HomeFilled' },
  { name: '发现', path: '/explore', icon: 'Compass' },
  { name: '发布', path: '/note/create', icon: 'Plus' },
  { name: '消息', path: '/messages', icon: 'ChatDotRound' },
  { name: '我的', path: '/me', icon: 'User' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1A1F]/85 backdrop-blur-xl border-t border-border/50 z-50">
    <div class="flex items-center justify-around h-14">
      <template v-for="item in navItems" :key="item.path">
        <router-link
          v-if="item.name === '发布'"
          :to="authStore.isAuthenticated ? item.path : '/login'"
          class="relative -mt-5 flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <el-icon :size="24"><Plus /></el-icon>
        </router-link>

        <router-link
          v-else
          :to="item.path"
          class="flex flex-col items-center justify-center gap-0.5 min-w-0 px-2 py-1.5 transition-colors duration-200"
          :class="isActive(item.path) ? 'text-primary' : 'text-text-tertiary'"
        >
          <el-icon :size="24">
            <component :is="item.icon" />
          </el-icon>
          <span class="text-[11px] leading-none font-medium">{{ item.name }}</span>
        </router-link>
      </template>
    </div>
  </nav>
</template>
