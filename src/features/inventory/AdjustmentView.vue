<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Ajuste de stock</h1>
      </div>
    </div>

    <form class="detail-panel section-grid" @submit.prevent="openConfirm">
      <div class="field-grid">
        <label class="form-field">
          <span>Material</span>
          <select v-model="materialId" required>
            <option value="">Selecciona</option>
            <option v-for="option in materialOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </label>
        <label class="form-field">
          <span>Diferencia</span>
          <input v-model="difference" type="number" step="0.01" required />
        </label>
        <label class="form-field field--full">
          <span>Motivo</span>
          <textarea v-model.trim="reason" rows="4" minlength="5" maxlength="2000" required />
        </label>
      </div>

      <div class="detail-grid">
        <div class="detail-item">
          <span>Stock actual</span>
          <strong>{{ formatDecimal(selectedMaterial?.stock ?? '0') }}</strong>
        </div>
        <div class="detail-item">
          <span>Stock resultante</span>
          <strong>{{ formatDecimal(resultingStock) }}</strong>
        </div>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>

      <footer class="modal-actions">
        <AppButton type="submit" variant="primary" :disabled="!canSubmit">
          <template #icon><Save aria-hidden="true" /></template>
          Registrar ajuste
        </AppButton>
      </footer>
    </form>

    <ConfirmDialog
      :open="confirmOpen"
      title="Registrar ajuste"
      message="El ajuste generará un movimiento permanente y auditable."
      :busy="saving"
      @cancel="confirmOpen = false"
      @confirm="submit"
    />
  </section>
</template>

<script setup lang="ts">
import { Save } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';

import { api, extractErrorMessage } from '@/api/http';
import { listResource } from '@/api/resources';
import AppButton from '@/components/AppButton.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useToastStore } from '@/stores/toast';
import { formatDecimal } from '@/utils/format';

interface MaterialOption {
  value: string;
  label: string;
  stock: string;
}

const toast = useToastStore();
const materialOptions = ref<MaterialOption[]>([]);
const materialId = ref('');
const difference = ref('');
const reason = ref('');
const error = ref('');
const saving = ref(false);
const confirmOpen = ref(false);

const selectedMaterial = computed(() => materialOptions.value.find((item) => item.value === materialId.value));
const numericDifference = computed(() => Number(difference.value));
const resultingStock = computed(() => {
  const current = Number(selectedMaterial.value?.stock ?? 0);
  const diff = numericDifference.value;
  return Number.isNaN(diff) ? current : current + diff;
});
const canSubmit = computed(() => Boolean(materialId.value && reason.value.length >= 5 && numericDifference.value !== 0 && resultingStock.value >= 0));

async function loadMaterials() {
  const response = await listResource<Record<string, unknown>>('/materiales', { pageSize: 100, active: true });
  materialOptions.value = response.data.map((item) => ({
    value: String(item.id),
    label: [item.code, item.name].filter(Boolean).join(' · '),
    stock: String(item.current_stock ?? '0'),
  }));
}

function openConfirm() {
  error.value = '';

  if (numericDifference.value === 0 || Number.isNaN(numericDifference.value)) {
    error.value = 'La diferencia no puede ser cero.';
    return;
  }

  if (resultingStock.value < 0) {
    error.value = 'El stock resultante no puede ser negativo.';
    return;
  }

  confirmOpen.value = true;
}

async function submit() {
  saving.value = true;
  error.value = '';

  try {
    await api.post('/inventario/ajustes', {
      materialId: materialId.value,
      difference: numericDifference.value,
      reason: reason.value,
    });
    toast.success('Ajuste registrado');
    confirmOpen.value = false;
    materialId.value = '';
    difference.value = '';
    reason.value = '';
    await loadMaterials();
  } catch (submitError) {
    error.value = extractErrorMessage(submitError);
  } finally {
    saving.value = false;
  }
}

onMounted(loadMaterials);
</script>
