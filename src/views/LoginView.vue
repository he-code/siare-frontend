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
            <div style="position: relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" minlength="8" maxlength="200" required style="padding-right: 40px" />
              <AppButton
                type="button"
                variant="ghost"
                icon-only
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                style="position: absolute; right: 2px; top: 50%; transform: translateY(-50%)"
                @click="showPassword = !showPassword"
              >
                <template #icon>
                  <Eye v-if="!showPassword" aria-hidden="true" />
                  <EyeOff v-else aria-hidden="true" />
                </template>
              </AppButton>
            </div>
          </label>

          <p v-if="sessionMessage" class="alert alert--info">{{ sessionMessage }}</p>
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
import { Eye, EyeOff, LogIn, PackageCheck } from 'lucide-vue-next';
import { computed, ref } from 'vue';
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
const showPassword = ref(false);
const sessionMessage = computed(() =>
  route.query.session === 'expired' ? 'Tu sesión expiró o dejó de ser válida. Inicia sesión nuevamente.' : '',
);

async function submit() {
  loading.value = true;
  error.value = '';

  try {
    await auth.login({ email: email.value.toLowerCase(), password: password.value });
    await router.replace(String(route.query.redirect ?? '/dashboard'));
  } catch (loginError) {
    error.value = extractErrorMessage(loginError);
  } finally {
    loading.value = false;
  }
}
</script>
