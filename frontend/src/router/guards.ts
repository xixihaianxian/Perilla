import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export function setupGuards(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    // Set document title
    document.title = `${to.meta.title || 'Perilla'} - Perilla`

    // Initialize auth store (needed outside of component context)
    const authStore = useAuthStore()

    // Restore user info if token exists but user data is lost (e.g. after page refresh)
    if (authStore.token && !authStore.user) {
      await authStore.fetchCurrentUser()
    }

    // Check if user is authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    // Check if guest-only route (login/register)
    if (to.meta.guest && authStore.isAuthenticated) {
      return next({ name: 'Home' })
    }

    // Check admin route
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return next({ name: 'Home' })
    }

    next()
  })
}
