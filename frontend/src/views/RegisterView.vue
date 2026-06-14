<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ username: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  if (!form.username || !form.email || !form.password) { error.value = '请填写所有必填字段'; return }
  if (form.password !== form.confirmPassword) { error.value = '两次密码输入不一致'; return }
  if (form.password.length < 6) { error.value = '密码长度不能少于6位'; return }
  loading.value = true; error.value = ''
  try { await authStore.register({ username: form.username, email: form.email, password: form.password }); router.push('/') }
  catch { error.value = '注册失败，请稍后重试' } finally { loading.value = false }
}
</script>

<template>
  <div class="w-full max-w-md bg-surface rounded-xl shadow-lg p-8 border border-border-card">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Perilla</h1>
      <p class="text-text-card-secondary">创建你的账号</p>
    </div>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <el-input v-model="form.username" placeholder="用户名" size="large" clearable />
      <el-input v-model="form.email" type="email" placeholder="邮箱" size="large" clearable />
      <el-input v-model="form.password" type="password" placeholder="密码（至少6位）" size="large" show-password />
      <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" size="large" show-password />
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <el-button type="primary" size="large" class="w-full" :loading="loading" native-type="submit">注册</el-button>
    </form>
    <p class="text-center mt-6 text-text-card-tertiary text-sm">已有账号？<router-link to="/login" class="text-primary hover:underline">立即登录</router-link></p>
  </div>
</template>
