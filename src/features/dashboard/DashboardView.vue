<template>
  <section class="section-grid">
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>{{ greeting }}</p>
      </div>
      <AppButton variant="secondary" :busy="loading" @click="loadSummary">
        <template #icon><RefreshCcw aria-hidden="true" /></template>
        Actualizar
      </AppButton>
    </div>

    <LoadingBlock v-if="loading" />
    <EmptyState v-else-if="error" title="No se pudo cargar el resumen" :message="error" :icon="CircleAlert" />

    <template v-else>
      <div class="metrics-grid">
        <article class="metric-card">
          <span>Materiales activos</span>
          <strong>{{ summary?.active_materials ?? 0 }}</strong>
        </article>
        <article class="metric-card">
          <span>Stock bajo</span>
          <strong>{{ summary?.low_stock_materials ?? 0 }}</strong>
        </article>
        <article class="metric-card">
          <span>Unidades totales</span>
          <strong>{{ formatDecimal(summary?.total_units) }}</strong>
        </article>
      </div>

      <section class="table-wrap">
        <table v-if="summary?.latestMovements?.length" class="data-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in summary.latestMovements" :key="movement.id">
              <td>{{ movement.material_name }}</td>
              <td><StatusBadge :value="movement.movement_type" /></td>
              <td>{{ formatDecimal(movement.quantity) }}</td>
              <td>{{ formatDateTime(movement.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        <EmptyState v-else title="No hay movimientos recientes" />
      </section>
    </template>
  </section>
</template>

<script setup lang="ts">
import { CircleAlert, RefreshCcw } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';

import { api, extractErrorMessage } from '@/api/http';
import { useAuthStore } from '@/auth/session';
import AppButton from '@/components/AppButton.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingBlock from '@/components/LoadingBlock.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { DataResponse, InventorySummary } from '@/types/contracts';
import { formatDateTime, formatDecimal } from '@/utils/format';

const auth = useAuthStore();
const summary = ref<InventorySummary | null>(null);
const loading = ref(true);
const error = ref('');

const greeting = computed(() => (auth.user ? `Sesión de ${auth.user.name}` : 'Sesión activa'));

async function loadSummary() {
  loading.value = true;
  error.value = '';

  try {
    const response = await api.get<DataResponse<InventorySummary>>('/inventario/resumen');
    summary.value = response.data.data;
  } catch (loadError) {
    error.value = extractErrorMessage(loadError);
  } finally {
    loading.value = false;
  }
}

onMounted(loadSummary);
</script>
