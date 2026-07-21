<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <ToastStack />
</template>

<script setup lang="ts">
import ToastStack from '@/components/ToastStack.vue';
import { useThemeStore } from '@/stores/theme';

useThemeStore();
</script>
