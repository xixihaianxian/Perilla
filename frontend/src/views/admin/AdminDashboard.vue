<script setup lang="ts">
import { ref, onMounted } from 'vue'; import type { DashboardStats } from '@/types'; import { adminApi } from '@/api/admin'; import StatCard from '@/components/admin/StatCard.vue'
const stats = ref<DashboardStats | null>(null)
onMounted(async () => { const res = await adminApi.getDashboardStats(); stats.value = res.data })
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-text-primary mb-6">数据概览</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon="User" label="总用户数" :value="stats?.total_users || 0" :trend="12" color="#3B82F6" />
      <StatCard icon="Document" label="总笔记数" :value="stats?.total_notes || 0" :trend="8" color="#22C55E" />
      <StatCard icon="ChatDotRound" label="总评论数" :value="stats?.total_comments || 0" :trend="15" color="#F59E0B" />
      <StatCard icon="Warning" label="待处理举报" :value="stats?.active_reports || 0" :trend="-5" color="#EF4444" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-surface rounded-xl p-6 shadow-sm border border-border-card">
        <h2 class="text-base font-semibold text-text-card-primary mb-4">快捷操作</h2>
        <div class="grid grid-cols-2 gap-3">
          <router-link to="/admin/users" class="p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition-colors text-sm"><el-icon :size="20" class="text-primary mb-2"><User /></el-icon><p class="font-medium text-text-card-primary">用户管理</p></router-link>
          <router-link to="/admin/content" class="p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition-colors text-sm"><el-icon :size="20" class="text-primary mb-2"><Document /></el-icon><p class="font-medium text-text-card-primary">内容审核</p></router-link>
          <router-link to="/admin/reports" class="p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition-colors text-sm"><el-icon :size="20" class="text-primary mb-2"><Warning /></el-icon><p class="font-medium text-text-card-primary">举报管理</p></router-link>
          <router-link to="/admin/tags" class="p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition-colors text-sm"><el-icon :size="20" class="text-primary mb-2"><CollectionTag /></el-icon><p class="font-medium text-text-card-primary">标签管理</p></router-link>
        </div>
      </div>
      <div class="bg-surface rounded-xl p-6 shadow-sm border border-border-card">
        <h2 class="text-base font-semibold text-text-card-primary mb-4">系统状态</h2>
        <div class="space-y-4">
          <div class="flex justify-between text-sm"><span class="text-text-card-secondary">系统版本</span><span class="text-text-card-primary font-medium">v1.0.0</span></div>
          <div class="flex justify-between text-sm"><span class="text-text-card-secondary">今日新增用户</span><span class="text-text-card-primary font-medium">{{ stats?.new_users_today || 0 }}</span></div>
          <div class="flex justify-between text-sm"><span class="text-text-card-secondary">今日新增笔记</span><span class="text-text-card-primary font-medium">{{ stats?.new_notes_today || 0 }}</span></div>
          <div class="flex justify-between text-sm"><span class="text-text-card-secondary">待审核内容</span><span class="text-text-card-primary font-medium">{{ stats?.pending_reviews || 0 }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
