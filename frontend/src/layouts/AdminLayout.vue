<script setup lang="ts">
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-bg-page">
    <AdminHeader />
    <div class="flex pt-14">
      <aside class="fixed left-0 top-14 bottom-0 w-56 bg-[#141418] border-r border-border z-40 overflow-y-auto">
        <AdminSidebar />
      </aside>
      <main class="flex-1 ml-56 min-h-[calc(100vh-3.5rem)]">
        <slot />
      </main>
    </div>
  </div>
</template>
