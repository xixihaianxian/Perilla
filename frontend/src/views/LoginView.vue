<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const form = reactive({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!form.username || !form.password) { error.value = '请输入用户名和密码'; return }
  loading.value = true; error.value = ''
  try {
    await authStore.login(form.username, form.password)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch { error.value = '用户名或密码错误' } finally { loading.value = false }
}
</script>

<template>
  <div class="w-full max-w-md bg-surface rounded-xl shadow-lg p-8 border border-border-card">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Perilla</h1>
      <p class="text-text-card-secondary">登录你的账号</p>
    </div>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <el-input v-model="form.username" placeholder="用户名或邮箱" size="large" clearable />
      <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password clearable />
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <el-button type="primary" size="large" class="w-full" :loading="loading" native-type="submit">登录</el-button>
    </form>
    <p class="text-center mt-6 text-text-card-tertiary text-sm">还没有账号？<router-link to="/register" class="text-primary hover:underline">立即注册</router-link></p>
  </div>
</template>
