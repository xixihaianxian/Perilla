import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { getToken, setToken, removeToken } from '@/utils/token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(getToken())

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(username: string, password: string) {
    // Will be implemented in Phase 4 with mock API
    const { authApi } = await import('@/api/auth')
    const res = await authApi.login({ username, password })
    token.value = res.data.token
    user.value = res.data.user
    setToken(res.data.token)
  }

  async function register(data: { username: string; email: string; password: string }) {
    const { authApi } = await import('@/api/auth')
    const res = await authApi.register(data)
    token.value = res.data.token
    user.value = res.data.user
    setToken(res.data.token)
  }

  function logout() {
    token.value = null
    user.value = null
    removeToken()
  }

  async function fetchCurrentUser() {
    if (!token.value) return
    try {
      const { authApi } = await import('@/api/auth')
      const res = await authApi.getCurrentUser()
      user.value = res.data
    } catch {
      logout()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchCurrentUser,
  }
})
