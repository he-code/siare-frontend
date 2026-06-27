import { describe, expect, it } from 'vitest';

import { can, roleLabel } from '@/permissions/capabilities';

describe('role capabilities', () => {
  it('allows administrador to manage protected modules', () => {
    expect(can('administrador', 'users.manage')).toBe(true);
    expect(can('administrador', 'entryActs.manage')).toBe(true);
    expect(can('administrador', 'inventory.adjust')).toBe(true);
  });

  it('allows asistente_actas to manage delivery drafts but not cancellations', () => {
    expect(can('asistente_actas', 'deliveryActs.manage')).toBe(true);
    expect(can('asistente_actas', 'deliveryActs.cancel')).toBe(false);
    expect(can('asistente_actas', 'inventory.movements')).toBe(false);
  });

  it('keeps consulta read-only', () => {
    expect(can('consulta', 'entryActs.read')).toBe(true);
    expect(can('consulta', 'deliveryActs.read')).toBe(true);
    expect(can('consulta', 'entryActs.manage')).toBe(false);
    expect(can('consulta', 'inventory.adjust')).toBe(false);
  });

  it('formats role labels', () => {
    expect(roleLabel('administrador')).toBe('Administrador');
    expect(roleLabel('asistente_actas')).toBe('Asistente de actas');
    expect(roleLabel('consulta')).toBe('Consulta');
  });
});
