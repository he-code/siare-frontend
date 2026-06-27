import { describe, expect, it } from 'vitest';

import { formatDate, formatDecimal, movementLabel, statusLabel } from '@/utils/format';

describe('format utilities', () => {
  it('formats date-only values without timezone conversion', () => {
    expect(formatDate('2026-06-21')).toBe('21/06/2026');
  });

  it('keeps decimal strings presentable', () => {
    expect(formatDecimal('12.50')).toContain('12');
    expect(formatDecimal('12.50')).toContain('50');
  });

  it('labels act statuses and inventory movements', () => {
    expect(statusLabel('borrador')).toBe('Borrador');
    expect(statusLabel('emitida')).toBe('Emitida');
    expect(movementLabel('anulacion')).toBe('Anulación');
  });
});
