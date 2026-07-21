<template>
  <div v-if="type === 'table'" class="skeleton-block" :style="{ '--rows': rows }">
    <div v-for="i in rows" :key="i" class="skeleton-row">
      <div class="skeleton-cell" :style="{ width: `${60 + Math.random() * 30}%` }" />
      <div class="skeleton-cell" :style="{ width: `${40 + Math.random() * 30}%` }" />
      <div class="skeleton-cell skeleton-cell--badge" />
      <div class="skeleton-cell skeleton-cell--action" />
    </div>
  </div>

  <div v-else-if="type === 'card'" class="skeleton-block">
    <div v-for="i in rows" :key="i" class="skeleton-row" style="grid-template-columns: 1fr">
      <div class="skeleton-cell skeleton-cell--wide" />
      <div class="skeleton-row" style="grid-template-columns: 1fr 1fr">
        <div class="skeleton-cell" />
        <div class="skeleton-cell" />
      </div>
      <div class="skeleton-cell" style="width: 60%" />
    </div>
  </div>

  <div v-else-if="type === 'metric'" class="skeleton-block" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px">
    <div v-for="i in 3" :key="i" class="skeleton-cell skeleton-cell--wide" style="height: 80px; border-radius: 8px" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'table' | 'card' | 'metric';
    rows?: number;
  }>(),
  {
    type: 'table',
    rows: 5,
  },
);
</script>
