<template>
  <ModalSheet :open="open" :title="title" @close="$emit('cancel')">
    <div class="confirm-dialog">
      <p>{{ message }}</p>
      <label v-if="requireReason" class="form-field">
        <span>Motivo</span>
        <textarea v-model="reason" rows="4" minlength="5" maxlength="3000" required />
      </label>
      <footer class="modal-actions">
        <AppButton type="button" variant="ghost" @click="$emit('cancel')">Cancelar</AppButton>
        <AppButton type="button" :variant="danger ? 'danger' : 'primary'" :busy="busy" :disabled="requireReason && reason.trim().length < 5" @click="$emit('confirm', reason.trim())">
          Confirmar
        </AppButton>
      </footer>
    </div>
  </ModalSheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import AppButton from '@/components/AppButton.vue';
import ModalSheet from '@/components/ModalSheet.vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    message: string;
    busy?: boolean;
    danger?: boolean;
    requireReason?: boolean;
  }>(),
  {
    busy: false,
    danger: false,
    requireReason: false,
  },
);

defineEmits<{
  cancel: [];
  confirm: [reason: string];
}>();

const reason = ref('');

watch(
  () => props.open,
  (open) => {
    if (!open) {
      reason.value = '';
    }
  },
);
</script>
