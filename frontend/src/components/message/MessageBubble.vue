<script setup lang="ts">import type { Message } from '@/types'; interface Props { message: Message; isMine: boolean }; defineProps<Props>()</script>
<template>
  <div class="flex mb-4" :class="isMine ? 'justify-end' : 'justify-start'">
    <div class="max-w-[70%]">
      <div class="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed" :class="isMine ? 'bg-primary text-white rounded-br-md' : 'bg-gray-100 text-text-card-primary rounded-bl-md'">{{ message.content }}</div>
      <p class="text-xs text-text-card-tertiary mt-1" :class="isMine ? 'text-right' : 'text-left'">{{ new Date(message.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}</p>
    </div>
  </div>
</template>
