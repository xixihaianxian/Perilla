<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { Note, NoteCreateDTO } from '@/types'
import type { Tag, Topic } from '@/types'
import { mockDB } from '@/mock'
import AppImageUpload from '@/components/common/AppImageUpload.vue'

interface Props {
  initialData?: Note | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: NoteCreateDTO]
  cancel: []
}>()

const form = reactive<NoteCreateDTO>({
  title: props.initialData?.title || '',
  content: props.initialData?.content || '',
  cover_image: props.initialData?.cover_image || '',
  media: props.initialData?.media.map((m) => m.url) || [],
  tag_ids: props.initialData?.tags.map((t) => t.id) || [],
  topic_ids: props.initialData?.topics.map((t) => t.id) || [],
})

const availableTags: Tag[] = [...mockDB.tags.values()]
const availableTopics: Topic[] = [...mockDB.topics.values()]

const selectedTags = ref<Tag[]>(
  props.initialData?.tags || [],
)

const selectedTopics = ref<Topic[]>(
  props.initialData?.topics || [],
)

function onTagSelect(tagId: string) {
  if (form.tag_ids.includes(tagId)) return
  form.tag_ids.push(tagId)
  const tag = availableTags.find((t) => t.id === tagId)
  if (tag) selectedTags.value.push(tag)
}

function removeTag(tagId: string) {
  form.tag_ids = form.tag_ids.filter((id) => id !== tagId)
  selectedTags.value = selectedTags.value.filter((t) => t.id !== tagId)
}

function onTopicSelect(topicId: string) {
  if (form.topic_ids.includes(topicId)) return
  form.topic_ids.push(topicId)
  const topic = availableTopics.find((t) => t.id === topicId)
  if (topic) selectedTopics.value.push(topic)
}

function removeTopic(topicId: string) {
  form.topic_ids = form.topic_ids.filter((id) => id !== topicId)
  selectedTopics.value = selectedTopics.value.filter((t) => t.id !== topicId)
}

function handleSubmit() {
  if (!form.title.trim()) return
  form.cover_image = form.media[0] || ''
  emit('submit', { ...form })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Title -->
    <div>
      <el-input
        v-model="form.title"
        placeholder="请输入笔记标题"
        size="large"
        maxlength="100"
        show-word-limit
      />
    </div>

    <!-- Content -->
    <div>
      <el-input
        v-model="form.content"
        type="textarea"
        placeholder="分享你的想法..."
        :rows="8"
        maxlength="5000"
        show-word-limit
      />
    </div>

    <!-- Image upload -->
    <div>
      <label class="block text-sm font-medium text-text-primary mb-2">
        图片上传（最多9张）
      </label>
      <AppImageUpload v-model="form.media" :max="9" />
    </div>

    <!-- Topic selector -->
    <div>
      <label class="block text-sm font-medium text-text-primary mb-2">选择话题</label>
      <el-select
        placeholder="搜索话题..."
        filterable
        class="w-full"
        @change="onTopicSelect"
      >
        <el-option
          v-for="topic in availableTopics"
          :key="topic.id"
          :label="topic.name"
          :value="topic.id"
        >
          <svg class="icon-svg" style="width: 16px; height: 16px" aria-hidden="true">
            <use :href="'#icon-' + topic.icon"></use>
          </svg>
          <span style="margin-left: 6px">{{ topic.name }}</span>
        </el-option>
      </el-select>
      <div v-if="selectedTopics.length > 0" class="flex flex-wrap gap-2 mt-2">
        <el-tag
          v-for="topic in selectedTopics"
          :key="topic.id"
          closable
          @close="removeTopic(topic.id)"
        >
          <svg class="icon-svg" style="width: 14px; height: 14px; margin-right: 4px" aria-hidden="true">
            <use :href="'#icon-' + topic.icon"></use>
          </svg>
          {{ topic.name }}
        </el-tag>
      </div>
    </div>

    <!-- Tag selector -->
    <div>
      <label class="block text-sm font-medium text-text-primary mb-2">添加标签</label>
      <el-select
        placeholder="搜索标签..."
        filterable
        class="w-full"
        @change="onTagSelect"
      >
        <el-option
          v-for="tag in availableTags"
          :key="tag.id"
          :label="`#${tag.name}`"
          :value="tag.id"
        />
      </el-select>
      <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mt-2">
        <el-tag
          v-for="tag in selectedTags"
          :key="tag.id"
          closable
          @close="removeTag(tag.id)"
        >
          #{{ tag.name }}
        </el-tag>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 justify-end pt-4 border-t border-border">
      <el-button @click="emit('cancel')">取消</el-button>
      <el-button type="primary" native-type="submit" :disabled="!form.title.trim()">
        {{ initialData ? '保存修改' : '发布笔记' }}
      </el-button>
    </div>
  </form>
</template>
