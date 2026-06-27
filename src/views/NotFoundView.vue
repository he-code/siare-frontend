<template>
  <main class="page-frame">
    <section class="panel">
      <EmptyState title="Página no encontrada" message="La ruta solicitada no existe." :icon="FileQuestion" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { FileQuestion } from 'lucide-vue-next';

import EmptyState from '@/components/EmptyState.vue';
</script>
