<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { followApi } from '@/api/follow'
import { ElMessage } from 'element-plus'

interface Props { userId: string; isFollowing: boolean; size?: 'small' | 'default' | 'large' }
const props = withDefaults(defineProps<Props>(), { size: 'default' })
const emit = defineEmits<{ 'update:isFollowing': [value: boolean] }>()

const authStore = useAuthStore()
const following = ref(props.isFollowing)
const loading = ref(false)
const hoverUnfollow = ref(false)

async function toggle() {
  if (!authStore.isAuthenticated) { ElMessage.warning('请先登录'); return }
  loading.value = true
  try {
    if (following.value) { await followApi.unfollow(authStore.user!.id, props.userId) }
    else { await followApi.follow(authStore.user!.id, props.userId) }
    following.value = !following.value; emit('update:isFollowing', following.value)
  } catch { /* ignore */ } finally { loading.value = false }
}
</script>

<template>
  <button
    class="rounded-full font-medium transition-all duration-300 text-sm active:scale-95"
    :class="[following ? 'bg-bg-tertiary text-text-secondary hover:bg-red-500/10 hover:text-red-400' : 'bg-primary text-white hover:bg-primary-dark hover:shadow-md',
      size === 'small' ? 'px-3 py-1 text-xs' : size === 'large' ? 'px-6 py-2' : 'px-4 py-1.5']"
    :disabled="loading"
    @mouseenter="hoverUnfollow = following" @mouseleave="hoverUnfollow = false" @click.stop="toggle"
  >
    <template v-if="loading"><el-icon :size="14" class="animate-spin"><Loading /></el-icon></template>
    <template v-else-if="hoverUnfollow">取消关注</template>
    <template v-else>{{ following ? '已关注' : '关注' }}</template>
  </button>
</template>
