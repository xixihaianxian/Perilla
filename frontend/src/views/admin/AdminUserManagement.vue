<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '@/types'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'
import DataTable from '@/components/admin/DataTable.vue'

const users = ref<User[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)

const columns = [
  { prop: 'nickname', label: '昵称', slot: 'nickname' },
  { prop: 'email', label: '邮箱' },
  { prop: 'role', label: '角色' },
  { prop: 'status', label: '状态', slot: 'status' },
  { prop: 'created_at', label: '注册时间' },
  { prop: 'actions', label: '操作', slot: 'actions', width: '180' },
]

async function fetchUsers() {
  loading.value = true
  try {
    const res = await adminApi.getUsers(page.value)
    users.value = res.data.items as User[]
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function toggleStatus(user: User) {
  const newStatus: string = user.status === 'active' ? 'banned' : 'active'
  await adminApi.updateUserStatus(user.id, newStatus)
  // Use Object.assign to avoid type error with readonly status
  Object.assign(user, { status: newStatus })
  ElMessage.success(newStatus === 'banned' ? '已封禁' : '已解封')
}

onMounted(() => fetchUsers())
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">用户管理</h1>

    <div class="bg-white rounded-xl shadow-sm">
      <DataTable
        :columns="columns"
        :data="users as any"
        :loading="loading"
        :total="total"
        :page="page"
        @page-change="page = $event; fetchUsers()"
      >
        <template #nickname="{ row }">
          <div class="flex items-center gap-2">
            <img :src="row.avatar" class="w-7 h-7 rounded-full object-cover" />
            <span class="text-sm">{{ row.nickname }}</span>
          </div>
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small" effect="plain">
            {{ row.status === 'active' ? '正常' : '已封禁' }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <div class="flex gap-1">
            <el-button size="small" @click="toggleStatus(row as User)">
              {{ row.status === 'active' ? '封禁' : '解封' }}
            </el-button>
            <el-button size="small" type="danger" plain @click="adminApi.deleteUser(row.id); fetchUsers()">
              删除
            </el-button>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
