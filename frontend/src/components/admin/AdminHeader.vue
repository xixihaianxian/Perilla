<script setup lang="ts">import { useAuthStore } from '@/stores/authStore'</script>
<template>
  <header class="fixed top-0 left-0 right-0 h-14 bg-[#1A1A1F]/85 backdrop-blur-xl border-b border-border z-50 flex items-center justify-between px-6">
    <div class="flex items-center gap-3">
      <span class="text-lg font-bold text-primary">Perilla</span>
      <span class="px-2 py-0.5 text-xs bg-primary/15 text-primary rounded-full font-medium">管理后台</span>
    </div>
    <div class="flex items-center gap-3"><span class="text-sm text-text-secondary">{{ useAuthStore().user?.nickname }}</span></div>
  </header>
</template>
