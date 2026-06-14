<script setup lang="ts">
import { ref } from 'vue'; const emit = defineEmits<{ send: [content: string] }>(); const content = ref('')
function handleSend() { if (!content.value.trim()) return; emit('send', content.value.trim()); content.value = '' }
</script>
<template>
  <div class="flex items-end gap-3 p-3 border-t border-border-card">
    <el-input v-model="content" type="textarea" :rows="1" placeholder="输入消息..." resize="none" maxlength="500" @keyup.enter.exact="handleSend" />
    <el-button type="primary" :disabled="!content.trim()" @click="handleSend">发送</el-button>
  </div>
</template>
