<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="true">
    <button v-for="message in toast.messages" :key="message.id" class="toast" :class="`toast--${message.type}`" @click="toast.dismiss(message.id)">
      {{ message.text }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast';

const toast = useToastStore();
</script>
