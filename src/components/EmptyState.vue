<template>
  <div class="empty-state">
    <component :is="icon" class="empty-state__icon" aria-hidden="true" />
    <strong>{{ title }}</strong>
    <p v-if="message">{{ message }}</p>
    <div v-if="actionLabel" class="empty-state__action">
      <AppButton :variant="actionVariant" :busy="busy" @click="$emit('action')">
        <template v-if="actionIcon" #icon>
          <component :is="actionIcon" aria-hidden="true" />
        </template>
        {{ actionLabel }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inbox, RefreshCcw, type LucideIcon } from 'lucide-vue-next';

import AppButton from '@/components/AppButton.vue';

withDefaults(
  defineProps<{
    title: string;
    message?: string;
    icon?: LucideIcon;
    actionLabel?: string;
    actionIcon?: LucideIcon;
    actionVariant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    busy?: boolean;
  }>(),
  {
    message: '',
    icon: () => Inbox,
    actionLabel: '',
    actionIcon: () => RefreshCcw,
    actionVariant: 'primary',
    busy: false,
  },
);

defineEmits<{
  action: [];
}>();
</script>
