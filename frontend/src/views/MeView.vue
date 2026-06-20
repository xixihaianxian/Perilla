<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { userApi } from '@/api/user'
import type { Note } from '@/types'
import { useRouter } from 'vue-router'
import NoteWaterfall from '@/components/content/NoteWaterfall.vue'


const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)

// 来自 /api/user/info 的用户信息
const profileNickname = ref('')
const profileBio = ref('')
const profileGender = ref<number>(2)

// Tab 状态
const activeTab = ref<'notes' | 'likes' | 'favorites'>('notes')

// 笔记列表
const notes = ref<Note[]>([])
const notePage = ref(1)
const hasMoreNotes = ref(true)
const loadingNotes = ref(false)

// 点赞列表
const likedNotes = ref<Note[]>([])
const likePage = ref(1)
const hasMoreLikes = ref(true)
const loadingLikes = ref(false)

// 收藏列表
const favoriteNotes = ref<Note[]>([])
const favPage = ref(1)
const hasMoreFavorites = ref(true)
const loadingFavorites = ref(false)

// 获取当前用户的 userId
const userId = computed(() => authStore.user?.id || '')

// ========== 笔记 ==========
async function fetchNotes(reset = false) {
  if (loadingNotes.value || !userId.value) return
  if (reset) { notePage.value = 1; notes.value = []; hasMoreNotes.value = true }
  loadingNotes.value = true
  try {
    const res = await userApi.getUserNotes(userId.value, notePage.value)
    if (reset) { notes.value = res.data.items } else { notes.value.push(...res.data.items) }
    hasMoreNotes.value = res.data.items.length >= res.data.pageSize
    notePage.value++
  } catch { /* ignore */ } finally { loadingNotes.value = false }
}

// ========== 点赞 ==========
async function fetchLikes(reset = false) {
  if (loadingLikes.value || !userId.value) return
  if (reset) { likePage.value = 1; likedNotes.value = []; hasMoreLikes.value = true }
  loadingLikes.value = true
  try {
    const res = await userApi.getUserLikes(userId.value, likePage.value)
    if (reset) { likedNotes.value = res.data.items } else { likedNotes.value.push(...res.data.items) }
    hasMoreLikes.value = res.data.items.length >= res.data.pageSize
    likePage.value++
  } catch { /* ignore */ } finally { loadingLikes.value = false }
}

// ========== 收藏 ==========
async function fetchFavorites(reset = false) {
  if (loadingFavorites.value || !userId.value) return
  if (reset) { favPage.value = 1; favoriteNotes.value = []; hasMoreFavorites.value = true }
  loadingFavorites.value = true
  try {
    const res = await userApi.getUserFavorites(userId.value, favPage.value)
    if (reset) { favoriteNotes.value = res.data.items } else { favoriteNotes.value.push(...res.data.items) }
    hasMoreFavorites.value = res.data.items.length >= res.data.pageSize
    favPage.value++
  } catch { /* ignore */ } finally { loadingFavorites.value = false }
}

// Tab 切换时自动加载对应数据
function switchTab(tab: 'notes' | 'likes' | 'favorites') {
  activeTab.value = tab
  if (tab === 'notes' && notes.value.length === 0) fetchNotes(true)
  else if (tab === 'likes' && likedNotes.value.length === 0) fetchLikes(true)
  else if (tab === 'favorites' && favoriteNotes.value.length === 0) fetchFavorites(true)
}

onMounted(async () => {
  try {
    const res = await userApi.getUserInfo()
    const body = res.data
    if (body.code === 200 && body.data.userInfo) {
      const info = body.data.userInfo
      profileNickname.value = info.nickname || ''
      profileBio.value = info.bio || ''
      profileGender.value = info.gender ?? 2
      // 同步更新 authStore
      if (authStore.user) {
        Object.assign(authStore.user, info)
      }
    }
  } catch {
    // 请求失败时保留 authStore 中的现有数据
  } finally {
    loading.value = false
  }
  // 初始加载笔记
  fetchNotes(true)
})

function handleLogout() { authStore.logout(); router.push('/') }
</script>

<template>
  <div class="page-container max-w-5xl">
    <!-- 个人资料头部：纯信息展示 -->
    <div class="me-card">
      <div class="me-profile-header">
        <div class="me-avatar-wrap">
          <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" class="me-avatar" />
          <div v-else class="me-avatar me-avatar--empty" />
        </div>
        <div class="me-header-info">
          <div class="me-name-row">
            <h3 class="me-username">{{ profileNickname || authStore.user?.nickname || '未设置昵称' }}</h3>
            <el-icon v-if="profileGender === 0" :size="16" class="me-gender-icon me-gender-female"><Female /></el-icon>
            <el-icon v-else-if="profileGender === 1" :size="16" class="me-gender-icon me-gender-male"><Male /></el-icon>
          </div>
          <p v-if="profileBio" class="me-bio">{{ profileBio }}</p>
        </div>
      </div>
    </div>

    <!-- Tab 切换栏 -->
    <div class="me-tabs">
      <button
        class="me-tab-item"
        :class="{ active: activeTab === 'notes' }"
        @click="switchTab('notes')"
      >
        笔记
      </button>
      <button
        class="me-tab-item"
        :class="{ active: activeTab === 'likes' }"
        @click="switchTab('likes')"
      >
        点赞
      </button>
      <button
        class="me-tab-item"
        :class="{ active: activeTab === 'favorites' }"
        @click="switchTab('favorites')"
      >
        收藏
      </button>
    </div>

    <!-- 笔记 Tab -->
    <div v-if="activeTab === 'notes'" class="me-tab-content">
      <NoteWaterfall
        :notes="notes"
        :loading="loadingNotes"
        :has-more="hasMoreNotes"
        empty-text="还没有发布笔记"
        empty-type="notes"
        @load-more="fetchNotes()"
      />
    </div>

    <!-- 点赞 Tab -->
    <div v-else-if="activeTab === 'likes'" class="me-tab-content">
      <NoteWaterfall
        :notes="likedNotes"
        :loading="loadingLikes"
        :has-more="hasMoreLikes"
        empty-text="还没有点赞的笔记"
        empty-type="notes"
        @load-more="fetchLikes()"
      />
    </div>

    <!-- 收藏 Tab -->
    <div v-else class="me-tab-content">
      <NoteWaterfall
        :notes="favoriteNotes"
        :loading="loadingFavorites"
        :has-more="hasMoreFavorites"
        empty-text="还没有收藏的笔记"
        empty-type="notes"
        @load-more="fetchFavorites()"
      />
    </div>

    <!-- 危险操作区 -->
    <div class="me-danger-zone">
      <div class="me-danger-content">
        <div class="me-danger-text">
          <h2 class="me-danger-title">账号管理</h2>
          <p class="me-danger-desc">退出当前登录的账号</p>
        </div>
        <el-button class="me-logout-btn" @click="handleLogout">退出登录</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================
   卡片容器
   ========================================== */
.me-card {
  background: #1C1C22;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.03);
  margin-bottom: 12px;
}

/* ==========================================
   Profile 头部（横向布局 + 信息展示）
   ========================================== */
.me-profile-header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.me-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(139, 92, 246, 0.35);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
}

.me-avatar--empty {
  background: #2D2D34;
  border: 3px solid #3A3A42;
  box-shadow: none;
}

.me-avatar-wrap {
  flex-shrink: 0;
}

.me-header-info {
  flex: 1;
  min-width: 0;
}

.me-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.me-username {
  font-size: 20px;
  font-weight: 700;
  color: #F1F1F3;
  margin: 0;
}

.me-gender-icon {
  flex-shrink: 0;
}

.me-gender-female {
  color: #F472B6;
}

.me-gender-male {
  color: #60A5FA;
}

.me-bio {
  font-size: 13px;
  color: #A1A1AA;
  margin: 6px 0 10px;
  line-height: 1.5;
}

/* ==========================================
   Tab 切换栏
   ========================================== */
.me-tabs {
  display: flex;
  gap: 0;
  background: #1C1C22;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.me-tab-item {
  flex: 1;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: #71717A;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.me-tab-item:hover {
  color: #A1A1AA;
}

.me-tab-item.active {
  background: #2D2D34;
  color: #F1F1F3;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* ==========================================
   Tab 内容区
   ========================================== */
.me-tab-content {
  min-height: 300px;
}

/* ==========================================
   危险操作区
   ========================================== */
.me-danger-zone {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.me-danger-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.me-danger-text {
  flex: 1;
}

.me-danger-title {
  font-size: 14px;
  font-weight: 600;
  color: #A1A1AA;
  margin: 0 0 2px;
}

.me-danger-desc {
  font-size: 13px;
  color: #71717A;
  margin: 0;
}

.me-logout-btn {
  color: #F87171 !important;
  background: transparent !important;
  border: 1px solid rgba(248, 113, 113, 0.4) !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  padding: 8px 20px !important;
  height: auto !important;
  flex-shrink: 0;
  transition: all 0.2s ease !important;
}

.me-logout-btn:hover {
  color: #FFFFFF !important;
  background: #F87171 !important;
  border-color: #F87171 !important;
}
</style>
