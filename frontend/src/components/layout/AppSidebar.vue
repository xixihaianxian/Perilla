<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { getAvatarUrl } from '@/utils/avatar'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const showBenefits = ref(false)
const moreMenuOpen = ref(false)

interface NavItem {
  name: string
  path: string
  icon: string
  requiresAuth?: boolean
}

const navItems: NavItem[] = [
  { name: '首页', path: '/', icon: 'HomeFilled' },
  { name: '发现', path: '/explore', icon: 'Compass' },
  { name: '关注', path: '/?tab=following', icon: 'Star' },
  { name: '发布', path: '/note/create', icon: 'Plus', requiresAuth: true },
  { name: '消息', path: '/messages', icon: 'ChatDotRound', requiresAuth: true },
]

const collapsed = computed(() => uiStore.sidebarCollapsed)

// Force re-trigger the Perilla text roll-in animation when sidebar expands
const perillaAnimKey = ref(0)
watch(collapsed, (val) => {
  if (!val) {
    perillaAnimKey.value++
  }
})

// 每8秒自动重新播放 Perilla 文字动画
let animTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  animTimer = setInterval(() => {
    perillaAnimKey.value++
  }, 5000)
})
onUnmounted(() => {
  if (animTimer) clearInterval(animTimer)
})

function handleLogout() {
  moreMenuOpen.value = false
  authStore.logout()
  router.push('/')
}

function goSettings() {
  moreMenuOpen.value = false
  router.push('/settings')
}

function isActive(path: string): boolean {
  const [basePath, query] = path.split('?')

  // Root path: exact match only, not when a tab query is active
  if (basePath === '/' && !query) {
    return route.path === '/' && route.query.tab !== 'following'
  }

  // Root path with query (e.g., /?tab=following): match only when on root with same tab
  if (basePath === '/' && query) {
    if (route.path !== '/') return false
    const params = new URLSearchParams(query)
    return params.get('tab') === route.query.tab
  }

  // Other paths: prefix match on base path
  return route.path.startsWith(basePath)
}
</script>

<template>
  <nav class="h-full flex flex-col overflow-y-auto overflow-x-hidden bg-[#141418] px-3 py-5">
    <!-- Logo + active indicator area -->
    <transition name="fade" mode="out-in">
      <router-link
        v-if="!collapsed"
        key="logo-expanded"
        to="/"
        class="flex items-center gap-3 px-3 pb-9 pt-2 shrink-0"
      >
        <span class="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/12 ring-1 ring-primary/20">
          <img src="/favicon.svg" alt="Perilla" class="w-8 h-8" />
        </span>
        <span class="text-xl font-bold text-primary leading-none perilla-text" :key="perillaAnimKey">
          <span
            v-for="(char, i) in 'Perilla'.split('')"
            :key="i"
            class="perilla-char"
            :style="{ animationDelay: `${i * 0.08}s` }"
          >{{ char }}</span>
        </span>
      </router-link>
      <div v-else key="logo-collapsed" class="flex justify-center pb-8 pt-2">
        <span class="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/12 ring-1 ring-primary/20">
          <img src="/favicon.svg" alt="Perilla" class="w-7 h-7" />
        </span>
      </div>
    </transition>

    <!-- Navigation items -->
    <ul class="space-y-2 flex-1">
      <li v-for="item in navItems" :key="item.path">
        <router-link
          :to="item.requiresAuth && !authStore.isAuthenticated ? '/login' : item.path"
          class="nav-item relative flex items-center gap-3 px-3.5 py-3.5 rounded-[22px] transition-all duration-200 overflow-visible"
          :class="
            isActive(item.path)
              ? 'nav-item--active text-text-primary font-bold shadow-sm'
              : 'nav-item--inactive text-text-secondary hover:text-text-primary'
          "
        >
          <!-- Active left indicator bar -->
          <div
            v-if="isActive(item.path)"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary rounded-full"
          />
          <span
            class="flex items-center justify-center shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            :class="collapsed ? 'w-full' : 'w-8'"
          >
          <el-icon :size="23" :class="{ 'opacity-55': !isActive(item.path) }">
            <component :is="item.icon" />
          </el-icon>
          </span>
          <transition name="fade">
            <span v-if="!collapsed" class="text-[16px] whitespace-nowrap">{{ item.name }}</span>
          </transition>
        </router-link>
      </li>
    </ul>

    <!-- Bottom area: Login prompt / User info -->
    <div class="mt-auto pt-5 pb-2">
      <!-- Not logged in: login prompt with benefits -->
      <template v-if="!authStore.isAuthenticated">
        <transition name="fade" mode="out-in">
          <div v-if="!collapsed" key="login-expanded" class="rounded-3xl bg-black/35 px-4 py-4 ring-1 ring-white/5">
            <p class="text-[14px] text-text-secondary leading-relaxed mb-4">
              马上登录即可<br />
              刷到更适合你的优质内容
            </p>

            <div class="relative"
              @mouseenter="showBenefits = true"
              @mouseleave="showBenefits = false"
            >
              <router-link
                to="/login"
                class="flex items-center justify-center w-full py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-[15px] transition-all duration-200 hover:shadow-lg"
              >
                登录
              </router-link>

              <!-- Benefits popover on hover -->
              <transition name="fade">
                <div
                  v-if="showBenefits"
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 bg-[#222228] border border-border rounded-xl shadow-xl z-50"
                >
                  <div class="space-y-2 text-xs text-text-secondary">
                    <div class="flex items-start gap-2">
                      <el-icon :size="14" class="text-primary mt-0.5 shrink-0"><Search /></el-icon>
                      <span>搜索最新种草、拔草信息</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <el-icon :size="14" class="text-primary mt-0.5 shrink-0"><CollectionTag /></el-icon>
                      <span>查看收藏、点赞的笔记</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <el-icon :size="14" class="text-primary mt-0.5 shrink-0"><ChatDotRound /></el-icon>
                      <span>与他人更好地互动、交流</span>
                    </div>
                  </div>
                  <!-- Arrow -->
                  <div class="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#222228]" />
                </div>
              </transition>
            </div>
          </div>

          <!-- Collapsed: just icon -->
          <div v-else key="login-collapsed" class="flex justify-center">
            <router-link
              to="/login"
              class="flex items-center justify-center w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors"
            >
              <el-icon :size="16"><User /></el-icon>
            </router-link>
          </div>
        </transition>
      </template>

      <!-- Logged in: user info -->
      <template v-else>
        <transition name="fade" mode="out-in">
          <router-link
            v-if="!collapsed"
            key="user-expanded"
            to="/me"
            class="flex items-center gap-3 rounded-3xl bg-black/35 px-4 py-4 ring-1 ring-white/5 hover:bg-bg-secondary transition-colors"
          >
            <img
              :src="getAvatarUrl(authStore.user?.avatar)"
              class="w-10 h-10 rounded-full object-cover ring-2 ring-bg-tertiary"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary truncate">{{ authStore.user?.nickname }}</p>
              <p class="text-xs text-text-tertiary">查看主页</p>
            </div>
          </router-link>
          <div v-else key="user-collapsed" class="flex justify-center">
            <img :src="getAvatarUrl(authStore.user?.avatar)" class="w-8 h-8 rounded-full object-cover ring-2 ring-bg-tertiary" />
          </div>
        </transition>
      </template>
    </div>

    <!-- Bottom links -->
    <transition name="fade">
      <div v-if="!collapsed" class="pb-1 pt-5">
        <div class="space-y-3">
          <div class="more-wrap">
            <a
              href="#"
              class="more-trigger flex items-center gap-3 px-3.5 text-[15px] font-semibold text-text-secondary hover:text-text-primary transition-colors"
              :class="{ 'more-trigger--open': moreMenuOpen }"
              @click.prevent="moreMenuOpen = !moreMenuOpen"
            >
              <el-icon :size="21" class="more-trigger__icon"><Menu /></el-icon>
              更多
            </a>
            <transition name="more-drop">
              <div v-if="moreMenuOpen" class="more-dropdown">
                <button class="more-item" @click="goSettings">
                  <el-icon :size="16"><Setting /></el-icon>
                  <span>设置与隐私</span>
                </button>
                <button class="more-item">
                  <el-icon :size="16"><QuestionFilled /></el-icon>
                  <span>帮助与反馈</span>
                </button>
                <div class="more-divider"></div>
                <button class="more-item more-item--danger" @click="handleLogout">
                  <el-icon :size="16"><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </button>
              </div>
            </transition>
          </div>
          <a href="#" class="flex items-center gap-3 px-3.5 text-[15px] font-semibold text-text-secondary hover:text-text-primary transition-colors">
            <el-icon :size="21"><InfoFilled /></el-icon>
            关于我们
          </a>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* === Nav item background states === */
.nav-item--active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(139, 92, 246, 0.06) 100%);
}

.nav-item--inactive {
  background: transparent;
}

.nav-item--inactive:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.03) 100%);
}

/* === Perilla letter-by-letter roll-in animation === */
@keyframes perillaRollIn {
  0% {
    opacity: 0;
    transform: translateY(-16px) rotateX(-80deg);
  }
  60% {
    opacity: 1;
    transform: translateY(2px) rotateX(10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.perilla-text {
  display: inline-flex;
  perspective: 200px;
}

.perilla-char {
  display: inline-block;
  opacity: 0;
  animation: perillaRollIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* === "更多" dropdown === */
.more-wrap {
  position: relative;
}

/* 触发器图标的旋转指示 */
.more-trigger {
  cursor: pointer;
}

.more-trigger__icon {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

.more-trigger--open .more-trigger__icon {
  transform: rotate(90deg);
  color: var(--color-primary);
}

.more-dropdown {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  width: 180px;
  background: #1E1E24;
  border: 1px solid #2E2E36;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 6px;
  z-index: 100;
  /* 动画起点固定在左下角，与触发按钮位置呼应 */
  transform-origin: bottom left;
}

/* ===== 下拉面板进入/退出过渡 ===== */
.more-drop-enter-active {
  transition:
    opacity 0.22s ease-out,
    transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.more-drop-leave-active {
  transition:
    opacity 0.16s ease-in,
    transform 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.more-drop-enter-from,
.more-drop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.92);
}

.more-drop-enter-to,
.more-drop-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 子项依次淡入（仅在打开时生效） */
.more-drop-enter-active .more-item,
.more-drop-enter-active .more-divider {
  animation: more-item-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.more-drop-enter-active .more-item:nth-child(1) { animation-delay: 0.06s; }
.more-drop-enter-active .more-item:nth-child(2) { animation-delay: 0.10s; }
.more-drop-enter-active .more-divider          { animation-delay: 0.13s; }
.more-drop-enter-active .more-item:nth-child(4) { animation-delay: 0.16s; }

@keyframes more-item-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.more-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  color: #E4E4E7;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease, transform 0.15s ease;
}

.more-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(2px);
}

.more-item--danger {
  color: #F87171;
}

.more-item--danger:hover {
  background: rgba(248, 113, 113, 0.1);
}

.more-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 4px 0;
}
</style>
