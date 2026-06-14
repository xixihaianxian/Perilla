<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useChatStore } from '@/stores/chatStore'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const notificationStore = useNotificationStore()
const chatStore = useChatStore()

const emit = defineEmits<{ openSidebar: [] }>()

const searchQuery = ref('')
const scrolled = ref(false)

const desktopOffsetClass = computed(() =>
  uiStore.sidebarCollapsed ? 'md:left-[68px]' : 'md:left-[244px]',
)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Search', query: { q: searchQuery.value.trim() } })
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 h-14 md:h-[116px] z-50 transition-all duration-300"
    :class="[desktopOffsetClass, scrolled ? 'md:bg-[#1A1A1F]/88 md:backdrop-blur-xl' : 'md:bg-transparent']"
  >
    <div
      class="absolute inset-0 md:hidden bg-[#1A1A1F]/90 backdrop-blur-xl border-b transition-shadow duration-300"
      :class="scrolled ? 'shadow-md border-border/50' : 'border-transparent'"
    />
    <div
      class="hidden md:block absolute inset-x-0 top-0 h-[150px] pointer-events-none bg-gradient-to-b from-[#1A1A1F] via-[#1A1A1F]/86 to-transparent"
    />

    <div class="relative flex items-center justify-between h-14 px-4 md:hidden">
      <div class="flex items-center gap-2">
        <!-- Desktop sidebar toggle -->
        <button
          class="hidden items-center justify-center w-9 h-9 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary active:scale-95 transition-all duration-200"
          @click="uiStore.toggleSidebar()"
        >
          <el-icon :size="20"><Fold /></el-icon>
        </button>

        <!-- Mobile menu toggle -->
        <button
          class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-bg-hover text-text-secondary"
          @click="emit('openSidebar')"
        >
          <el-icon :size="20"><Menu /></el-icon>
        </button>

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 shrink-0">
          <img src="/favicon.svg" alt="Perilla" class="w-8 h-8" />
        </router-link>
      </div>

      <div class="flex items-center gap-1 sm:gap-2">
        <button
          class="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-bg-hover text-text-secondary active:scale-95 transition-all duration-200"
          @click="router.push('/search')"
        >
          <el-icon :size="20"><Search /></el-icon>
        </button>

        <!-- Auth buttons / User menu -->
        <template v-if="authStore.isAuthenticated">
          <router-link
            to="/messages"
            class="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary active:scale-95 transition-all duration-200"
          >
            <el-icon :size="20"><ChatDotRound /></el-icon>
            <span
              v-if="chatStore.unreadCount > 0"
              class="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1"
            >
              {{ chatStore.unreadCount > 99 ? '99+' : chatStore.unreadCount }}
            </span>
          </router-link>

          <router-link
            to="/notifications"
            class="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary active:scale-95 transition-all duration-200"
          >
            <el-icon :size="20"><Bell /></el-icon>
            <span
              v-if="notificationStore.unreadCount > 0"
              class="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1"
            >
              {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
            </span>
          </router-link>

          <el-dropdown trigger="click" placement="bottom-end">
            <button class="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary/50 transition-all duration-200">
              <img
                :src="authStore.user?.avatar"
                :alt="authStore.user?.nickname"
                class="w-full h-full object-cover"
              />
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/me')">
                  <el-icon><User /></el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item @click="router.push(`/user/${authStore.user!.id}`)">
                  <el-icon><HomeFilled /></el-icon>
                  <span>我的主页</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" round size="small" @click="router.push('/login')">登录</el-button>
        </template>
      </div>
    </div>

    <div class="relative hidden md:flex h-full items-start justify-center px-8 pt-7">
      <button
        class="absolute left-6 top-8 flex items-center justify-center w-10 h-10 rounded-full bg-bg-secondary/70 hover:bg-bg-hover text-text-secondary hover:text-text-primary active:scale-95 transition-all duration-200"
        @click="uiStore.toggleSidebar()"
      >
        <el-icon :size="20"><Fold /></el-icon>
      </button>

      <form class="desktop-search" @submit.prevent="handleSearch">
        <el-input
          v-model="searchQuery"
          placeholder="登录探索更多内容"
          size="large"
          clearable
          class="search-input"
        >
          <template #suffix>
            <button
              type="submit"
              class="search-submit"
              aria-label="搜索"
            >
              <el-icon :size="22"><Search /></el-icon>
            </button>
          </template>
        </el-input>
      </form>
    </div>
  </header>
</template>

<style scoped>
.desktop-search {
  width: min(760px, calc(100vw - 420px));
  filter: drop-shadow(0 18px 44px rgba(0, 0, 0, 0.32));
}
.search-input :deep(.el-input__wrapper) {
  min-height: 48px;
  padding: 0 8px 0 22px;
  border-radius: 999px;
  background-color: rgba(42, 42, 48, 0.72);
  box-shadow: none;
  border: 1px solid var(--color-border-light);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.search-input :deep(.el-input__wrapper:hover) {
  background-color: rgba(50, 50, 58, 0.86);
}
.search-input :deep(.el-input__wrapper.is-focus) {
  background-color: #1A1A1F;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}
.search-input :deep(.el-input__inner) {
  color: var(--color-text-primary);
}
.search-input :deep(.el-input__inner::placeholder) {
  color: var(--color-text-tertiary);
}
.search-submit {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}
.search-submit:hover {
  background: var(--color-bg-hover);
}
.search-submit:active {
  transform: scale(0.94);
}

@media (max-width: 980px) {
  .desktop-search {
    width: min(620px, calc(100vw - 220px));
  }
}
</style>
