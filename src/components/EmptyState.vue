<template>
  <div class="empty-state">
    <component :is="icon" class="empty-state__icon" aria-hidden="true" />
    <strong>{{ title }}</strong>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';
import type { Component } from 'vue';

withDefaults(
  defineProps<{
    title: string;
    message?: string;
    icon?: Component;
  }>(),
  {
    message: '',
    icon: Inbox,
  },
);
</script>
