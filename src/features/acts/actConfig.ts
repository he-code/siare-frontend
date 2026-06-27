import type { Capability } from '@/permissions/capabilities';

export type ActKind = 'entry' | 'delivery';

export interface ActConfig {
  kind: ActKind;
  title: string;
  singular: string;
  endpoint: string;
  basePath: string;
  readCapability: Capability;
  manageCapability: Capability;
  cancelCapability: Capability;
  stockEffect: string;
}

export const actConfigs: Record<ActKind, ActConfig> = {
  entry: {
    kind: 'entry',
    title: 'Actas de ingreso',
    singular: 'acta de ingreso',
    endpoint: '/actas-ingreso',
    basePath: '/actas-ingreso',
    readCapability: 'entryActs.read',
    manageCapability: 'entryActs.manage',
    cancelCapability: 'entryActs.manage',
    stockEffect: 'aumentará el stock de los materiales incluidos',
  },
  delivery: {
    kind: 'delivery',
    title: 'Actas de entrega',
    singular: 'acta de entrega',
    endpoint: '/actas-entrega',
    basePath: '/actas-entrega',
    readCapability: 'deliveryActs.read',
    manageCapability: 'deliveryActs.manage',
    cancelCapability: 'deliveryActs.cancel',
    stockEffect: 'descontará el stock de los materiales incluidos',
  },
};
