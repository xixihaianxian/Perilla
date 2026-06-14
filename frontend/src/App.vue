<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'default'
  switch (layout) {
    case 'auth': return AuthLayout
    case 'admin': return AdminLayout
    case 'blank': return BlankLayout
    default: return DefaultLayout
  }
})
</script>

<template>
  <component :is="layoutComponent">
    <router-view v-slot="{ Component, route: r }">
      <transition name="page" mode="out-in">
        <component :is="Component" :key="r.path" />
      </transition>
    </router-view>
  </component>
</template>
