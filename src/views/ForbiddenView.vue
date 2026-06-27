<template>
  <section class="panel">
    <EmptyState title="Sin permisos" message="Tu rol actual no habilita esta ruta." :icon="ShieldAlert" />
  </section>
</template>

<script setup lang="ts">
import { ShieldAlert } from 'lucide-vue-next';

import EmptyState from '@/components/EmptyState.vue';
</script>
