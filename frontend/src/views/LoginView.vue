<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { User, Lock, WarningFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const form = reactive({ username: '', password: '', remember: false })
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
  <div class="login-page">
    <div class="login-glow login-glow--top" />
    <div class="login-glow login-glow--bottom" />

    <div class="login-card">
      <!-- ========== 左侧品牌区 ========== -->
      <div class="login-card__hero">
        <div class="login-card__hero-content">
          <!-- LOGO + 霓虹光晕 -->
          <div class="login-card__logo-wrap">
            <div class="login-card__logo-glow" />
            <svg class="login-card__hero-logo" viewBox="0 0 48 46" fill="none">
              <path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" />
              <mask id="logo-mask" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
                <path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" />
              </mask>
              <g mask="url(#logo-mask)">
                <g filter="url(#logo-blur-1)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)" /></g>
                <g filter="url(#logo-blur-2)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)" /></g>
                <g filter="url(#logo-blur-3)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)" /></g>
                <g filter="url(#logo-blur-3)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)" /></g>
                <g filter="url(#logo-blur-3)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)" /></g>
                <g filter="url(#logo-blur-2)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" transform="rotate(93.35 24.506 48.493)scale(-1 1)" /></g>
                <g filter="url(#logo-blur-3)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" transform="rotate(89.009 28.708 47.59)scale(-1 1)" /></g>
                <g filter="url(#logo-blur-3)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" transform="rotate(89.009 28.708 47.59)scale(-1 1)" /></g>
                <g filter="url(#logo-blur-4)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" transform="rotate(39.51 .387 8.972)" /></g>
                <g filter="url(#logo-blur-4)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" transform="rotate(37.892 47.523 -6.092)" /></g>
                <g filter="url(#logo-blur-5)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" transform="rotate(37.892 41.412 6.333)" /></g>
                <g filter="url(#logo-blur-4)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" transform="rotate(37.892 -1.88 38.332)" /></g>
                <g filter="url(#logo-blur-4)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" transform="rotate(37.892 -1.88 38.332)" /></g>
                <g filter="url(#logo-blur-4)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" transform="rotate(37.892 35.651 29.907)" /></g>
                <g filter="url(#logo-blur-5)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" transform="rotate(37.892 38.418 32.4)" /></g>
              </g>
              <defs>
                <filter id="logo-blur-1" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur" stdDeviation="7.659"/></filter>
                <filter id="logo-blur-2" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur" stdDeviation="7.659"/></filter>
                <filter id="logo-blur-3" width="79.579" height="29.4" x="-50" y="-10" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur" stdDeviation="4.596"/></filter>
                <filter id="logo-blur-4" width="56.045" height="64.646" x="-28" y="-23" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur" stdDeviation="4.596"/></filter>
                <filter id="logo-blur-5" width="39.409" height="43.623" x="18" y="10" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur" stdDeviation="4.596"/></filter>
              </defs>
            </svg>
          </div>

          <h1 class="login-card__hero-brand">Perilla</h1>
          <p class="login-card__hero-desc">发 现 · 记 录 · 分 享</p>

          <!-- 线性图标列表 -->
          <div class="login-card__hero-features">
            <div class="login-card__hero-feature">
              <svg class="login-card__hero-icon" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.2" />
                <rect x="12" y="1" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.2" />
                <rect x="1" y="12" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.2" />
                <rect x="12" y="12" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span>精美笔记瀑布流</span>
            </div>
            <div class="login-card__hero-feature">
              <svg class="login-card__hero-icon" viewBox="0 0 20 20" fill="none">
                <circle cx="6" cy="8" r="3.5" stroke="currentColor" stroke-width="1.2" />
                <circle cx="14" cy="6" r="2.8" stroke="currentColor" stroke-width="1.2" />
                <path d="M2.5 15c.8-1.5 2.2-2.5 3.8-2.5 2 0 3.4 1.5 5.2 1.5 1.2 0 2.3-.5 3.2-1.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              </svg>
              <span>话题社区互动</span>
            </div>
            <div class="login-card__hero-feature">
              <svg class="login-card__hero-icon" viewBox="0 0 20 20" fill="none">
                <path d="M10 2l2.1 5.3 5.6.5-4.3 3.6 1.4 5.6L10 14l-4.8 3 1.4-5.6L2.3 7.8l5.6-.5L10 2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
              </svg>
              <span>个性化推荐</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== 右侧表单区 ========== -->
      <div class="login-card__form-side">
        <div class="login-card__form-header">
          <h2 class="login-card__form-title">欢迎回来</h2>
          <p class="login-card__form-subtitle">还没有账号？<router-link to="/register">立即注册</router-link></p>
        </div>

        <form class="login-card__form" @submit.prevent="handleLogin">
          <el-input v-model="form.username" placeholder="用户名或邮箱" size="large" clearable :prefix-icon="User" />
          <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password :prefix-icon="Lock" />

          <!-- 记住我 & 忘记密码 -->
          <div class="login-card__options">
            <el-checkbox v-model="form.remember" label="记住我" size="small" />
            <a href="javascript:void(0)" class="login-card__forgot">忘记密码？</a>
          </div>

          <transition name="error-fade">
            <div v-if="error" class="login-card__error">
              <el-icon :size="16"><WarningFilled /></el-icon>
              <span>{{ error }}</span>
            </div>
          </transition>

          <el-button type="primary" size="large" class="login-card__submit" :loading="loading" native-type="submit">
            登 录
          </el-button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================
   全屏容器
   ========================================== */
.login-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: radial-gradient(ellipse 80% 60% at 50% 20%, #12101a 0%, #09080f 65%);
  overflow: hidden;
}

/* ===== 背景光晕 ===== */
.login-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  pointer-events: none;
  animation: glow-breathe 8s ease-in-out infinite alternate;
}
.login-glow--top {
  width: 600px;
  height: 600px;
  top: -20%;
  left: -10%;
  background: rgba(139, 92, 246, 0.08);
}
.login-glow--bottom {
  width: 500px;
  height: 500px;
  bottom: -15%;
  right: -10%;
  background: rgba(99, 102, 241, 0.06);
}
@keyframes glow-breathe {
  0% { opacity: 0.4; transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1.04); }
}
.login-glow--bottom {
  animation: glow-breathe-bottom 8s ease-in-out infinite alternate;
}
@keyframes glow-breathe-bottom {
  0% { opacity: 0.35; transform: scale(0.95); }
  100% { opacity: 0.8; transform: scale(1.04); }
}

/* ==========================================
   黑曜石玻璃卡片
   ========================================== */
.login-card {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 960px;
  min-height: 620px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    0 32px 96px rgba(0, 0, 0, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  overflow: hidden;
}

/* ==========================================
   左侧品牌区
   ========================================== */
.login-card__hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 48px;
  background: linear-gradient(160deg, rgba(139, 92, 246, 0.08), rgba(99, 102, 241, 0.03));
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}
.login-card__hero-content {
  text-align: center;
}

/* LOGO 霓虹光晕 */
.login-card__logo-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}
.login-card__logo-glow {
  position: absolute;
  inset: -36px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 30%, rgba(180, 130, 255, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 60% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 55%),
    radial-gradient(circle at 50% 70%, rgba(200, 150, 255, 0.25) 0%, transparent 60%);
  filter: blur(28px);
  animation: neon-breathe 3.5s ease-in-out infinite alternate;
}
@keyframes neon-breathe {
  0% { opacity: 0.45; transform: scale(0.85); }
  100% { opacity: 1; transform: scale(1.12); }
}
.login-card__hero-logo {
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
  display: block;
  filter:
    drop-shadow(0 0 20px rgba(160, 100, 255, 0.5))
    drop-shadow(0 0 40px rgba(139, 92, 246, 0.25));
  transition: filter 0.5s ease;
}
.login-card__logo-wrap:hover .login-card__hero-logo {
  filter:
    drop-shadow(0 0 28px rgba(180, 130, 255, 0.65))
    drop-shadow(0 0 56px rgba(139, 92, 246, 0.35));
}

.login-card__hero-brand {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #C4B5FD, #A78BFA, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.login-card__hero-desc {
  font-size: 14px;
  letter-spacing: 0.14em;
  color: #71717A;
  margin-bottom: 40px;
}

/* 线性图标列表 */
.login-card__hero-features {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.login-card__hero-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #52525B;
}
.login-card__hero-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #52525B;
}

/* ==========================================
   右侧表单区
   ========================================== */
.login-card__form-side {
  padding: 48px 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login-card__form-header {
  margin-bottom: 28px;
}
.login-card__form-title {
  font-size: 22px;
  font-weight: 700;
  color: #E4E4E7;
  margin: 0 0 6px;
}
.login-card__form-subtitle {
  font-size: 13px;
  color: #52525B;
  margin: 0;
}
.login-card__form-subtitle a {
  color: #A78BFA;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.login-card__form-subtitle a:hover {
  color: #C4B5FD;
}

.login-card__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 记住我 & 忘记密码 */
.login-card__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
}
.login-card__forgot {
  font-size: 13px;
  color: #A78BFA;
  text-decoration: none;
  transition: color 0.2s;
}
.login-card__forgot:hover {
  color: #C4B5FD;
}

/* ==========================================
   Element Plus 输入框覆盖
   ========================================== */
:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.03) !important;
  border-radius: 10px !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  box-shadow: none !important;
  padding: 4px 14px !important;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease !important;
}
:deep(.el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}
:deep(.el-input.is-focus .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.06) !important;
  border-color: #8B5CF6 !important;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12), inset 0 0 0 1px rgba(139, 92, 246, 0.1) !important;
}
:deep(.el-input__inner) {
  color: #E4E4E7 !important;
}
:deep(.el-input__inner::placeholder) {
  color: #3F3F46 !important;
}
:deep(.el-input__prefix-inner) {
  color: #3F3F46 !important;
  transition: color 0.25s ease !important;
}
:deep(.el-input.is-focus .el-input__prefix-inner) {
  color: #8B5CF6 !important;
}

/* Element Plus Checkbox 覆盖 */
:deep(.el-checkbox__label) {
  color: #52525B !important;
  font-size: 13px !important;
}
:deep(.el-checkbox__inner) {
  background: rgba(255, 255, 255, 0.03) !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  border-radius: 4px !important;
}
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #8B5CF6 !important;
  border-color: #8B5CF6 !important;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #A78BFA !important;
}

/* ==========================================
   错误提示
   ========================================== */
.login-card__error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.14);
  color: #FCA5A5;
  font-size: 13px;
  line-height: 1.5;
}
.error-fade-enter-active,
.error-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ==========================================
   登录按钮
   ========================================== */
:deep(.login-card__submit) {
  width: 100% !important;
  height: 48px !important;
  margin-top: 8px !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em !important;
  color: #fff !important;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%) !important;
  box-shadow: 0 4px 28px rgba(139, 92, 246, 0.3) !important;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.25s ease !important;
}
:deep(.login-card__submit:hover) {
  transform: scale(1.02);
  box-shadow: 0 8px 36px rgba(139, 92, 246, 0.45) !important;
  filter: brightness(1.06);
}
:deep(.login-card__submit:active) {
  transform: scale(0.98);
  filter: brightness(0.94);
}
:deep(.login-card__submit.is-loading) {
  transform: none;
  filter: brightness(1);
}
</style>
