<template>
  <nav class="pagination" aria-label="Paginación">
    <span>Página {{ page }} de {{ Math.max(pages, 1) }} · {{ total }} registros</span>
    <div class="pagination__actions">
      <AppButton variant="ghost" :disabled="page <= 1" icon-only aria-label="Página anterior" @click="$emit('change', page - 1)">
        <template #icon><ChevronLeft aria-hidden="true" /></template>
      </AppButton>
      <AppButton variant="ghost" :disabled="page >= pages" icon-only aria-label="Página siguiente" @click="$emit('change', page + 1)">
        <template #icon><ChevronRight aria-hidden="true" /></template>
      </AppButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

import AppButton from '@/components/AppButton.vue';

defineProps<{
  page: number;
  pages: number;
  total: number;
}>();

defineEmits<{
  change: [page: number];
}>();
</script>
