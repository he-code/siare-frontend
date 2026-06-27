import type { ActStatus, MovementType } from '@/types/contracts';

export function formatDate(value?: string | null) {
  if (!value) {
    return 'Sin fecha';
  }

  const [date] = value.split('T');
  const [year, month, day] = date.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return 'Sin fecha';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatDecimal(value?: string | number | null, minimumFractionDigits = 2) {
  if (value === null || value === undefined || value === '') {
    return '0,00';
  }

  const numeric = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(numeric)) {
    return String(value);
  }

  return new Intl.NumberFormat('es-EC', {
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function formatMoney(value?: string | number | null) {
  const numeric = typeof value === 'number' ? value : Number(value ?? 0);

  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number.isNaN(numeric) ? 0 : numeric);
}

export function todayDateOnly() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function statusLabel(status: ActStatus) {
  const labels: Record<ActStatus, string> = {
    borrador: 'Borrador',
    emitida: 'Emitida',
    anulada: 'Anulada',
  };

  return labels[status];
}

export function movementLabel(type: MovementType) {
  const labels: Record<MovementType, string> = {
    entrada: 'Entrada',
    salida: 'Salida',
    ajuste: 'Ajuste',
    anulacion: 'Anulación',
  };

  return labels[type];
}

export function toNumber(value: unknown) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
}
