<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" role="presentation" @click.self="$emit('close')" @keydown.escape="$emit('close')">
      <section ref="modalRef" class="modal-sheet" role="dialog" aria-modal="true" :aria-labelledby="titleId">
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
import { nextTick, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';

import AppButton from '@/components/AppButton.vue';

const props = defineProps<{
  open: boolean;
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const titleId = `modal-${Math.random().toString(36).slice(2)}`;
const modalRef = ref<HTMLElement | null>(null);
let previousFocus: HTMLElement | null = null;

function focusTrap(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !modalRef.value) return;
  const focusable = modalRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previousFocus = document.activeElement as HTMLElement | null;
      await nextTick();
      modalRef.value?.querySelector<HTMLElement>('button, [href], input, select, textarea')?.focus();
      document.addEventListener('keydown', focusTrap);
    } else {
      document.removeEventListener('keydown', focusTrap);
      previousFocus?.focus();
    }
  },
);
</script>
