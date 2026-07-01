<template>
  <div class="empty-state">
    <component :is="icon" class="empty-state__icon" aria-hidden="true" />
    <strong>{{ title }}</strong>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { Inbox, type LucideIcon } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    title: string;
    message?: string;
    icon?: LucideIcon;
  }>(),
  {
    message: '',
    icon: () => Inbox,
  },
);
</script>
