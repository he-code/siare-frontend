<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Perfil</h1>
      </div>
      <AppButton variant="secondary" :busy="loading" @click="sync">
        <template #icon><RefreshCcw aria-hidden="true" /></template>
        Actualizar
      </AppButton>
    </div>

    <div class="detail-panel">
      <div class="detail-grid">
        <div class="detail-item">
          <span>Nombre</span>
          <strong>{{ auth.user?.name }}</strong>
        </div>
        <div class="detail-item">
          <span>Email</span>
          <strong>{{ auth.user?.email }}</strong>
        </div>
        <div class="detail-item">
          <span>Rol</span>
          <strong>{{ auth.user ? roleLabel(auth.user.role) : 'Sin sesión' }}</strong>
        </div>
        <div class="detail-item">
          <span>Cargo</span>
          <strong>{{ auth.user?.position ?? 'Sin cargo' }}</strong>
        </div>
        <div class="detail-item">
          <span>Estado</span>
          <StatusBadge :value="auth.user?.active" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RefreshCcw } from 'lucide-vue-next';
import { ref } from 'vue';

import { extractErrorMessage } from '@/api/http';
import { useAuthStore } from '@/auth/session';
import AppButton from '@/components/AppButton.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { roleLabel } from '@/permissions/capabilities';
import { useToastStore } from '@/stores/toast';

const auth = useAuthStore();
const toast = useToastStore();
const loading = ref(false);

async function sync() {
  loading.value = true;
  try {
    await auth.syncUser();
    toast.success('Perfil actualizado');
  } catch (error) {
    toast.error(extractErrorMessage(error));
  } finally {
    loading.value = false;
  }
}
</script>
