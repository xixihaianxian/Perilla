import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const currentProfile = ref<User | null>(null)
  const profileCache = ref<Map<string, User>>(new Map())

  async function fetchProfile(userId: string) {
    // Will be implemented in Phase 7
    const cached = profileCache.value.get(userId)
    if (cached) {
      currentProfile.value = cached
      return cached
    }
    return null
  }

  function getUserById(userId: string): User | undefined {
    return profileCache.value.get(userId)
  }

  return {
    currentProfile,
    profileCache,
    fetchProfile,
    getUserById,
  }
})
