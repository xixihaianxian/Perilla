<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Stamp,
  PhoneFilled,
  Message,
  Lock,
  Calendar,
  EditPen,
  Setting,
  Key,
  ArrowLeft,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'
import { userApi } from '@/api/user'
import { getAvatarUrl } from '@/utils/avatar'

const router = useRouter()
const authStore = useAuthStore()

// ==========================================
// Tab 状态
// ==========================================
type TabKey = 'profile' | 'account' | 'security'
const activeTab = ref<TabKey>('profile')

const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'profile', label: '资料编辑', icon: EditPen },
  { key: 'account', label: '账号信息', icon: Setting },
  { key: 'security', label: '账号安全', icon: Key },
]

// ==========================================
// 表单状态 —— 三组独立的 reactive
// ==========================================
const profileForm = reactive({
  nickname: '',
  bio: '',
  gender: 2 as number,
  birthday: '' as string,
})

const accountForm = reactive({
  username: '',
  email: '',
  phone: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 资料编辑：记录加载时的原始值作为基线，用于判断是否有改动
const profileBaseline = ref({ nickname: '', bio: '', gender: 2 as number, birthday: '' as string })
function snapshotProfile() {
  profileBaseline.value = {
    nickname: profileForm.nickname,
    bio: profileForm.bio,
    gender: profileForm.gender,
    birthday: profileForm.birthday,
  }
}
function isProfileDirty(): boolean {
  const b = profileBaseline.value
  return (
    profileForm.nickname.trim() !== b.nickname.trim() ||
    profileForm.bio.trim() !== b.bio.trim() ||
    profileForm.gender !== b.gender ||
    (profileForm.birthday || '') !== (b.birthday || '')
  )
}

// 账号信息：同样记录加载时的原始值作为基线，用于判断是否有改动
const accountBaseline = ref({ username: '', email: '', phone: '' })
function snapshotAccount() {
  accountBaseline.value = {
    username: accountForm.username,
    email: accountForm.email,
    phone: accountForm.phone,
  }
}
function isAccountDirty(): boolean {
  const b = accountBaseline.value
  return (
    accountForm.username.trim() !== b.username.trim() ||
    accountForm.email.trim() !== b.email.trim() ||
    accountForm.phone.trim() !== b.phone.trim()
  )
}

// 行内错误（账号信息 / 账号安全）
const accountErrors = reactive({
  email: '',
  phone: '',
})
const passwordErrors = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 各 tab loading（保存按钮的状态）
const savingProfile = ref(false)
const savingAccount = ref(false)
const savingPassword = ref(false)

// 账号信息：懒加载状态（进入 tab 时才拉取，且只拉一次）
const accountLoaded = ref(false)
const loadingAccount = ref(false)

// ==========================================
// 性别胶囊选择器（与 RegisterView 一致）
// ==========================================
const genderOptions = [
  { label: '女', value: 0 },
  { label: '男', value: 1 },
  { label: '保密', value: 2 },
]

const activeGenderIndex = computed(() =>
  genderOptions.findIndex((o) => o.value === profileForm.gender),
)

function selectGender(value: number) {
  profileForm.gender = value
}

// ==========================================
// 加载：先用 authStore.user 填表单，再调 /user/get/information 补全缺失值
// ==========================================
function fillFormsFromStore() {
  const u = authStore.user as any
  if (!u) return
  profileForm.nickname = u.nickname ?? ''
  profileForm.bio = u.bio ?? ''
  profileForm.gender = typeof u.gender === 'number' ? u.gender : 2
  profileForm.birthday = u.birthday ?? ''
  accountForm.username = u.username ?? ''
  accountForm.email = u.email ?? ''
  accountForm.phone = u.phone ?? ''
}

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
}

function fillMissingFormsFromInfo(info: any) {
  if (!info) return

  if (isBlank(profileForm.nickname) && info.nickname !== undefined) profileForm.nickname = info.nickname ?? ''
  if (isBlank(profileForm.bio) && info.bio !== undefined) profileForm.bio = info.bio ?? ''
  if (isBlank(profileForm.birthday) && info.birthday !== undefined) profileForm.birthday = info.birthday ?? ''
  if (profileForm.gender === 2 && info.gender !== undefined && info.gender !== null) profileForm.gender = info.gender

  if (isBlank(accountForm.username) && (info.username !== undefined || info.name !== undefined)) {
    accountForm.username = info.username ?? info.name ?? ''
  }
  if (isBlank(accountForm.email) && info.email !== undefined) accountForm.email = info.email ?? ''
  if (isBlank(accountForm.phone) && info.phone !== undefined) accountForm.phone = info.phone ?? ''
}

onMounted(async () => {
  fillFormsFromStore()
  try {
    const res = await userApi.getUserInformation()
    const body = res.data
    const info = body.data?.userInfo ?? body.data?.UserInfo ?? body.data
    if (body.code === 200 && info) {
      if (authStore.user) {
        Object.assign(authStore.user as any, info)
      }
      fillMissingFormsFromInfo(info)
    }
  } catch {
    /* 静默：保留 store 里的现值 */
  } finally {
    // 以最终填充值作为「未改动」基线
    snapshotProfile()
    snapshotAccount()
  }
})

// ==========================================
// 账号信息：进入 tab 时拉取 /user/get/account/info 填充三个框
// 返回结构：{ code, message, data: { token, userInfo: { username, email, phone } } }
// ==========================================
async function loadAccountInfo() {
  loadingAccount.value = true
  try {
    const res = await userApi.getAccountInfo()
    const body = res.data
    const info = body.data?.userInfo ?? body.data?.UserInfo ?? body.data
    if (body.code === 200 && info) {
      if (info.username !== undefined && info.username !== null) accountForm.username = info.username
      if (info.email !== undefined && info.email !== null) accountForm.email = info.email
      if (info.phone !== undefined && info.phone !== null) accountForm.phone = info.phone
      // 与 onMounted 一致：回写 store，便于其他页面复用
      if (authStore.user) {
        Object.assign(authStore.user as any, {
          username: accountForm.username,
          email: accountForm.email,
          phone: accountForm.phone,
        })
      }
    }
  } catch {
    /* 静默：保留现值，避免接口异常时清空用户输入 */
  } finally {
    accountLoaded.value = true
    loadingAccount.value = false
    // 拉取到权威值后以其为「未改动」基线
    snapshotAccount()
  }
}

// 懒加载：首次切到「账号信息」tab 时拉取（默认 tab 为 profile，watch 即可覆盖）
watch(activeTab, (tab) => {
  if (tab === 'account' && !accountLoaded.value) {
    loadAccountInfo()
  }
})

// ==========================================
// 校验工具
// ==========================================
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^1[3-9]\d{9}$/

function validateAccount(): boolean {
  accountErrors.email = ''
  accountErrors.phone = ''
  let ok = true
  if (accountForm.email && !EMAIL_RE.test(accountForm.email)) {
    accountErrors.email = '邮箱格式不正确'
    ok = false
  }
  if (accountForm.phone && !PHONE_RE.test(accountForm.phone)) {
    accountErrors.phone = '请输入正确的大陆手机号'
    ok = false
  }
  return ok
}

function validatePassword(): boolean {
  passwordErrors.oldPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''
  let ok = true
  if (!passwordForm.oldPassword) {
    passwordErrors.oldPassword = '请输入旧密码'
    ok = false
  }
  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = '请输入新密码'
    ok = false
  } else if (passwordForm.newPassword.length < 6) {
    passwordErrors.newPassword = '新密码至少 6 位'
    ok = false
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = '两次输入的密码不一致'
    ok = false
  }
  return ok
}

// ==========================================
// 保存（全部仅本地更新 authStore.user + toast，不发请求）
// ==========================================
async function handleSaveProfile() {
  if (!isProfileDirty()) {
    ElMessage.warning('你没有进行任何修改')
    return
  }
  savingProfile.value = true
  try {
    const payload = {
      nickname: profileForm.nickname.trim(),
      bio: profileForm.bio.trim(),
      gender: profileForm.gender,
      birthday: profileForm.birthday,
    }
    const res = await userApi.updateInformation(payload)
    const body = res.data
    if (body?.code === 200) {
      if (authStore.user) {
        Object.assign(authStore.user as any, payload)
      }
      snapshotProfile() // 刷新基线，再次点击不会误判为「已修改」
      ElMessage.success(body.message || '资料已保存')
    } else {
      ElMessage.error(body?.message || '保存失败')
    }
  } catch (e: any) {
    ElMessage.error(
      e?.response?.data?.detail || e?.response?.data?.message || '保存失败，请稍后重试',
    )
  } finally {
    savingProfile.value = false
  }
}

async function handleSaveAccount() {
  if (!isAccountDirty()) {
    ElMessage.warning('你没有进行任何修改')
    return
  }
  if (!validateAccount()) {
    ElMessage.warning('请检查表单：邮箱或手机号格式不正确')
    return
  }
  savingAccount.value = true
  try {
    const payload = {
      username: accountForm.username.trim(),
      email: accountForm.email.trim(),
      phone: accountForm.phone.trim(),
    }
    const res = await userApi.updateAccountInfo(payload)
    const body = res.data
    if (body?.code === 200) {
      if (authStore.user) {
        Object.assign(authStore.user as any, payload)
      }
      snapshotAccount() // 刷新基线，避免再次点击被误判为「已修改」
      ElMessage.success(body.message || '账号信息已保存')
    } else {
      ElMessage.error(body?.message || '保存失败')
    }
  } catch (e: any) {
    ElMessage.error(
      e?.response?.data?.detail || e?.response?.data?.message || '保存失败，请稍后重试',
    )
  } finally {
    savingAccount.value = false
  }
}

async function handleSavePassword() {
  if (!validatePassword()) return
  savingPassword.value = true
  try {
    await new Promise((r) => setTimeout(r, 200))
    // 密码不写回 store，仅清空输入
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    ElMessage.success('密码修改成功（仅前端演示，未对接后端）')
  } finally {
    savingPassword.value = false
  }
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/me')
}
</script>

<template>
  <div class="settings-page">
    <!-- 顶部标题 -->
    <header class="settings-header">
      <button class="settings-back" type="button" @click="goBack">
        <el-icon :size="18"><ArrowLeft /></el-icon>
        <span>返回</span>
      </button>
      <h1 class="settings-title">设置与隐私</h1>
      <p class="settings-subtitle">管理你的账号资料、登录凭证与安全设置</p>
    </header>

    <div class="settings-layout">
      <!-- ===== 左侧子导航 ===== -->
      <aside class="settings-nav">
        <div class="settings-nav-user">
          <img
            :src="getAvatarUrl(authStore.user?.avatar)"
            class="settings-nav-avatar"
            alt=""
          />
          <div class="settings-nav-user-meta">
            <p class="settings-nav-nickname">{{ authStore.user?.nickname || '未设置昵称' }}</p>
            <p class="settings-nav-username">@{{ (authStore.user as any)?.username || '未知' }}</p>
          </div>
        </div>

        <nav class="settings-nav-list">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="settings-nav-item"
            :class="{ 'settings-nav-item--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <el-icon :size="18"><component :is="tab.icon" /></el-icon>
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </aside>

      <!-- ===== 右侧内容面板 ===== -->
      <section class="settings-panel">
        <!-- ============ 资料编辑 ============ -->
        <div v-if="activeTab === 'profile'" class="settings-section">
          <div class="settings-section-head">
            <h2>资料编辑</h2>
            <p>这些信息会显示在你的个人主页和笔记中</p>
          </div>

          <div class="settings-form">
            <div class="settings-field">
              <label class="settings-label">昵称</label>
              <el-input
                v-model="profileForm.nickname"
                placeholder="给自己起个好听的昵称"
                size="large"
                clearable
                maxlength="20"
                show-word-limit
                :prefix-icon="Stamp"
              />
            </div>

            <div class="settings-field">
              <label class="settings-label">个人简介</label>
              <el-input
                v-model="profileForm.bio"
                type="textarea"
                placeholder="介绍一下自己吧"
                :rows="4"
                maxlength="120"
                show-word-limit
                resize="none"
              />
            </div>

            <div class="settings-field">
              <label class="settings-label">性别</label>
              <div class="segment">
                <div class="segment__track">
                  <div
                    class="segment__slider"
                    :style="{ transform: `translateX(${activeGenderIndex * 100}%)` }"
                  />
                  <button
                    v-for="opt in genderOptions"
                    :key="opt.value"
                    type="button"
                    class="segment__btn"
                    :class="{ 'segment__btn--active': profileForm.gender === opt.value }"
                    @click="selectGender(opt.value)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="settings-field">
              <label class="settings-label">生日</label>
              <el-date-picker
                v-model="profileForm.birthday"
                type="date"
                placeholder="选择你的生日"
                value-format="YYYY-MM-DD"
                size="large"
                :prefix-icon="Calendar"
                class="settings-date"
              />
            </div>

            <div class="settings-actions">
              <el-button
                type="primary"
                size="large"
                :loading="savingProfile"
                @click="handleSaveProfile"
              >
                保存修改
              </el-button>
            </div>
          </div>
        </div>

        <!-- ============ 账号信息 ============ -->
        <div v-if="activeTab === 'account'" v-loading="loadingAccount" class="settings-section">
          <div class="settings-section-head">
            <h2>账号信息</h2>
            <p>用户名是登录凭证，建议不要频繁修改</p>
          </div>

          <div class="settings-form">
            <div class="settings-field">
              <label class="settings-label">用户名</label>
              <el-input
                v-model="accountForm.username"
                placeholder="用户名"
                size="large"
                clearable
                maxlength="20"
                :prefix-icon="User"
              />
              <p class="settings-hint">用户名是你的登录账号，修改后下次登录需使用新用户名。</p>
            </div>

            <div class="settings-field">
              <label class="settings-label">邮箱</label>
              <el-input
                v-model="accountForm.email"
                type="email"
                placeholder="example@perilla.com"
                size="large"
                clearable
                :prefix-icon="Message"
              />
              <p v-if="accountErrors.email" class="settings-error">{{ accountErrors.email }}</p>
            </div>

            <div class="settings-field">
              <label class="settings-label">手机号</label>
              <el-input
                v-model="accountForm.phone"
                type="tel"
                placeholder="11 位大陆手机号"
                size="large"
                clearable
                maxlength="11"
                :prefix-icon="PhoneFilled"
              />
              <p v-if="accountErrors.phone" class="settings-error">{{ accountErrors.phone }}</p>
            </div>

            <div class="settings-actions">
              <el-button
                type="primary"
                size="large"
                :loading="savingAccount"
                @click="handleSaveAccount"
              >
                保存修改
              </el-button>
            </div>
          </div>
        </div>

        <!-- ============ 账号安全 ============ -->
        <div v-if="activeTab === 'security'" class="settings-section">
          <div class="settings-section-head">
            <h2>账号安全</h2>
            <p>定期修改密码可以更好地保护你的账号安全</p>
          </div>

          <div class="settings-form">
            <div class="settings-field">
              <label class="settings-label">当前密码</label>
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入当前密码"
                size="large"
                show-password
                :prefix-icon="Lock"
              />
              <p v-if="passwordErrors.oldPassword" class="settings-error">
                {{ passwordErrors.oldPassword }}
              </p>
            </div>

            <div class="settings-field">
              <label class="settings-label">新密码</label>
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="至少 6 位"
                size="large"
                show-password
                :prefix-icon="Lock"
              />
              <p v-if="passwordErrors.newPassword" class="settings-error">
                {{ passwordErrors.newPassword }}
              </p>
            </div>

            <div class="settings-field">
              <label class="settings-label">确认新密码</label>
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="再次输入新密码"
                size="large"
                show-password
                :prefix-icon="Lock"
              />
              <p v-if="passwordErrors.confirmPassword" class="settings-error">
                {{ passwordErrors.confirmPassword }}
              </p>
            </div>

            <div class="settings-actions">
              <el-button
                type="primary"
                size="large"
                :loading="savingPassword"
                @click="handleSavePassword"
              >
                修改密码
              </el-button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================
   页面容器
   ========================================== */
.settings-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  color: var(--color-text-primary);
}

/* ==========================================
   顶部标题
   ========================================== */
.settings-header {
  margin-bottom: 28px;
}

.settings-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 6px 12px 6px 8px;
  border: 0;
  border-radius: 999px;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.04);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.settings-back:hover {
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.08);
}

.settings-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.settings-subtitle {
  margin-top: 6px;
  color: var(--color-text-tertiary);
  font-size: 14px;
}

/* ==========================================
   两栏布局
   ========================================== */
.settings-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

/* ==========================================
   左侧导航
   ========================================== */
.settings-nav {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-bg-secondary);
}

.settings-nav-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.settings-nav-avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  object-fit: cover;
  background: var(--color-bg-tertiary);
}

.settings-nav-user-meta {
  min-width: 0;
}

.settings-nav-nickname {
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-nav-username {
  margin-top: 2px;
  overflow: hidden;
  font-size: 12px;
  color: var(--color-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.settings-nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-primary);
}

.settings-nav-item--active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.18), rgba(124, 58, 237, 0.12));
  color: var(--color-text-primary);
  box-shadow: inset 0 0 0 1px rgba(139, 92, 246, 0.4);
}

/* ==========================================
   右侧面板
   ========================================== */
.settings-panel {
  min-width: 0;
  padding: 28px 32px 32px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-bg-secondary);
}

.settings-section-head {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.settings-section-head h2 {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.settings-section-head p {
  margin-top: 6px;
  color: var(--color-text-tertiary);
  font-size: 13px;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.settings-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.settings-label {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.settings-hint {
  color: var(--color-text-tertiary);
  font-size: 12px;
  line-height: 1.6;
}

.settings-error {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-danger);
  font-size: 12px;
  font-weight: 500;
}

/* 让 el-date-picker 填满 */
.settings-date {
  width: 100%;
}

/* ==========================================
   底部保存按钮
   ========================================== */
.settings-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.settings-actions :deep(.el-button) {
  min-width: 132px;
  font-weight: 700;
  letter-spacing: 1px;
}

/* ==========================================
   胶囊分段控制器（从 RegisterView 复刻，限定到本页）
   ========================================== */
.segment {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 2px 0;
}

.segment__track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  flex: 1;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
}

.segment__slider {
  position: absolute;
  top: 3px;
  left: 3px;
  z-index: 0;
  width: calc((100% - 6px) / 3);
  height: calc(100% - 6px);
  border-radius: 8px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 2px 12px rgba(139, 92, 246, 0.35);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.segment__btn {
  position: relative;
  z-index: 1;
  padding: 10px 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: color 0.25s ease;
}

.segment__btn--active {
  color: #fff;
  font-weight: 700;
}

/* ==========================================
   响应式
   ========================================== */
@media (max-width: 880px) {
  .settings-page {
    padding: 24px 16px 64px;
  }
  .settings-layout {
    grid-template-columns: 1fr;
  }
  .settings-nav {
    position: static;
  }
  .settings-nav-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  .settings-nav-item {
    flex: 1 1 0;
    justify-content: center;
    min-width: 0;
  }
  .settings-panel {
    padding: 22px 20px 24px;
  }
}
</style>
