<template>
  <button class="button" :class="[`button--${variant}`, { 'button--icon': iconOnly }]" :disabled="disabled || busy">
    <LoaderCircle v-if="busy" class="button__icon spin" aria-hidden="true" />
    <slot name="icon" v-else />
    <span v-if="!iconOnly"><slot /></span>
  </button>
</template>

<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    disabled?: boolean;
    busy?: boolean;
    iconOnly?: boolean;
  }>(),
  {
    variant: 'secondary',
    disabled: false,
    busy: false,
    iconOnly: false,
  },
);
</script>
