<template>
  <section>
    <div class="page-header">
      <div>
        <h1>{{ config.title }}</h1>
      </div>
      <RouterLink v-if="canManage" :to="`${config.basePath}/nueva`" class="button button--primary">
        <Plus aria-hidden="true" />
        Nueva
      </RouterLink>
    </div>

    <form class="toolbar" @submit.prevent="applyFilters">
      <div class="filters-grid">
        <label class="form-field">
          <span>Número</span>
          <input v-model.trim="filters.number" type="search" maxlength="100" />
        </label>
        <label class="form-field">
          <span>Estado</span>
          <select v-model="filters.status">
            <option value="">Todos</option>
            <option value="borrador">Borrador</option>
            <option value="emitida">Emitida</option>
            <option value="anulada">Anulada</option>
          </select>
        </label>
        <label class="form-field">
          <span>Periodo</span>
          <input v-model="filters.period" type="number" min="2000" max="2200" />
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
      <EmptyState v-else-if="rows.length === 0" title="No hay actas" />
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Fecha</th>
            <th>Periodo</th>
            <th>Estado</th>
            <th>{{ config.kind === 'entry' ? 'Registrado por' : 'Institución' }}</th>
            <th v-if="config.kind === 'entry'">Total</th>
            <th aria-label="Acciones"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.act_number ?? 'Borrador sin número' }}</td>
            <td>{{ formatDate(row.act_date) }}</td>
            <td>{{ row.period ?? 'Sin periodo' }}</td>
            <td><StatusBadge :value="row.status" /></td>
            <td>{{ config.kind === 'entry' ? row.registered_by : row.institution_name }}</td>
            <td v-if="config.kind === 'entry'">{{ formatMoney(row.total) }}</td>
            <td>
              <div class="data-table__actions">
                <RouterLink :to="`${config.basePath}/${row.id}`" class="button button--ghost button--icon" aria-label="Ver detalle">
                  <Eye aria-hidden="true" />
                </RouterLink>
                <RouterLink
                  v-if="canManage && row.status === 'borrador'"
                  :to="`${config.basePath}/${row.id}/editar`"
                  class="button button--ghost button--icon"
                  aria-label="Editar"
                >
                  <Pencil aria-hidden="true" />
                </RouterLink>
                <AppButton v-if="row.status === 'emitida'" variant="ghost" icon-only aria-label="Descargar PDF" @click="download(row)">
                  <template #icon><Download aria-hidden="true" /></template>
                </AppButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginationBar v-if="pagination.pages > 1" :page="pagination.page" :pages="pagination.pages" :total="pagination.total" @change="goToPage" />
  </section>
</template>

<script setup lang="ts">
import { CircleAlert, Download, Eye, Pencil, Plus } from 'lucide-vue-next';
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { api, extractErrorMessage } from '@/api/http';
import { useAuthStore } from '@/auth/session';
import AppButton from '@/components/AppButton.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingBlock from '@/components/LoadingBlock.vue';
import PaginationBar from '@/components/PaginationBar.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { can } from '@/permissions/capabilities';
import { useToastStore } from '@/stores/toast';
import type { ActStatus, PaginatedResponse, Pagination } from '@/types/contracts';
import { downloadPdf } from '@/utils/download';
import { formatDate, formatMoney } from '@/utils/format';
import { actConfigs, type ActKind } from './actConfig';

interface ActListRow {
  id: string;
  act_number: string | null;
  act_date: string;
  period: number | null;
  status: ActStatus;
  total?: string;
  institution_name?: string;
  registered_by: string;
}

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToastStore();

const config = computed(() => actConfigs[route.meta.actKind as ActKind]);
const canManage = computed(() => can(auth.user?.role, config.value.manageCapability));
const rows = ref<ActListRow[]>([]);
const loading = ref(false);
const error = ref('');
const pagination = reactive<Pagination>({ page: 1, pageSize: 20, total: 0, pages: 1 });
const filters = reactive<Record<string, string>>({
  number: '',
  status: '',
  period: '',
  dateFrom: '',
  dateTo: '',
});

let debounceTimer: number | undefined;
let controller: AbortController | null = null;
let requestId = 0;

function syncQuery() {
  filters.number = String(route.query.number ?? '');
  filters.status = String(route.query.status ?? '');
  filters.period = String(route.query.period ?? '');
  filters.dateFrom = String(route.query.dateFrom ?? '');
  filters.dateTo = String(route.query.dateTo ?? '');
  pagination.page = Number(route.query.page ?? 1);
}

function buildParams() {
  const params: Record<string, string | number> = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  };

  for (const [key, value] of Object.entries(filters)) {
    if (value !== '') {
      params[key] = key === 'period' ? Number(value) : value;
    }
  }

  return params;
}

async function loadRows() {
  controller?.abort();
  controller = new AbortController();
  const currentRequest = ++requestId;
  loading.value = true;
  error.value = '';

  try {
    const response = await api.get<PaginatedResponse<ActListRow>>(config.value.endpoint, {
      params: buildParams(),
      signal: controller.signal,
    });

    if (currentRequest === requestId) {
      rows.value = response.data.data;
      Object.assign(pagination, response.data.pagination);
    }
  } catch (loadError) {
    if (currentRequest === requestId) {
      error.value = extractErrorMessage(loadError);
    }
  } finally {
    if (currentRequest === requestId) {
      loading.value = false;
    }
  }
}

function scheduleLoad() {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(async () => {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        query[key] = value;
      }
    }
    if (pagination.page > 1) {
      query.page = String(pagination.page);
    }
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

async function download(row: ActListRow) {
  try {
    await downloadPdf(`${config.value.endpoint}/${row.id}/pdf`, `${row.act_number ?? row.id}.pdf`);
  } catch (downloadError) {
    toast.error(extractErrorMessage(downloadError));
  }
}

watch(
  () => route.meta.actKind,
  () => {
    syncQuery();
    loadRows();
  },
  { immediate: true },
);

watch(filters, () => applyFilters(), { deep: true });
</script>
