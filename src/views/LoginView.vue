<template>
  <main class="login-page">
    <section class="login-branding" aria-label="SIARE">
      <div class="brand">
        <PackageCheck aria-hidden="true" />
        <span>SIARE</span>
      </div>
      <h1>SIARE</h1>
      <p>Inventario, actas y trazabilidad de materiales institucionales.</p>
    </section>

    <section class="login-card-wrap">
      <div class="login-panel">
        <h2>Inicio de sesión</h2>
        <form class="login-form" @submit.prevent="submit">
          <label class="form-field">
            <span>Email</span>
            <input v-model.trim="email" type="email" autocomplete="email" maxlength="150" required />
          </label>

          <label class="form-field">
            <span>Contraseña</span>
            <input v-model="password" type="password" autocomplete="current-password" minlength="8" maxlength="200" required />
          </label>

          <p v-if="error" class="alert">{{ error }}</p>

          <AppButton type="submit" variant="primary" :busy="loading">
            <template #icon><LogIn aria-hidden="true" /></template>
            Entrar
          </AppButton>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { LogIn, PackageCheck } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { extractErrorMessage } from '@/api/http';
import { useAuthStore } from '@/auth/session';
import AppButton from '@/components/AppButton.vue';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';

  try {
    await auth.login({ email: email.value.toLowerCase(), password: password.value });
    await router.replace(String(route.query.redirect ?? '/'));
  } catch (loginError) {
    error.value = extractErrorMessage(loginError);
  } finally {
    loading.value = false;
  }
}
</script>
