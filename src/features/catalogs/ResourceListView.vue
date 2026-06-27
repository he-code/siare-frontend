<template>
  <section>
    <div class="page-header">
      <div>
        <h1>{{ config?.title ?? 'Catálogo' }}</h1>
      </div>
      <AppButton v-if="config && canManage" variant="primary" @click="openCreate">
        <template #icon><Plus aria-hidden="true" /></template>
        Nuevo
      </AppButton>
    </div>

    <nav v-if="isCatalogRoute" class="tabs" aria-label="Catálogos">
      <RouterLink v-for="tab in visibleTabs" :key="tab.key" :to="`/catalogos/${tab.key}`">
        {{ tab.title }}
      </RouterLink>
    </nav>

    <div v-if="!config" class="panel">
      <EmptyState title="No se encontró el recurso" />
    </div>

    <template v-else>
      <form class="toolbar" @submit.prevent="applyFilters">
        <div class="filters-grid">
          <label v-if="config.search" class="form-field">
            <span>Buscar</span>
            <input v-model.trim="filters.search" type="search" maxlength="200" />
          </label>

          <label v-if="config.activeFilter" class="form-field">
            <span>Estado</span>
            <select v-model="filters.active">
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </label>

          <label v-for="filter in config.filters" :key="filter.key" class="form-field">
            <span>{{ filter.label }}</span>
            <select v-model="filters[filter.key]">
              <option value="">Todos</option>
              <option v-for="option in optionsFor(filter.key)" :key="String(option.value)" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>
      </form>

      <div class="table-wrap">
        <LoadingBlock v-if="loading" />
        <EmptyState v-else-if="error" title="No se pudo cargar" :message="error" :icon="CircleAlert" />
        <EmptyState v-else-if="rows.length === 0" :title="config.emptyTitle" />
        <table v-else class="data-table">
          <thead>
            <tr>
              <th v-for="column in config.columns" :key="column.key">{{ column.label }}</th>
              <th v-if="canManage" aria-label="Acciones"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="String(row.id)">
              <td v-for="column in config.columns" :key="column.key">
                <StatusBadge v-if="column.kind === 'active' || column.kind === 'status'" :value="badgeValue(row, column.key)" />
                <span v-else>{{ formatCell(row, column) }}</span>
              </td>
              <td v-if="canManage">
                <div class="data-table__actions">
                  <AppButton variant="ghost" icon-only aria-label="Editar" @click="openEdit(row)">
                    <template #icon><Pencil aria-hidden="true" /></template>
                  </AppButton>
                </div>
              </td>
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
    </template>

    <ModalSheet :open="formOpen" :title="formMode === 'create' ? `Nuevo ${config?.title}` : `Editar ${config?.title}`" @close="formOpen = false">
      <form v-if="config" class="modal-body" @submit.prevent="submitForm">
        <div class="field-grid">
          <label
            v-for="field in visibleFields"
            :key="field.name"
            class="form-field"
            :class="{ 'field--full': field.fullSpan, 'checkbox-field': field.type === 'checkbox' }"
          >
            <template v-if="field.type === 'checkbox'">
              <input v-model="form[field.name]" type="checkbox" />
              <span>{{ field.label }}</span>
            </template>
            <template v-else>
              <span>{{ field.label }}</span>
              <textarea
                v-if="field.type === 'textarea'"
                v-model="form[field.name]"
                rows="4"
                :required="field.required"
                :minlength="field.minLength"
                :maxlength="field.maxLength"
              />
              <select v-else-if="field.type === 'select' || field.type === 'remote-select'" v-model="form[field.name]" :required="field.required">
                <option value="">Selecciona</option>
                <option v-for="option in fieldOptions(field)" :key="String(option.value)" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <input
                v-else
                v-model="form[field.name]"
                :type="field.type"
                :required="field.required && !(formMode === 'edit' && field.omitWhenEmpty)"
                :minlength="field.minLength"
                :maxlength="field.maxLength"
                :step="field.type === 'number' ? '0.01' : undefined"
              />
            </template>
          </label>
        </div>

        <p v-if="formError" class="alert">{{ formError }}</p>

        <footer class="modal-actions">
          <AppButton type="button" variant="ghost" @click="formOpen = false">Cancelar</AppButton>
          <AppButton type="submit" variant="primary" :busy="saving">Guardar</AppButton>
        </footer>
      </form>
    </ModalSheet>
  </section>
</template>

<script setup lang="ts">
import { CircleAlert, Pencil, Plus } from 'lucide-vue-next';
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { createResource, listResource, updateResource } from '@/api/resources';
import { extractErrorMessage } from '@/api/http';
import { useAuthStore } from '@/auth/session';
import AppButton from '@/components/AppButton.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingBlock from '@/components/LoadingBlock.vue';
import ModalSheet from '@/components/ModalSheet.vue';
import PaginationBar from '@/components/PaginationBar.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { can } from '@/permissions/capabilities';
import { useToastStore } from '@/stores/toast';
import type { Pagination } from '@/types/contracts';
import { formatDate, formatDateTime, formatDecimal, formatMoney, toNumber } from '@/utils/format';
import { catalogTabs, resourceConfigs, type ColumnConfig, type FieldConfig, type SelectOption } from './resourceConfigs';

type Row = Record<string, unknown> & { id: string };

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToastStore();

const rows = ref<Row[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const formError = ref('');
const formOpen = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const selectedRow = ref<Row | null>(null);
const pagination = reactive<Pagination>({ page: 1, pageSize: 20, total: 0, pages: 1 });
const filters = reactive<Record<string, string>>({ search: '', active: '' });
const form = reactive<Record<string, any>>({});
const remoteOptions = reactive<Record<string, SelectOption[]>>({});

let debounceTimer: number | undefined;
let controller: AbortController | null = null;
let requestId = 0;

const resourceKey = computed(() => String(route.meta.resourceKey ?? route.params.resource ?? ''));
const config = computed(() => resourceConfigs[resourceKey.value]);
const isCatalogRoute = computed(() => route.name === 'catalogs');
const canManage = computed(() => Boolean(config.value?.manageCapability && can(auth.user?.role, config.value.manageCapability)));
const visibleFields = computed(() => config.value?.fields.filter((field) => !(formMode.value === 'edit' && field.createOnly)) ?? []);
const visibleTabs = computed(() => catalogTabs.filter((tab) => can(auth.user?.role, tab.readCapability)));

function getValue(row: Row, key: string) {
  return key.split('.').reduce<unknown>((value, part) => {
    if (value && typeof value === 'object') {
      return (value as Record<string, unknown>)[part];
    }

    return undefined;
  }, row);
}

function badgeValue(row: Row, key: string) {
  const value = getValue(row, key);
  if (typeof value === 'string' || typeof value === 'boolean' || value === null || value === undefined) {
    return value;
  }

  return String(value);
}

function formatCell(row: Row, column: ColumnConfig) {
  const value = getValue(row, column.key);

  if (value === null || value === undefined || value === '') {
    return 'Sin dato';
  }

  if (column.kind === 'date') {
    return formatDate(String(value));
  }

  if (column.kind === 'datetime') {
    return formatDateTime(String(value));
  }

  if (column.kind === 'decimal') {
    return formatDecimal(String(value));
  }

  if (column.kind === 'money') {
    return formatMoney(String(value));
  }

  return String(value);
}

function optionLabel(row: Record<string, unknown>, keys: string[]) {
  return keys
    .map((key) => row[key])
    .filter((value) => value !== null && value !== undefined && value !== '')
    .join(' · ');
}

async function loadRemoteOptions(key: string, remote?: { endpoint: string; labelKeys: string[]; params?: Record<string, string | number | boolean> }) {
  if (!remote || remoteOptions[key]) {
    return;
  }

  const response = await listResource<Record<string, unknown>>(remote.endpoint, { pageSize: 100, ...(remote.params ?? {}) });
  remoteOptions[key] = response.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, remote.labelKeys) || String(item.id),
  }));
}

function optionsFor(key: string) {
  return remoteOptions[key] ?? [];
}

function fieldOptions(field: FieldConfig) {
  return field.options ?? remoteOptions[field.name] ?? [];
}

function syncFiltersFromQuery() {
  const query = route.query;
  filters.search = String(query.search ?? '');
  filters.active = String(query.active ?? '');
  pagination.page = Number(query.page ?? 1);

  for (const filter of config.value?.filters ?? []) {
    filters[filter.key] = String(query[filter.key] ?? '');
  }
}

function buildParams() {
  const params: Record<string, string | number | boolean> = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  };

  for (const [key, value] of Object.entries(filters)) {
    if (value !== '') {
      params[key] = key === 'active' ? value === 'true' : value;
    }
  }

  return params;
}

async function loadRows() {
  if (!config.value) {
    return;
  }

  if (!can(auth.user?.role, config.value.readCapability)) {
    await router.replace('/403');
    return;
  }

  controller?.abort();
  controller = new AbortController();
  const currentRequest = ++requestId;
  loading.value = true;
  error.value = '';

  try {
    const response = await listResource<Row>(config.value.endpoint, buildParams(), controller.signal);

    if (currentRequest === requestId) {
      rows.value = response.data;
      Object.assign(pagination, response.pagination);
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
      if (value !== '') {
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

function resetForm(row?: Row) {
  for (const field of config.value?.fields ?? []) {
    const key = field.responseKey ?? field.name;
    const value = row ? getValue(row, key) : undefined;

    if (field.type === 'checkbox') {
      form[field.name] = value === undefined ? true : Boolean(value);
    } else {
      form[field.name] = value === null || value === undefined ? '' : String(value);
    }
  }
}

async function openCreate() {
  formMode.value = 'create';
  selectedRow.value = null;
  formError.value = '';
  resetForm();
  formOpen.value = true;
  await loadFormOptions();
}

async function openEdit(row: Row) {
  formMode.value = 'edit';
  selectedRow.value = row;
  formError.value = '';
  resetForm(row);
  formOpen.value = true;
  await loadFormOptions();
}

async function loadFormOptions() {
  const tasks: Promise<void>[] = [];
  for (const field of config.value?.fields ?? []) {
    if (field.remote) {
      tasks.push(loadRemoteOptions(field.name, field.remote));
    }
  }
  for (const filter of config.value?.filters ?? []) {
    if (filter.remote) {
      tasks.push(loadRemoteOptions(filter.key, filter.remote));
    }
  }
  await Promise.all(tasks);
}

function buildBody() {
  const body: Record<string, unknown> = {};

  for (const field of visibleFields.value) {
    const value = form[field.name];

    if (field.omitWhenEmpty && (value === '' || value === null || value === undefined)) {
      continue;
    }

    if (field.type === 'number') {
      body[field.name] = toNumber(value);
    } else if (field.type === 'checkbox') {
      body[field.name] = Boolean(value);
    } else if (value === '') {
      body[field.name] = field.required ? '' : null;
    } else {
      body[field.name] = value;
    }
  }

  return body;
}

function validateBeforeSubmit(body: Record<string, unknown>) {
  if (resourceKey.value === 'users' && formMode.value === 'edit' && selectedRow.value?.id === auth.user?.id && body.active === false) {
    return 'No puedes desactivar tu propia cuenta.';
  }

  const password = body.password;
  if (password && String(password).length < 12) {
    return 'La contraseña debe tener al menos 12 caracteres.';
  }

  return '';
}

async function submitForm() {
  if (!config.value) {
    return;
  }

  const body = buildBody();
  const validationMessage = validateBeforeSubmit(body);

  if (validationMessage) {
    formError.value = validationMessage;
    return;
  }

  saving.value = true;
  formError.value = '';

  try {
    if (formMode.value === 'create') {
      await createResource(config.value.endpoint, body);
    } else if (selectedRow.value) {
      await updateResource(config.value.endpoint, selectedRow.value.id, body);
      if (resourceKey.value === 'users' && selectedRow.value.id === auth.user?.id) {
        await auth.syncUser();
      }
    }

    toast.success('Registro guardado');
    formOpen.value = false;
    await loadRows();
  } catch (submitError) {
    formError.value = extractErrorMessage(submitError);
  } finally {
    saving.value = false;
  }
}

watch(
  () => resourceKey.value,
  async () => {
    syncFiltersFromQuery();
    await loadFormOptions();
    await loadRows();
  },
  { immediate: true },
);

watch(
  filters,
  () => {
    pagination.page = 1;
    scheduleLoad();
  },
  { deep: true },
);
</script>
