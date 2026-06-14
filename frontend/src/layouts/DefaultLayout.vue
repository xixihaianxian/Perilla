<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '@/stores/uiStore'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import MobileNav from '@/components/layout/MobileNav.vue'

const route = useRoute()
const uiStore = useUIStore()
const mobileSidebarOpen = ref(false)

const showSidebar = computed(() => {
  const noSidebarRoutes = ['Login', 'Register']
  return !noSidebarRoutes.includes(route.name as string)
})

function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-bg-page">
    <AppHeader @open-sidebar="mobileSidebarOpen = true" />

    <div class="flex">
      <!-- Mobile sidebar overlay -->
      <transition name="overlay">
        <div
          v-if="mobileSidebarOpen"
          class="md:hidden fixed inset-0 bg-black/60 z-40"
          @click="closeMobileSidebar"
        />
      </transition>

      <!-- Mobile sidebar drawer -->
      <transition name="drawer">
        <aside
          v-if="showSidebar && mobileSidebarOpen"
          class="md:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-[#141418] z-50 shadow-xl"
        >
          <div class="flex items-center justify-between px-4 h-14 border-b border-border">
            <span class="text-lg font-bold text-primary">Perilla</span>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-hover text-text-secondary"
              @click="closeMobileSidebar"
            >
              <el-icon :size="20"><Close /></el-icon>
            </button>
          </div>
          <div class="h-[calc(100%-3.5rem)] overflow-y-auto">
            <AppSidebar />
          </div>
        </aside>
      </transition>

      <!-- Desktop sidebar -->
      <aside
        v-if="showSidebar"
        class="hidden md:block fixed left-0 top-0 bottom-0 transition-all duration-300 bg-[#141418] z-40"
        :class="uiStore.sidebarCollapsed ? 'w-[68px]' : 'w-[244px]'"
      >
        <AppSidebar />
      </aside>

      <!-- Main content -->
      <main
        class="flex-1 min-h-screen pt-14 md:pt-[132px] transition-all duration-300"
        :class="{
          'md:ml-[244px]': showSidebar && !uiStore.sidebarCollapsed,
          'md:ml-[68px]': showSidebar && uiStore.sidebarCollapsed,
        }"
      >
        <div class="mx-auto pb-16 md:pb-10">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile bottom nav -->
    <MobileNav v-if="showSidebar" />
  </div>
</template>
