<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Movimientos de inventario</h1>
      </div>
      <AppButton variant="secondary" :busy="loading" @click="loadRows">
        <template #icon><RefreshCcw aria-hidden="true" /></template>
        Actualizar
      </AppButton>
    </div>

    <p v-if="filterError" class="alert">{{ filterError }}</p>

    <form class="toolbar" @submit.prevent="applyFilters">
      <div class="filters-grid">
        <label class="form-field">
          <span>Material</span>
          <select v-model="filters.materialId">
            <option value="">Todos</option>
            <option v-for="option in materialOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </label>
        <label class="form-field">
          <span>Tipo</span>
          <select v-model="filters.type">
            <option value="">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
            <option value="anulacion">Anulación</option>
          </select>
        </label>
        <label class="form-field">
          <span>Desde</span>
          <input v-model="filters.dateFrom" type="date" />
        </label>
        <label class="form-field">
          <span>Hasta</span>
          <input v-model="filters.dateTo" type="date" />
        </label>
      </div>
    </form>

    <div class="table-wrap">
      <LoadingBlock v-if="loading" />
      <EmptyState v-else-if="error" title="No se pudo cargar" :message="error" :icon="CircleAlert" />
      <EmptyState v-else-if="rows.length === 0" title="No hay movimientos" />
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Stock anterior</th>
            <th>Stock nuevo</th>
            <th>Responsable</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.material_code ? `${row.material_code} · ${row.material_name}` : row.material_name }}</td>
            <td><StatusBadge :value="row.movement_type" /></td>
            <td>{{ formatDecimal(row.quantity) }}</td>
            <td>{{ formatDecimal(row.previous_stock) }}</td>
            <td>{{ formatDecimal(row.new_stock) }}</td>
            <td>{{ row.responsible_user }}</td>
            <td>{{ formatDateTime(row.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginationBar v-if="pagination.pages > 1" :page="pagination.page" :pages="pagination.pages" :total="pagination.total" @change="goToPage" />
  </section>
</template>

<script setup lang="ts">
import { CircleAlert, RefreshCcw } from 'lucide-vue-next';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { api, extractErrorMessage } from '@/api/http';
import { listResource } from '@/api/resources';
import AppButton from '@/components/AppButton.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingBlock from '@/components/LoadingBlock.vue';
import PaginationBar from '@/components/PaginationBar.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { InventoryMovement, PaginatedResponse, Pagination } from '@/types/contracts';
import { formatDateTime, formatDecimal } from '@/utils/format';

interface Option {
  value: string;
  label: string;
}

const router = useRouter();
const rows = ref<InventoryMovement[]>([]);
const materialOptions = ref<Option[]>([]);
const loading = ref(false);
const error = ref('');
const filterError = ref('');
const pagination = reactive<Pagination>({ page: 1, pageSize: 20, total: 0, pages: 1 });
const filters = reactive<Record<string, string>>({
  materialId: '',
  type: '',
  dateFrom: '',
  dateTo: '',
});

let debounceTimer: number | undefined;

function buildParams() {
  const params: Record<string, string | number> = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  };

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      params[key] = value;
    }
  }

  return params;
}

async function loadRows() {
  loading.value = true;
  error.value = '';

  try {
    const response = await api.get<PaginatedResponse<InventoryMovement>>('/inventario/movimientos', { params: buildParams() });
    rows.value = response.data.data;
    Object.assign(pagination, response.data.pagination);
  } catch (loadError) {
    error.value = extractErrorMessage(loadError);
  } finally {
    loading.value = false;
  }
}

function scheduleLoad() {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(async () => {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value) query[key] = value;
    }
    if (pagination.page > 1) query.page = String(pagination.page);
    await router.replace({ query });
    await loadRows();
  }, 350);
}

function applyFilters() {
  pagination.page = 1;
  scheduleLoad();
}

function goToPage(page: number) {
  pagination.page = page;
  scheduleLoad();
}

async function loadMaterials() {
  filterError.value = '';

  try {
    const response = await listResource<Record<string, unknown>>('/materiales', { pageSize: 100, active: true });
    materialOptions.value = response.data.map((item) => ({
      value: String(item.id),
      label: [item.code, item.name].filter(Boolean).join(' · '),
    }));
  } catch (loadError) {
    materialOptions.value = [];
    filterError.value = `No se pudo cargar el filtro de materiales: ${extractErrorMessage(loadError)}`;
  }
}

watch(filters, () => applyFilters(), { deep: true });

onMounted(async () => {
  await Promise.allSettled([loadMaterials(), loadRows()]);
});
</script>
