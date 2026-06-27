<template>
  <span class="badge" :class="`badge--${tone}`">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: string | boolean | null | undefined;
}>();

const statusMap: Record<string, { label: string; tone: string }> = {
  borrador: { label: 'Borrador', tone: 'draft' },
  emitida: { label: 'Emitida', tone: 'issued' },
  anulada: { label: 'Anulada', tone: 'cancelled' },
  entrada: { label: 'Entrada', tone: 'issued' },
  salida: { label: 'Salida', tone: 'warning' },
  ajuste: { label: 'Ajuste', tone: 'info' },
  anulacion: { label: 'Anulación', tone: 'cancelled' },
  true: { label: 'Activo', tone: 'issued' },
  false: { label: 'Inactivo', tone: 'cancelled' },
};

const badge = computed(() => {
  const key = String(props.value);
  const fallback = { label: props.value ? String(props.value) : 'Sin dato', tone: 'neutral' };
  return statusMap[key] ?? fallback;
});

const label = computed(() => badge.value.label);
const tone = computed(() => badge.value.tone);
</script>
