<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { userApi } from '@/api/user'
import type { StatusItem } from '@/api/user'
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
const profileStatus = ref<number | null>(null)

// 所有可用的 status 列表
const statusList = ref<StatusItem[]>([])
const statusPickerVisible = ref(false)

// ==========================================
// status name → iconfont font_class 映射
// DB 中存的 name 无 "163_" 前缀（如 "放松"），iconfont.json 中有前缀（"163_放松"）
// ==========================================
const STATUS_NAME_TO_CLASS: Record<string, string> = {
  '放松': 'a-163_biaoqing-12',
  '兴奋': 'a-163_biaoqing-1',
  '开怀': 'a-163_biaoqing-11',
  '大笑': 'a-163_biaoqing-7',
  '美妙': 'a-163_biaoqing-14',
  '不悦': 'a-163_biaoqing-21',
  '调皮': 'a-163_biaoqing-22',
  '质疑': 'a-163_biaoqing-19',
  '小狗': 'a-163_biaoqing-10',
  '愉悦': 'a-163_biaoqing-25',
  '友好': 'a-163_biaoqing-13',
  '高兴': 'a-163_biaoqing-18',
  '自信': 'a-163_biaoqing-5',
  '自豪': 'a-163_biaoqing-24',
  '微笑': 'a-163_biaoqing-9',
  '咀嚼': 'a-163_biaoqing-23',
  '疑惑': 'a-163_biaoqing-16',
  '男士': 'a-163_biaoqing-2',
  '女士': 'a-163_biaoqing-6',
  '开心': 'a-163_biaoqing-3',
}

// 默认表情 font_class（未设置 status 时使用）
const DEFAULT_STATUS_CLASS = 'a-163_biaoqing-9' // 163_微笑

// 当前 status 对应的 iconfont font_class
const currentStatusFontClass = computed(() => {
  if (profileStatus.value === null) return DEFAULT_STATUS_CLASS
  const item = statusList.value.find((s) => s.id === profileStatus.value)
  if (!item) return DEFAULT_STATUS_CLASS
  return STATUS_NAME_TO_CLASS[item.name] || DEFAULT_STATUS_CLASS
})

// 当前 status 的中文名称（tooltip 用）
const currentStatusName = computed(() => {
  if (profileStatus.value === null) return '未设置表情'
  const item = statusList.value.find((s) => s.id === profileStatus.value)
  return item ? item.name : '未设置表情'
})

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

function switchTab(tab: 'notes' | 'likes' | 'favorites') {
  activeTab.value = tab
  if (tab === 'notes' && notes.value.length === 0) fetchNotes(true)
  else if (tab === 'likes' && likedNotes.value.length === 0) fetchLikes(true)
  else if (tab === 'favorites' && favoriteNotes.value.length === 0) fetchFavorites(true)
}

async function fetchStatusList() {
  try {
    statusList.value = await userApi.getStatusList()
  } catch { /* ignore */ }
}

function selectStatus(statusId: number | null) {
  profileStatus.value = statusId
  statusPickerVisible.value = false
}

onMounted(async () => {
  try {
    const [userRes] = await Promise.all([
      userApi.getUserInfo(),
      fetchStatusList(),
    ])
    const body = userRes.data
    if (body.code === 200 && body.data.userInfo) {
      const info = body.data.userInfo
      profileNickname.value = info.nickname || ''
      profileBio.value = info.bio || ''
      profileGender.value = info.gender ?? 2
      profileStatus.value = info.status ?? null
      if (authStore.user) {
        Object.assign(authStore.user, info)
      }
    }
  } catch {
    // 请求失败时保留 authStore 中的现有数据
  } finally {
    loading.value = false
  }
  fetchNotes(true)
})

function handleLogout() { authStore.logout(); router.push('/') }
</script>

<template>
  <div class="page-container max-w-5xl">
    <!-- 个人资料头部 -->
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
          <!-- 社交数据行 -->
          <div class="me-stats-row">
            <span class="me-stat-item"><em>{{ authStore.user?.following_count ?? 0 }}</em> 关注</span>
            <span class="me-stat-divider">|</span>
            <span class="me-stat-item"><em>{{ authStore.user?.follower_count ?? 0 }}</em> 粉丝</span>
            <span class="me-stat-divider">|</span>
            <span class="me-stat-item"><em>{{ authStore.user?.note_count ?? 0 }}</em> 笔记</span>
          </div>
          <!-- Status 表情图标 -->
          <div class="me-status-row">
            <el-popover
              v-model:visible="statusPickerVisible"
              trigger="click"
              placement="bottom-start"
              :width="320"
              :offset="4"
              popper-class="me-status-picker-popper"
            >
              <template #reference>
                <span
                  class="me-status-icon-wrap"
                  :title="currentStatusName"
                >
                  <!-- 自定义微笑 SVG（status 为 null 时） -->
                  <svg v-if="profileStatus === null" width="28" height="28" viewBox="0 0 28 28" fill="none" class="me-status-svg">
                    <circle cx="14" cy="14" r="11" stroke="#71717A" stroke-width="1.5"/>
                    <circle cx="10" cy="11" r="1.4" fill="#71717A"/>
                    <circle cx="18" cy="11" r="1.4" fill="#71717A"/>
                    <path d="M9 17.5 Q14 21.5 19 17.5" stroke="#71717A" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <!-- iconfont 表情图标（status 有值时） -->
                  <svg v-else class="icon-svg me-status-svg" aria-hidden="true">
                    <use :href="'#icon-' + currentStatusFontClass" />
                  </svg>
                </span>
              </template>

              <!-- Popover 内容：表情网格 -->
              <div class="status-picker-grid">
                <div
                  v-for="item in statusList"
                  :key="item.id"
                  class="status-picker-item"
                  :class="{ selected: profileStatus === item.id }"
                  :title="item.name"
                  @click="selectStatus(item.id)"
                >
                  <svg class="icon-svg status-picker-icon" aria-hidden="true">
                    <use :href="'#icon-' + (STATUS_NAME_TO_CLASS[item.name] || DEFAULT_STATUS_CLASS)" />
                  </svg>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 切换栏 -->
    <div class="me-tabs">
      <button class="me-tab-item" :class="{ active: activeTab === 'notes' }" @click="switchTab('notes')">笔记</button>
      <button class="me-tab-item" :class="{ active: activeTab === 'likes' }" @click="switchTab('likes')">点赞</button>
      <button class="me-tab-item" :class="{ active: activeTab === 'favorites' }" @click="switchTab('favorites')">收藏</button>
    </div>

    <!-- 笔记 Tab -->
    <div v-if="activeTab === 'notes'" class="me-tab-content">
      <NoteWaterfall :notes="notes" :loading="loadingNotes" :has-more="hasMoreNotes" empty-text="还没有发布笔记" empty-type="notes" empty-show-cta empty-cta-text="去写一篇" empty-cta-link="/note/create" @load-more="fetchNotes()" />
    </div>

    <!-- 点赞 Tab -->
    <div v-else-if="activeTab === 'likes'" class="me-tab-content">
      <NoteWaterfall :notes="likedNotes" :loading="loadingLikes" :has-more="hasMoreLikes" empty-text="还没有点赞的笔记" empty-type="notes" @load-more="fetchLikes()" />
    </div>

    <!-- 收藏 Tab -->
    <div v-else class="me-tab-content">
      <NoteWaterfall :notes="favoriteNotes" :loading="loadingFavorites" :has-more="hasMoreFavorites" empty-text="还没有收藏的笔记" empty-type="notes" @load-more="fetchFavorites()" />
    </div>

    <!-- 退出登录 -->
    <div class="me-logout-zone">
      <button class="me-logout-link" @click="handleLogout">退出登录</button>
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
  padding: 20px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.03);
  margin-bottom: 12px;
}

/* ==========================================
   Profile 头部
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
  color: #C084FC;
}

.me-gender-male {
  color: #818CF8;
}

.me-bio {
  font-size: 13px;
  color: #A1A1AA;
  margin: 6px 0 8px;
  line-height: 1.5;
}

.me-stats-row {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 8px 0 4px;
}

.me-stat-item {
  font-size: 12px;
  color: #71717A;
}

.me-stat-item em {
  font-style: normal;
  font-weight: 600;
  color: #A1A1AA;
}

.me-stat-divider {
  margin: 0 10px;
  color: #3A3A42;
  font-size: 11px;
}

/* ==========================================
   Status 表情
   ========================================== */
.me-status-row {
  margin-top: 2px;
}

.me-status-icon-wrap {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.me-status-icon-wrap:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}

.me-status-svg {
  width: 28px;
  height: 28px;
}


/* ==========================================
   Status 选择器 Popover
   ========================================== */


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
  color: #F1F1F3;
  font-weight: 600;
  position: relative;
}

.me-tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(90deg, #8B5CF6, #6366F1);
}

.me-tab-content {
  min-height: 300px;
}

/* ==========================================
   退出登录
   ========================================== */
.me-logout-zone {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.me-logout-link {
  font-size: 13px;
  color: #52525B;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.me-logout-link:hover {
  color: #F87171;
}
</style>

<!-- 非 scoped 样式：popover 需要全局覆盖 -->
<style>
.me-status-picker-popper {
  background: #1E1E24 !important;
  border: 1px solid #2E2E36 !important;
  border-radius: 14px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5) !important;
  padding: 8px !important;
}

.me-status-picker-popper .el-popper__arrow::before {
  background: #1E1E24 !important;
  border-color: #2E2E36 !important;
}

.status-picker-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.status-picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 2px solid transparent;
}

.status-picker-item:hover {
  background: rgba(139, 92, 246, 0.1);
}

.status-picker-item.selected {
  border-color: #8B5CF6;
  background: rgba(139, 92, 246, 0.15);
}

.status-picker-icon {
  width: 36px;
  height: 36px;
}
</style>
