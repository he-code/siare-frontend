<template>
  <section>
    <div class="page-header">
      <div>
        <h1>{{ config.singular }}</h1>
        <p v-if="detail">{{ detail.act_number ?? 'Borrador sin número' }}</p>
      </div>
      <div class="topbar__actions">
        <RouterLink :to="config.basePath" class="button button--secondary">
          <ArrowLeft aria-hidden="true" />
          Volver
        </RouterLink>
        <RouterLink v-if="detail && canManage && detail.status === 'borrador'" :to="`${config.basePath}/${detail.id}/editar`" class="button button--secondary">
          <Pencil aria-hidden="true" />
          Editar
        </RouterLink>
        <AppButton v-if="detail && canManage && detail.status === 'borrador'" variant="primary" @click="confirmEmit = true">
          <template #icon><BadgeCheck aria-hidden="true" /></template>
          Emitir
        </AppButton>
        <AppButton v-if="detail?.status === 'emitida'" variant="secondary" @click="download">
          <template #icon><Download aria-hidden="true" /></template>
          PDF
        </AppButton>
        <AppButton v-if="detail && canCancel && detail.status === 'emitida'" variant="danger" @click="confirmCancel = true">
          <template #icon><Ban aria-hidden="true" /></template>
          Anular
        </AppButton>
      </div>
    </div>

    <LoadingBlock v-if="loading" />
    <EmptyState v-else-if="error" title="No se pudo cargar" :message="error" :icon="CircleAlert" />

    <template v-else-if="detail">
      <section class="detail-panel section-grid">
        <div class="detail-grid">
          <div class="detail-item">
            <span>Estado</span>
            <StatusBadge :value="detail.status" />
          </div>
          <div class="detail-item">
            <span>Fecha</span>
            <strong>{{ formatDate(detail.act_date) }}</strong>
          </div>
          <div class="detail-item">
            <span>Periodo</span>
            <strong>{{ detail.period ?? 'Sin periodo' }}</strong>
          </div>
          <div class="detail-item">
            <span>Registrado por</span>
            <strong>{{ detail.registered_by }}</strong>
          </div>
          <div v-if="isEntry" class="detail-item">
            <span>Total</span>
            <strong>{{ formatMoney((detail as EntryActDetail).total) }}</strong>
          </div>
          <div v-else class="detail-item">
            <span>Institución</span>
            <strong>{{ deliveryInstitution }}</strong>
          </div>
          <div v-if="detail.cancellation_reason" class="detail-item">
            <span>Anulación</span>
            <strong>{{ detail.cancellation_reason }}</strong>
          </div>
        </div>

        <div class="detail-grid">
          <div v-if="isEntry" class="detail-item">
            <span>Autoridad</span>
            <strong>{{ entryAuthority }}</strong>
          </div>
          <div v-if="isEntry" class="detail-item">
            <span>Proceso</span>
            <strong>{{ entryProcess }}</strong>
          </div>
          <div v-if="!isEntry" class="detail-item">
            <span>Líder</span>
            <strong>{{ deliveryLeader }}</strong>
          </div>
          <div class="detail-item">
            <span>Emitida</span>
            <strong>{{ detail.issued_at ? formatDateTime(detail.issued_at) : 'No emitida' }}</strong>
          </div>
          <div class="detail-item">
            <span>Creación</span>
            <strong>{{ formatDateTime(detail.created_at) }}</strong>
          </div>
        </div>
      </section>

      <section v-scroll-shadow class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Código</th>
              <th>Unidad</th>
              <th>Cantidad</th>
              <th v-if="isEntry">Valor unitario</th>
              <th v-if="isEntry">IVA</th>
              <th v-if="isEntry">Total</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in detail.items" :key="item.id">
              <td>{{ item.material_name }}</td>
              <td>{{ item.material_code ?? 'Sin código' }}</td>
              <td>{{ item.unit ?? 'Sin unidad' }}</td>
              <td>{{ formatDecimal(item.quantity) }}</td>
              <td v-if="isEntry">{{ formatMoney((item as EntryActItem).unit_value) }}</td>
              <td v-if="isEntry">{{ formatMoney((item as EntryActItem).vat_value) }}</td>
              <td v-if="isEntry">{{ formatMoney((item as EntryActItem).total) }}</td>
              <td>{{ item.notes ?? 'Sin notas' }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>

    <ConfirmDialog
      :open="confirmEmit"
      title="Emitir acta"
      :message="`La emisión ${config.stockEffect} y el borrador dejará de ser editable.`"
      :busy="mutating"
      @cancel="confirmEmit = false"
      @confirm="emitAct"
    />

    <ConfirmDialog
      :open="confirmCancel"
      title="Anular acta"
      message="La anulación aplicará el efecto inverso en stock y conservará el historial."
      danger
      require-reason
      :busy="mutating"
      @cancel="confirmCancel = false"
      @confirm="cancelAct"
    />
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft, BadgeCheck, Ban, CircleAlert, Download, Pencil } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { api, extractErrorMessage } from '@/api/http';
import { useAuthStore } from '@/auth/session';
import AppButton from '@/components/AppButton.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingBlock from '@/components/LoadingBlock.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { can } from '@/permissions/capabilities';
import { useToastStore } from '@/stores/toast';
import type { ActDetail, DataResponse, DeliveryActDetail, EntryActDetail, EntryActItem } from '@/types/contracts';
import { downloadPdf } from '@/utils/download';
import { formatDate, formatDateTime, formatDecimal, formatMoney } from '@/utils/format';
import { actConfigs, type ActKind } from './actConfig';

const route = useRoute();
const auth = useAuthStore();
const toast = useToastStore();

const config = computed(() => actConfigs[route.meta.actKind as ActKind]);
const isEntry = computed(() => config.value.kind === 'entry');
const canManage = computed(() => can(auth.user?.role, config.value.manageCapability));
const canCancel = computed(() => can(auth.user?.role, config.value.cancelCapability));
const id = computed(() => String(route.params.id));
const detail = ref<ActDetail | null>(null);
const loading = ref(true);
const mutating = ref(false);
const error = ref('');
const confirmEmit = ref(false);
const confirmCancel = ref(false);

const entryAuthority = computed(() => {
  if (!detail.value || !isEntry.value) return 'Sin autoridad';
  const entry = detail.value as EntryActDetail;
  const snapshot = entry.authority_snapshot;
  if (snapshot) return `${snapshot.firstNames} ${snapshot.lastNames} · ${snapshot.position}`;
  if (entry.authority_first_names) return `${entry.authority_first_names} ${entry.authority_last_names ?? ''} · ${entry.authority_position ?? ''}`;
  return 'Sin autoridad';
});

const entryProcess = computed(() => {
  if (!detail.value || !isEntry.value) return 'Sin proceso';
  const entry = detail.value as EntryActDetail;
  return [entry.acquisition_process_code, entry.acquisition_process_type, entry.supplier_name].filter(Boolean).join(' · ') || 'Sin proceso';
});

const deliveryInstitution = computed(() => {
  if (!detail.value || isEntry.value) return 'Sin institución';
  const delivery = detail.value as DeliveryActDetail;
  return delivery.institution_snapshot?.name ?? delivery.institution_name;
});

const deliveryLeader = computed(() => {
  if (!detail.value || isEntry.value) return 'Sin líder';
  const delivery = detail.value as DeliveryActDetail;
  const snapshot = delivery.leader_snapshot;
  if (snapshot) return `${snapshot.firstNames} ${snapshot.lastNames} · ${snapshot.position}`;
  return `${delivery.leader_first_names} ${delivery.leader_last_names} · ${delivery.leader_position}`;
});

async function loadDetail() {
  loading.value = true;
  error.value = '';

  try {
    const response = await api.get<DataResponse<ActDetail>>(`${config.value.endpoint}/${id.value}`);
    detail.value = response.data.data;
  } catch (loadError) {
    error.value = extractErrorMessage(loadError);
  } finally {
    loading.value = false;
  }
}

async function emitAct() {
  mutating.value = true;
  try {
    const response = await api.post<DataResponse<ActDetail>>(`${config.value.endpoint}/${id.value}/emitir`);
    detail.value = response.data.data;
    confirmEmit.value = false;
    toast.success('Acta emitida');
  } catch (emitError) {
    toast.error(extractErrorMessage(emitError));
    await loadDetail();
  } finally {
    mutating.value = false;
  }
}

async function cancelAct(reason: string) {
  mutating.value = true;
  try {
    const response = await api.post<DataResponse<ActDetail>>(`${config.value.endpoint}/${id.value}/anular`, { reason });
    detail.value = response.data.data;
    confirmCancel.value = false;
    toast.success('Acta anulada');
  } catch (cancelError) {
    toast.error(extractErrorMessage(cancelError));
    await loadDetail();
  } finally {
    mutating.value = false;
  }
}

async function download() {
  if (!detail.value) return;
  try {
    await downloadPdf(`${config.value.endpoint}/${detail.value.id}/pdf`, `${detail.value.act_number ?? detail.value.id}.pdf`);
  } catch (downloadError) {
    toast.error(extractErrorMessage(downloadError));
  }
}

onMounted(loadDetail);
</script>
