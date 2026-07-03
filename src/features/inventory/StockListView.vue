<template>
  <section class="section-grid">
    <div class="page-header">
      <div>
        <h1>Existencias</h1>
        <p>Consulta el stock actual de los materiales registrados.</p>
      </div>
      <AppButton variant="secondary" :busy="loading" @click="loadStock">
        <template #icon><RefreshCcw aria-hidden="true" /></template>
        Actualizar
      </AppButton>
    </div>

    <form class="toolbar" @submit.prevent="applyFilters">
      <div class="filters-grid">
        <label class="form-field">
          <span>Buscar material</span>
          <input v-model.trim="filters.search" type="search" maxlength="200" placeholder="Nombre o código" />
        </label>

        <label class="form-field">
          <span>Estado</span>
          <select v-model="filters.active">
            <option value="true">Activos</option>
            <option value="">Todos</option>
            <option value="false">Inactivos</option>
          </select>
        </label>

        <label class="form-field checkbox-field checkbox-field--inline">
          <input v-model="filters.lowStock" type="checkbox" />
          <span>Solo bajo stock</span>
        </label>
      </div>
    </form>

    <div class="table-wrap">
      <LoadingBlock v-if="loading" />
      <EmptyState v-else-if="error" title="No se pudo cargar existencias" :message="error" :icon="CircleAlert" />
      <EmptyState v-else-if="rows.length === 0" title="No hay materiales para mostrar" />
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Stock mínimo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rows" :key="item.id">
            <td>
              <strong>{{ item.name }}</strong>
              <small v-if="item.code || item.category_name" class="table-muted">
                {{ [item.code, item.category_name].filter(Boolean).join(' · ') }}
              </small>
            </td>
            <td>{{ formatDecimal(item.current_stock) }} {{ item.unit_abbreviation ?? item.unit_name }}</td>
            <td>{{ item.minimum_stock ? formatDecimal(item.minimum_stock) : 'Sin mínimo' }}</td>
            <td><StatusBadge :value="stockStatus(item)" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginationBar
      v-if="pagination.pages > 1"
      :page="pagination.page"
      :pages="pagination.pages"
      :total="pagination.total"
      @change="goToPage"
    />
  </section>
</template>

<script setup lang="ts">
import { CircleAlert, RefreshCcw } from 'lucide-vue-next';
import { onMounted, reactive, ref } from 'vue';

import { api, extractErrorMessage } from '@/api/http';
import AppButton from '@/components/AppButton.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingBlock from '@/components/LoadingBlock.vue';
import PaginationBar from '@/components/PaginationBar.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { InventoryStockItem, PaginatedResponse, Pagination } from '@/types/contracts';
import { formatDecimal } from '@/utils/format';

const rows = ref<InventoryStockItem[]>([]);
const loading = ref(true);
const error = ref('');
const pagination = reactive<Pagination>({ page: 1, pageSize: 20, total: 0, pages: 1 });
const filters = reactive({ search: '', active: 'true', lowStock: false });

function stockStatus(item: InventoryStockItem) {
  if (Number(item.current_stock) <= 0) {
    return 'agotado';
  }

  if (item.low_stock) {
    return 'bajo_stock';
  }

  return 'normal';
}

function buildParams() {
  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: filters.search || undefined,
    active: filters.active === '' ? undefined : filters.active === 'true',
    lowStock: filters.lowStock || undefined,
  };
}

async function loadStock() {
  loading.value = true;
  error.value = '';

  try {
    const response = await api.get<PaginatedResponse<InventoryStockItem>>('/inventario/existencias', {
      params: buildParams(),
    });
    rows.value = response.data.data;
    Object.assign(pagination, response.data.pagination);
  } catch (loadError) {
    error.value = extractErrorMessage(loadError);
  } finally {
    loading.value = false;
  }
}

async function applyFilters() {
  pagination.page = 1;
  await loadStock();
}

async function goToPage(page: number) {
  pagination.page = page;
  await loadStock();
}

onMounted(loadStock);
</script>
