<template>
  <div class="loading-block">
    <LoaderCircle class="spin" aria-hidden="true" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: 'Cargando',
  },
);
</script>
