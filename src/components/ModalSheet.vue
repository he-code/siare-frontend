<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" role="presentation" @click.self="$emit('close')">
      <section class="modal-sheet" role="dialog" aria-modal="true" :aria-labelledby="titleId">
        <header class="modal-sheet__header">
          <h2 :id="titleId">{{ title }}</h2>
          <AppButton variant="ghost" icon-only aria-label="Cerrar" @click="$emit('close')">
            <template #icon><X aria-hidden="true" /></template>
          </AppButton>
        </header>
        <slot />
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

import AppButton from '@/components/AppButton.vue';

defineProps<{
  open: boolean;
  title: string;
}>();

defineEmits<{
  close: [];
}>();

const titleId = `modal-${Math.random().toString(36).slice(2)}`;
</script>
