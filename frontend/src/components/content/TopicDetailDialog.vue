<script setup lang="ts">
import { computed, ref } from 'vue'

export interface TopicDialogData {
  title: string
  description: string
  cover_image: string
  avatar: string
  username: string
  bio: string
  created_at: string
  note_count?: number
  follower_count?: number
  star_count?: number
  view_count?: number
}

interface Props {
  modelValue: boolean
  topic: TopicDialogData
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isFollowing = ref(false)

const coverStyle = computed(() => ({
  backgroundImage: props.topic.cover_image
    ? `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.42)), url(${props.topic.cover_image})`
    : 'linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-tertiary))',
}))

function closeDialog() {
  emit('update:modelValue', false)
}

function formatTime(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function formatCount(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}
</script>

<template>
  <teleport to="body">
    <transition name="topic-dialog">
      <div v-if="modelValue" class="topic-dialog" @click.self="closeDialog">
        <button class="topic-dialog__close" type="button" aria-label="关闭话题详情" @click="closeDialog">
          <el-icon :size="24"><Close /></el-icon>
        </button>

        <section class="topic-dialog__panel" role="dialog" aria-modal="true">
          <div class="topic-dialog__cover" :style="coverStyle">
            <div class="topic-dialog__cover-badge">话题</div>
            <div class="topic-dialog__cover-title">
              <img
                v-if="topic.avatar"
                :src="topic.avatar"
                class="topic-dialog__cover-avatar"
                alt=""
              />
              <span>{{ topic.title }}</span>
            </div>
          </div>

          <aside class="topic-dialog__content">
            <header class="topic-dialog__header">
              <div class="topic-dialog__avatar">
                <img
                  v-if="topic.avatar"
                  :src="topic.avatar"
                  class="topic-dialog__avatar-img"
                  alt=""
                />
              </div>
              <div class="min-w-0">
                <p class="topic-dialog__label">{{ topic.username }}</p>
                <p class="topic-dialog__bio">{{ topic.bio }}</p>
              </div>
              <button
                class="topic-dialog__follow"
                type="button"
                :class="{ 'topic-dialog__follow--active': isFollowing }"
                @click="isFollowing = !isFollowing"
              >
                {{ isFollowing ? '已关注' : '关注' }}
              </button>
            </header>

            <div class="topic-dialog__body">
              <h3>话题简介</h3>
              <p>{{ topic.title }}</p>

              <div class="topic-dialog__stats">
                <div>
                  <strong>{{ formatCount(topic.note_count ?? 0) }}</strong>
                  <span>笔记</span>
                </div>
                <div>
                  <strong>{{ formatCount(topic.follower_count ?? 0) }}</strong>
                  <span>关注</span>
                </div>
                <div>
                  <strong>{{ formatTime(topic.created_at) }}</strong>
                  <span>创建时间</span>
                </div>
              </div>

              <div class="topic-dialog__placeholder">
                <p class="topic-dialog__placeholder-title">详情内容</p>
                <p>{{ topic.description }}</p>
              </div>
            </div>

            <footer class="topic-dialog__footer">
              <button type="button">
                <el-icon :size="20"><ChatDotRound /></el-icon>
                讨论
              </button>
              <button type="button">
                <el-icon :size="20"><Star /></el-icon>
                收藏
              </button>
              <button type="button">
                <el-icon :size="20"><Share /></el-icon>
                分享
              </button>
              <button type="button">
                <el-icon :size="20"><View /></el-icon>
                {{ formatCount(topic.view_count ?? 0) }}
              </button>
            </footer>
          </aside>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.topic-dialog {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(8px);
}

.topic-dialog__close {
  position: fixed;
  top: 28px;
  left: 28px;
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: rgba(139, 92, 246, 0.8);
  cursor: pointer;
  transition: transform var(--transition-fast), background var(--transition-fast);
}

.topic-dialog__close:hover {
  background: var(--color-primary);
  transform: scale(1.04);
}

.topic-dialog__panel {
  width: min(1280px, calc(100vw - 120px));
  height: min(760px, calc(100vh - 80px));
  display: grid;
  grid-template-columns: minmax(420px, 1.35fr) minmax(360px, 0.85fr);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: #0f0f13;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.56);
}

.topic-dialog__cover {
  position: relative;
  min-height: 360px;
  background-position: center;
  background-size: cover;
}

.topic-dialog__cover-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 7px 12px;
  border-radius: 999px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(10px);
}

.topic-dialog__cover-title {
  position: absolute;
  left: 34px;
  right: 34px;
  bottom: 34px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.15;
}

.topic-dialog__icon {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.35));
}

.topic-dialog__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #111115;
  color: var(--color-text-primary);
}

.topic-dialog__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 30px 32px 22px;
}

.topic-dialog__avatar {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--color-bg-secondary);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.topic-dialog__avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
}

.topic-dialog__cover-avatar {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  object-fit: cover;
  flex: 0 0 auto;
  border: 2px solid rgba(255, 255, 255, 0.6);
}

.topic-dialog__label {
  color: var(--color-text-tertiary);
  font-size: 13px;
  font-weight: 650;
}

.topic-dialog__bio {
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.topic-dialog__name {
  margin-top: 2px;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topic-dialog__follow {
  min-width: 96px;
  height: 44px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: var(--color-primary);
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.topic-dialog__follow:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.topic-dialog__follow--active {
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
}

.topic-dialog__body {
  flex: 1;
  overflow-y: auto;
  padding: 6px 32px 24px;
}

.topic-dialog__body h3 {
  margin-bottom: 10px;
  font-size: 22px;
  font-weight: 800;
}

.topic-dialog__body p {
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.8;
}

.topic-dialog__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 24px 0;
}

.topic-dialog__stats div {
  min-width: 0;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.topic-dialog__stats strong,
.topic-dialog__stats span {
  display: block;
}

.topic-dialog__stats strong {
  overflow: hidden;
  font-size: 18px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topic-dialog__stats span {
  margin-top: 4px;
  color: var(--color-text-tertiary);
  font-size: 12px;
}

.topic-dialog__placeholder {
  padding: 18px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
}

.topic-dialog__placeholder-title {
  margin-bottom: 4px;
  color: var(--color-text-primary) !important;
  font-weight: 800;
}

.topic-dialog__footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 32px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.topic-dialog__footer button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  color: var(--color-text-secondary);
  background: transparent;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.topic-dialog__footer button:hover {
  color: var(--color-text-primary);
}

.topic-dialog-enter-active,
.topic-dialog-leave-active {
  transition: opacity var(--transition-normal);
}

.topic-dialog-enter-active .topic-dialog__panel,
.topic-dialog-leave-active .topic-dialog__panel {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.topic-dialog-enter-from,
.topic-dialog-leave-to {
  opacity: 0;
}

.topic-dialog-enter-from .topic-dialog__panel,
.topic-dialog-leave-to .topic-dialog__panel {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

@media (max-width: 980px) {
  .topic-dialog {
    padding: 18px;
  }

  .topic-dialog__panel {
    width: 100%;
    height: calc(100vh - 36px);
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .topic-dialog__cover {
    min-height: 42vh;
  }

  .topic-dialog__content {
    min-height: 420px;
  }

  .topic-dialog__close {
    top: 16px;
    left: 16px;
    z-index: 2;
  }
}

@media (max-width: 640px) {
  .topic-dialog__header {
    grid-template-columns: auto minmax(0, 1fr);
    padding: 24px 20px 16px;
  }

  .topic-dialog__follow {
    grid-column: 1 / -1;
    width: 100%;
  }

  .topic-dialog__body {
    padding: 4px 20px 20px;
  }

  .topic-dialog__stats {
    grid-template-columns: 1fr;
  }

  .topic-dialog__footer {
    padding: 16px 20px 22px;
  }
}
</style>
