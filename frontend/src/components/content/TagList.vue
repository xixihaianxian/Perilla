<script setup lang="ts">import type { Tag } from '@/types'; interface Props { tags: Tag[] }; defineProps<Props>()</script>
<template>
  <div class="flex flex-wrap gap-1.5">
    <router-link v-for="tag in tags" :key="tag.id" :to="`/search?q=${encodeURIComponent(tag.name)}`" class="inline-flex items-center px-2.5 py-0.5 bg-bg-tertiary text-text-secondary text-[11px] rounded-full hover:bg-primary/15 hover:text-primary transition-colors">#{{ tag.name }}</router-link>
  </div>
</template>
