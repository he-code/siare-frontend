<template>
  <section>
    <div class="page-header">
      <div>
        <h1>{{ isEditing ? `Editar ${config.singular}` : `Nueva ${config.singular}` }}</h1>
      </div>
      <div class="topbar__actions">
        <RouterLink :to="config.basePath" class="button button--secondary">
          <ArrowLeft aria-hidden="true" />
          Volver
        </RouterLink>
        <AppButton variant="primary" :busy="saving" @click="submit">
          <template #icon><Save aria-hidden="true" /></template>
          Guardar
        </AppButton>
      </div>
    </div>

    <LoadingBlock v-if="loading" />
    <EmptyState v-else-if="loadError" title="No se pudo cargar" :message="loadError" :icon="CircleAlert" />

    <form v-else class="section-grid" @submit.prevent="submit">
      <section class="detail-panel">
        <div v-if="isEntry" class="field-grid">
          <label class="form-field">
            <span>Fecha</span>
            <input v-model="entryForm.actDate" type="date" required />
          </label>
          <label class="form-field">
            <span>Autoridad</span>
            <select v-model="entryForm.authorizedById">
              <option value="">Sin autoridad</option>
              <option v-for="option in authorityOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </label>
          <label class="form-field">
            <span>Proceso</span>
            <select v-model="entryForm.acquisitionProcessId">
              <option value="">Sin proceso</option>
              <option v-for="option in acquisitionOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </label>
          <label class="form-field field--full">
            <span>Concepto</span>
            <textarea v-model="entryForm.concept" maxlength="3000" rows="3" />
          </label>
          <label class="form-field field--full">
            <span>Notas</span>
            <textarea v-model="entryForm.notes" maxlength="3000" rows="3" />
          </label>
        </div>

        <div v-else class="field-grid">
          <label class="form-field">
            <span>Fecha</span>
            <input v-model="deliveryForm.actDate" type="date" required />
          </label>
          <label class="form-field">
            <span>Institución</span>
            <select v-model="deliveryForm.institutionId" required>
              <option value="">Selecciona</option>
              <option v-for="option in institutionOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </label>
          <label class="form-field">
            <span>Líder</span>
            <select v-model="deliveryForm.leaderId" required>
              <option value="">Selecciona</option>
              <option v-for="option in leaderOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </label>
          <label class="form-field">
            <span>Asunto</span>
            <input v-model="deliveryForm.subject" maxlength="200" />
          </label>
          <label class="form-field field--full">
            <span>Notas</span>
            <textarea v-model="deliveryForm.notes" maxlength="3000" rows="3" />
          </label>
        </div>
      </section>

      <section class="detail-panel section-grid">
        <div class="page-header">
          <div>
            <h2>Materiales</h2>
          </div>
          <AppButton type="button" variant="secondary" @click="addItem">
            <template #icon><Plus aria-hidden="true" /></template>
            Agregar
          </AppButton>
        </div>

        <div class="items-editor">
          <div
            v-for="(item, index) in currentItems"
            :key="item.localId"
            class="items-editor__row"
            :class="{ 'items-editor__row--delivery': !isEntry }"
          >
            <label class="form-field">
              <span>Material</span>
              <select v-model="item.materialId" required>
                <option value="">Selecciona</option>
                <option v-for="option in materialOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
            </label>

            <label class="form-field">
              <span>Cantidad</span>
              <input v-model="item.quantity" type="number" min="0.01" step="0.01" required />
            </label>

            <template v-if="isEntry && isEntryItem(item)">
              <label class="form-field">
                <span>Valor unitario</span>
                <input v-model="item.unitValue" type="number" min="0" step="0.01" required />
              </label>
              <label class="form-field">
                <span>IVA %</span>
                <input v-model="item.vatPercentage" type="number" min="0" max="100" step="0.01" :disabled="!item.appliesVat" />
              </label>
              <div>
                <label class="checkbox-field">
                  <input v-model="item.appliesVat" type="checkbox" @change="syncVat(item)" />
                  <span>Aplica IVA</span>
                </label>
                <div class="item-total">{{ entryPreview(item) }}</div>
              </div>
            </template>

            <label v-else class="form-field">
              <span>Notas</span>
              <input v-model="item.notes" maxlength="1000" />
            </label>

            <AppButton type="button" variant="ghost" icon-only aria-label="Quitar material" :disabled="currentItems.length === 1" @click="removeItem(index)">
              <template #icon><Trash2 aria-hidden="true" /></template>
            </AppButton>
          </div>
        </div>

        <p v-if="formError" class="alert">{{ formError }}</p>
      </section>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft, CircleAlert, Plus, Save, Trash2 } from 'lucide-vue-next';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { api, extractErrorMessage } from '@/api/http';
import { listResource } from '@/api/resources';
import AppButton from '@/components/AppButton.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingBlock from '@/components/LoadingBlock.vue';
import { useToastStore } from '@/stores/toast';
import type { ActDetail, DataResponse, DeliveryActDetail, EntryActDetail, EntryActItem } from '@/types/contracts';
import { formatMoney, todayDateOnly } from '@/utils/format';
import { actConfigs, type ActKind } from './actConfig';

interface Option {
  value: string;
  label: string;
}

interface EntryFormItem {
  localId: string;
  materialId: string;
  quantity: string;
  unitValue: string;
  appliesVat: boolean;
  vatPercentage: string;
  notes: string;
}

interface DeliveryFormItem {
  localId: string;
  materialId: string;
  quantity: string;
  notes: string;
}

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const config = computed(() => actConfigs[route.meta.actKind as ActKind]);
const isEntry = computed(() => config.value.kind === 'entry');
const isEditing = computed(() => Boolean(route.params.id));
const id = computed(() => String(route.params.id ?? ''));
const loading = ref(false);
const saving = ref(false);
const loadError = ref('');
const formError = ref('');
const materialOptions = ref<Option[]>([]);
const authorityOptions = ref<Option[]>([]);
const acquisitionOptions = ref<Option[]>([]);
const institutionOptions = ref<Option[]>([]);
const leaderOptions = ref<Option[]>([]);
const hydrating = ref(false);

const entryForm = reactive({
  acquisitionProcessId: '',
  authorizedById: '',
  actDate: todayDateOnly(),
  concept: '',
  notes: '',
  items: [] as EntryFormItem[],
});

const deliveryForm = reactive({
  institutionId: '',
  leaderId: '',
  actDate: todayDateOnly(),
  subject: '',
  notes: '',
  items: [] as DeliveryFormItem[],
});

const currentItems = computed(() => (isEntry.value ? entryForm.items : deliveryForm.items));

function newLocalId() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

function makeEntryItem(): EntryFormItem {
  return {
    localId: newLocalId(),
    materialId: '',
    quantity: '1',
    unitValue: '0',
    appliesVat: false,
    vatPercentage: '0',
    notes: '',
  };
}

function makeDeliveryItem(): DeliveryFormItem {
  return {
    localId: newLocalId(),
    materialId: '',
    quantity: '1',
    notes: '',
  };
}

function isEntryItem(item: EntryFormItem | DeliveryFormItem): item is EntryFormItem {
  return 'unitValue' in item;
}

function addItem() {
  if (isEntry.value) {
    entryForm.items.push(makeEntryItem());
  } else {
    deliveryForm.items.push(makeDeliveryItem());
  }
}

function removeItem(index: number) {
  if (currentItems.value.length <= 1) {
    return;
  }

  currentItems.value.splice(index, 1);
}

function optionLabel(row: Record<string, unknown>, keys: string[]) {
  return keys
    .map((key) => row[key])
    .filter((value) => value !== null && value !== undefined && value !== '')
    .join(' · ');
}

async function loadOptions() {
  const [materials] = await Promise.all([
    listResource<Record<string, unknown>>('/materiales', { pageSize: 100, active: true }),
    isEntry.value ? loadEntryOptions() : loadDeliveryOptions(),
  ]);

  materialOptions.value = materials.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['code', 'name', 'unit_abbreviation']) || String(item.id),
  }));
}

async function loadEntryOptions() {
  const [authorities, acquisitions] = await Promise.all([
    listResource<Record<string, unknown>>('/autoridades-distritales', { pageSize: 100, active: true }),
    listResource<Record<string, unknown>>('/procesos-adquisicion', { pageSize: 100 }),
  ]);

  authorityOptions.value = authorities.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['first_names', 'last_names', 'position']) || String(item.id),
  }));

  acquisitionOptions.value = acquisitions.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['process_code', 'supplier_name', 'support_document']) || String(item.id),
  }));
}

async function loadDeliveryOptions() {
  const institutions = await listResource<Record<string, unknown>>('/instituciones', { pageSize: 100, active: true });
  institutionOptions.value = institutions.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['name', 'amie_code']) || String(item.id),
  }));
  await loadLeaders();
}

async function loadLeaders() {
  if (!deliveryForm.institutionId) {
    leaderOptions.value = [];
    return;
  }

  const leaders = await listResource<Record<string, unknown>>('/lideres', {
    pageSize: 100,
    active: true,
    institutionId: deliveryForm.institutionId,
  });

  leaderOptions.value = leaders.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['first_names', 'last_names', 'position']) || String(item.id),
  }));
}

function mapDetail(detail: ActDetail) {
  if (detail.status !== 'borrador') {
    loadError.value = 'Solo los borradores pueden editarse.';
    return;
  }

  if (isEntry.value) {
    const entry = detail as EntryActDetail;
    entryForm.acquisitionProcessId = entry.acquisition_process_id ?? '';
    entryForm.authorizedById = entry.authorized_by_id ?? '';
    entryForm.actDate = entry.act_date;
    entryForm.concept = entry.concept ?? '';
    entryForm.notes = entry.notes ?? '';
    entryForm.items = entry.items.map((item) => ({
      localId: newLocalId(),
      materialId: item.material_id,
      quantity: item.quantity,
      unitValue: item.unit_value,
      appliesVat: item.applies_vat,
      vatPercentage: item.vat_percentage,
      notes: item.notes ?? '',
    }));
  } else {
    const delivery = detail as DeliveryActDetail;
    deliveryForm.institutionId = delivery.institution_id;
    deliveryForm.leaderId = delivery.leader_id;
    deliveryForm.actDate = delivery.act_date;
    deliveryForm.subject = delivery.subject ?? '';
    deliveryForm.notes = delivery.notes ?? '';
    deliveryForm.items = delivery.items.map((item) => ({
      localId: newLocalId(),
      materialId: item.material_id,
      quantity: item.quantity,
      notes: item.notes ?? '',
    }));
  }
}

async function loadDetail() {
  if (!isEditing.value) {
    return;
  }

  hydrating.value = true;

  try {
    const response = await api.get<DataResponse<ActDetail>>(`${config.value.endpoint}/${id.value}`);
    mapDetail(response.data.data);
    if (!isEntry.value) {
      await loadLeaders();
    }
  } finally {
    hydrating.value = false;
  }
}

function syncVat(item: EntryFormItem) {
  if (!item.appliesVat) {
    item.vatPercentage = '0';
  }
}

function entryPreview(item: EntryFormItem) {
  const quantity = Number(item.quantity);
  const unitValue = Number(item.unitValue);
  const vat = item.appliesVat ? Number(item.vatPercentage) : 0;
  if ([quantity, unitValue, vat].some((value) => Number.isNaN(value))) {
    return formatMoney(0);
  }

  return formatMoney(quantity * unitValue * (1 + vat / 100));
}

function duplicatedMaterialMessage(items: Array<EntryFormItem | DeliveryFormItem>) {
  const selected = items.map((item) => item.materialId).filter(Boolean);
  return new Set(selected).size !== selected.length ? 'No puedes repetir materiales dentro del acta.' : '';
}

function buildEntryBody() {
  const duplicateMessage = duplicatedMaterialMessage(entryForm.items);
  if (duplicateMessage) return { error: duplicateMessage };

  return {
    body: {
      acquisitionProcessId: entryForm.acquisitionProcessId || null,
      authorizedById: entryForm.authorizedById || null,
      actDate: entryForm.actDate,
      concept: entryForm.concept || null,
      notes: entryForm.notes || null,
      items: entryForm.items.map((item) => ({
        materialId: item.materialId,
        quantity: Number(item.quantity),
        unitValue: Number(item.unitValue),
        appliesVat: item.appliesVat,
        vatPercentage: item.appliesVat ? Number(item.vatPercentage) : 0,
        notes: item.notes || null,
      })),
    },
  };
}

function buildDeliveryBody() {
  const duplicateMessage = duplicatedMaterialMessage(deliveryForm.items);
  if (duplicateMessage) return { error: duplicateMessage };

  return {
    body: {
      institutionId: deliveryForm.institutionId,
      leaderId: deliveryForm.leaderId,
      actDate: deliveryForm.actDate,
      subject: deliveryForm.subject || null,
      notes: deliveryForm.notes || null,
      items: deliveryForm.items.map((item) => ({
        materialId: item.materialId,
        quantity: Number(item.quantity),
        notes: item.notes || null,
      })),
    },
  };
}

async function submit() {
  const result = isEntry.value ? buildEntryBody() : buildDeliveryBody();

  if ('error' in result) {
    formError.value = result.error ?? '';
    return;
  }

  saving.value = true;
  formError.value = '';

  try {
    const response = isEditing.value
      ? await api.put<DataResponse<ActDetail>>(`${config.value.endpoint}/${id.value}`, result.body)
      : await api.post<DataResponse<ActDetail>>(config.value.endpoint, result.body);

    toast.success('Borrador guardado');
    await router.replace(`${config.value.basePath}/${response.data.data.id}`);
  } catch (submitError) {
    formError.value = extractErrorMessage(submitError);
  } finally {
    saving.value = false;
  }
}

watch(
  () => deliveryForm.institutionId,
  async () => {
    if (!isEntry.value && !hydrating.value) {
      deliveryForm.leaderId = '';
      await loadLeaders();
    }
  },
);

onMounted(async () => {
  loading.value = true;
  loadError.value = '';

  try {
    if (entryForm.items.length === 0) entryForm.items.push(makeEntryItem());
    if (deliveryForm.items.length === 0) deliveryForm.items.push(makeDeliveryItem());
    await loadOptions();
    await loadDetail();
  } catch (error) {
    loadError.value = extractErrorMessage(error);
  } finally {
    loading.value = false;
  }
});
</script>
