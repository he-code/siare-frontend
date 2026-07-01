import type { Role } from '@/types/contracts';

export type Capability =
  | 'users.manage'
  | 'catalogs.read'
  | 'catalogs.manage'
  | 'authorities.manage'
  | 'acquisitions.manage'
  | 'entryActs.read'
  | 'entryActs.manage'
  | 'deliveryActs.read'
  | 'deliveryActs.manage'
  | 'deliveryActs.cancel'
  | 'inventory.summary'
  | 'inventory.movements'
  | 'inventory.adjust';

const roleCapabilities: Record<Role, Capability[]> = {
  administrador: [
    'users.manage',
    'catalogs.read',
    'catalogs.manage',
    'authorities.manage',
    'acquisitions.manage',
    'entryActs.read',
    'entryActs.manage',
    'deliveryActs.read',
    'deliveryActs.manage',
    'deliveryActs.cancel',
    'inventory.summary',
    'inventory.movements',
    'inventory.adjust',
  ],
  asistente_actas: [
    'catalogs.read',
    'entryActs.read',
    'entryActs.manage',
    'deliveryActs.read',
    'deliveryActs.manage',
    'inventory.summary',
  ],
  consulta: ['catalogs.read', 'entryActs.read', 'deliveryActs.read', 'inventory.summary', 'inventory.movements'],
};

export function can(role: Role | undefined, capability: Capability) {
  if (!role) {
    return false;
  }

  return roleCapabilities[role].includes(capability);
}

export function roleLabel(role: Role) {
  const labels: Record<Role, string> = {
    administrador: 'Administrador',
    asistente_actas: 'Asistente de actas',
    consulta: 'Consulta',
  };

  return labels[role];
}
