<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { userApi } from '@/api/user'
import type { UserUpdateDTO } from '@/types'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const form = ref<UserUpdateDTO>({
  nickname: authStore.user?.nickname || '',
  bio: authStore.user?.bio || '',
  location: authStore.user?.location || '',
  website: authStore.user?.website || '',
  gender: authStore.user?.gender || 'other',
})
const saving = ref(false)

async function handleSave() {
  if (!authStore.user) return
  saving.value = true
  try {
    const res = await userApi.updateProfile(authStore.user.id, form.value)
    if (authStore.user) authStore.user = res.data
    ElMessage.success('保存成功')
  } catch { ElMessage.error('保存失败') } finally { saving.value = false }
}

function handleLogout() { authStore.logout(); router.push('/') }
</script>

<template>
  <div class="page-container max-w-3xl">
    <h1 class="text-2xl font-bold text-text-primary py-6">个人中心</h1>
    <div class="bg-surface rounded-xl shadow-sm border border-border-card divide-y divide-border-card">
      <div class="p-6">
        <h2 class="text-base font-semibold text-text-card-primary mb-4">个人资料</h2>
        <div class="flex items-center gap-4 mb-6">
          <img v-if="authStore.user" :src="authStore.user.avatar" class="w-16 h-16 rounded-full object-cover" />
          <div>
            <p class="font-medium text-text-card-primary">{{ authStore.user?.nickname }}</p>
            <p class="text-sm text-text-card-tertiary">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <div class="space-y-4 max-w-md">
          <div><label class="text-sm text-text-card-secondary mb-1 block">昵称</label><el-input v-model="form.nickname" maxlength="30" /></div>
          <div><label class="text-sm text-text-card-secondary mb-1 block">个人简介</label><el-input v-model="form.bio" type="textarea" :rows="3" maxlength="200" /></div>
          <div><label class="text-sm text-text-card-secondary mb-1 block">所在地</label><el-input v-model="form.location" maxlength="50" placeholder="如：北京" /></div>
          <div><label class="text-sm text-text-card-secondary mb-1 block">个人网站</label><el-input v-model="form.website" maxlength="100" placeholder="https://" /></div>
          <div><label class="text-sm text-text-card-secondary mb-1 block">性别</label><el-select v-model="form.gender" class="w-full"><el-option label="保密" value="other" /><el-option label="男" value="male" /><el-option label="女" value="female" /></el-select></div>
        </div>
        <el-button type="primary" :loading="saving" class="mt-6" @click="handleSave">保存修改</el-button>
      </div>
      <div class="p-6">
        <h2 class="text-base font-semibold mb-2 text-red-400">危险操作</h2>
        <p class="text-sm text-text-card-tertiary mb-4">退出当前登录账号</p>
        <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
      </div>
    </div>
  </div>
</template>
