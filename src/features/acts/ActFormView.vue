<template>
  <section>
    <div class="page-header">
      <div>
        <h1>{{ isEditing ? `Editar ${config.singular}` : `Nueva ${config.singular}` }}</h1>
        <p v-if="isEntry">Registra los materiales nuevos directamente en el acta de ingreso.</p>
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
            <p v-if="isEntry">Cada fila crea la ficha del material y luego lo agrega al acta.</p>
          </div>
          <AppButton type="button" variant="secondary" @click="addItem">
            <template #icon><Plus aria-hidden="true" /></template>
            Agregar
          </AppButton>
        </div>

        <div class="items-editor">
          <div v-for="(item, index) in currentItems" :key="item.localId" class="items-editor__row" :class="itemRowClass">
            <template v-if="isEntry && isEntryItem(item)">
              <div class="item-card__header">
                <div>
                  <strong>Material {{ index + 1 }}</strong>
                  <p>{{ item.materialId ? 'Material ya creado para esta acta.' : 'Ingresa los datos del nuevo material.' }}</p>
                </div>
                <AppButton type="button" variant="ghost" icon-only aria-label="Quitar material" :disabled="currentItems.length === 1" @click="removeItem(index)">
                  <template #icon><Trash2 aria-hidden="true" /></template>
                </AppButton>
              </div>

              <div v-if="item.materialId" class="detail-grid">
                <div class="detail-item">
                  <span>Material</span>
                  <strong>{{ item.materialName }}</strong>
                </div>
                <div class="detail-item">
                  <span>Código</span>
                  <strong>{{ item.materialCode || 'Sin código' }}</strong>
                </div>
              </div>

              <div v-else class="field-grid">
                <label class="form-field">
                  <span>Código</span>
                  <input v-model.trim="item.materialCode" maxlength="50" />
                </label>
                <label class="form-field">
                  <span>Nombre del material</span>
                  <input v-model.trim="item.materialName" maxlength="200" required />
                </label>
                <label class="form-field">
                  <span>Categoría</span>
                  <select v-model="item.categoryId" required>
                    <option value="">Selecciona</option>
                    <option v-for="option in categoryOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                  </select>
                </label>
                <label class="form-field">
                  <span>Unidad de medida</span>
                  <select v-model="item.measurementUnitId" required>
                    <option value="">Selecciona</option>
                    <option v-for="option in unitOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                  </select>
                </label>
                <label class="form-field">
                  <span>Stock mínimo</span>
                  <input v-model="item.minimumStock" type="number" min="0" step="0.01" />
                </label>
                <label class="form-field field--full">
                  <span>Descripción del material</span>
                  <textarea v-model="item.description" maxlength="2000" rows="2" />
                </label>
              </div>

              <div class="field-grid">
                <label class="form-field">
                  <span>Cantidad</span>
                  <input v-model="item.quantity" type="number" min="0.01" step="0.01" required />
                </label>
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
                <label class="form-field field--full">
                  <span>Notas</span>
                  <input v-model="item.notes" maxlength="1000" />
                </label>
              </div>
            </template>

            <template v-else>
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

              <label class="form-field">
                <span>Notas</span>
                <input v-model="item.notes" maxlength="1000" />
              </label>

              <AppButton type="button" variant="ghost" icon-only aria-label="Quitar material" :disabled="currentItems.length === 1" @click="removeItem(index)">
                <template #icon><Trash2 aria-hidden="true" /></template>
              </AppButton>
            </template>
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
import { createResource, listResource } from '@/api/resources';
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
  materialCode: string;
  materialName: string;
  categoryId: string;
  measurementUnitId: string;
  minimumStock: string;
  description: string;
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
const itemRowClass = computed(() => (isEntry.value ? 'items-editor__row--entry' : 'items-editor__row--delivery'));
const loading = ref(false);
const saving = ref(false);
const loadError = ref('');
const formError = ref('');
const materialOptions = ref<Option[]>([]);
const categoryOptions = ref<Option[]>([]);
const unitOptions = ref<Option[]>([]);
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
    materialCode: '',
    materialName: '',
    categoryId: '',
    measurementUnitId: '',
    minimumStock: '',
    description: '',
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
  if (isEntry.value) {
    await loadEntryOptions();
    return;
  }

  const [materials] = await Promise.all([listResource<Record<string, unknown>>('/materiales', { pageSize: 100, active: true }), loadDeliveryOptions()]);

  materialOptions.value = materials.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['code', 'name', 'unit_abbreviation']) || String(item.id),
  }));
}

async function loadEntryOptions() {
  const [authorities, acquisitions, categories, units] = await Promise.all([
    listResource<Record<string, unknown>>('/autoridades-distritales', { pageSize: 100, active: true }),
    listResource<Record<string, unknown>>('/procesos-adquisicion', { pageSize: 100 }),
    listResource<Record<string, unknown>>('/categorias', { pageSize: 100, active: true }),
    listResource<Record<string, unknown>>('/unidades-medida', { pageSize: 100 }),
  ]);

  authorityOptions.value = authorities.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['first_names', 'last_names', 'position']) || String(item.id),
  }));

  acquisitionOptions.value = acquisitions.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['process_code', 'supplier_name', 'support_document']) || String(item.id),
  }));

  categoryOptions.value = categories.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['name']) || String(item.id),
  }));

  unitOptions.value = units.data.map((item) => ({
    value: String(item.id),
    label: optionLabel(item, ['name', 'abbreviation']) || String(item.id),
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
      materialCode: item.material_code ?? '',
      materialName: item.material_name,
      categoryId: '',
      measurementUnitId: '',
      minimumStock: '',
      description: '',
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

function validateEntryItems() {
  if (entryForm.items.length === 0) {
    return 'Agrega al menos un material.';
  }

  const newCodes = new Set<string>();
  const newNames = new Set<string>();

  for (const [index, item] of entryForm.items.entries()) {
    const row = `Material ${index + 1}`;
    const quantity = Number(item.quantity);
    const unitValue = Number(item.unitValue);
    const vat = item.appliesVat ? Number(item.vatPercentage) : 0;

    if (!quantity || quantity <= 0 || Number.isNaN(quantity)) {
      return `${row}: la cantidad debe ser mayor a 0.`;
    }

    if (unitValue < 0 || Number.isNaN(unitValue)) {
      return `${row}: el valor unitario no puede ser negativo.`;
    }

    if (item.appliesVat && (vat < 0 || vat > 100 || Number.isNaN(vat))) {
      return `${row}: el IVA debe estar entre 0 y 100.`;
    }

    if (!item.materialId) {
      if (!item.materialName || !item.categoryId || !item.measurementUnitId) {
        return `${row}: completa nombre, categoría y unidad de medida del material nuevo.`;
      }

      const normalizedName = item.materialName.trim().toLowerCase();
      if (newNames.has(normalizedName)) {
        return `${row}: no repitas el nombre del material en la misma acta.`;
      }
      newNames.add(normalizedName);

      const normalizedCode = item.materialCode.trim().toLowerCase();
      if (normalizedCode) {
        if (newCodes.has(normalizedCode)) {
          return `${row}: no repitas el código del material en la misma acta.`;
        }
        newCodes.add(normalizedCode);
      }
    }
  }

  return '';
}

async function ensureEntryMaterialsCreated() {
  for (const item of entryForm.items) {
    if (item.materialId) {
      continue;
    }

    const created = await createResource<{ id: string }>('/materiales', {
      categoryId: item.categoryId,
      measurementUnitId: item.measurementUnitId,
      code: item.materialCode || null,
      name: item.materialName,
      minimumStock: item.minimumStock === '' ? null : Number(item.minimumStock),
      description: item.description || null,
      active: true,
    });

    item.materialId = String(created.id);
  }
}

async function buildEntryBody() {
  const validationMessage = validateEntryItems();
  if (validationMessage) return { error: validationMessage };

  await ensureEntryMaterialsCreated();

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
  formError.value = '';

  if (isEntry.value) {
    const preValidation = validateEntryItems();
    if (preValidation) {
      formError.value = preValidation;
      return;
    }
  }

  saving.value = true;

  try {
    const result = isEntry.value ? await buildEntryBody() : buildDeliveryBody();

    if ('error' in result) {
      formError.value = result.error ?? '';
      return;
    }

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
