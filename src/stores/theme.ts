import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const stored = localStorage.getItem('siare-theme');
  const isDark = ref(stored === 'dark');

  function apply(dark: boolean) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('siare-theme', dark ? 'dark' : 'light');
  }

  function toggle() {
    isDark.value = !isDark.value;
  }

  watch(isDark, apply, { immediate: true });

  return { isDark, toggle };
});
