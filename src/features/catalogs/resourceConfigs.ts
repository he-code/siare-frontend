import type { Capability } from '@/permissions/capabilities';
import type { Role } from '@/types/contracts';

export interface SelectOption {
  label: string;
  value: string;
}

export interface RemoteOptions {
  endpoint: string;
  labelKeys: string[];
  params?: Record<string, string | number | boolean>;
}

export interface FieldConfig {
  name: string;
  responseKey?: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'remote-select';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  options?: SelectOption[];
  remote?: RemoteOptions;
  fullSpan?: boolean;
  createOnly?: boolean;
  omitWhenEmpty?: boolean;
}

export interface ColumnConfig {
  key: string;
  label: string;
  kind?: 'text' | 'date' | 'datetime' | 'decimal' | 'money' | 'status' | 'active';
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'remote-select' | 'select';
  options?: SelectOption[];
  remote?: RemoteOptions;
}

export interface ResourceConfig {
  key: string;
  title: string;
  formTitle?: string;
  description?: string;
  createLabel?: string;
  endpoint: string;
  readCapability: Capability;
  manageCapability?: Capability;
  tab?: boolean;
  search?: boolean;
  activeFilter?: boolean;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  filters?: FilterConfig[];
  emptyTitle: string;
  allowedRoles?: Role[];
}

const roleOptions: SelectOption[] = [
  { label: 'Administrador', value: 'administrador' },
  { label: 'Asistente de actas', value: 'asistente_actas' },
  { label: 'Consulta', value: 'consulta' },
];

const leaderPositionOptions: SelectOption[] = [
  { label: 'Rector', value: 'rector' },
  { label: 'Director', value: 'director' },
];

export const resourceConfigs: Record<string, ResourceConfig> = {
  users: {
    key: 'users',
    title: 'Usuarios',
    formTitle: 'usuario',
    description: 'Administra cuentas, roles y estado de acceso al sistema.',
    createLabel: 'Nuevo usuario',
    endpoint: '/users',
    readCapability: 'users.manage',
    manageCapability: 'users.manage',
    search: true,
    activeFilter: true,
    emptyTitle: 'No hay usuarios',
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Rol' },
      { key: 'position', label: 'Cargo' },
      { key: 'active', label: 'Estado', kind: 'active' },
    ],
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true, minLength: 2, maxLength: 150 },
      { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 150 },
      { name: 'password', label: 'Contraseña', type: 'password', required: true, minLength: 12, maxLength: 200, omitWhenEmpty: true },
      { name: 'role', label: 'Rol', type: 'select', required: true, options: roleOptions },
      { name: 'position', label: 'Cargo', type: 'text', maxLength: 150, omitWhenEmpty: true },
      { name: 'active', label: 'Activo', type: 'checkbox' },
    ],
  },
  categorias: {
    key: 'categorias',
    title: 'Categorías',
    formTitle: 'categoría',
    description: 'Clasifica los materiales para búsquedas, reportes y control de inventario.',
    createLabel: 'Nueva categoría',
    endpoint: '/categorias',
    readCapability: 'catalogs.read',
    manageCapability: 'catalogs.manage',
    tab: true,
    search: true,
    activeFilter: true,
    emptyTitle: 'No hay categorías',
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'description', label: 'Descripción' },
      { key: 'active', label: 'Estado', kind: 'active' },
    ],
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true, minLength: 2, maxLength: 100 },
      { name: 'description', label: 'Descripción', type: 'textarea', maxLength: 2000, fullSpan: true, omitWhenEmpty: true },
      { name: 'active', label: 'Activo', type: 'checkbox' },
    ],
  },
  'unidades-medida': {
    key: 'unidades-medida',
    title: 'Unidades de medida',
    formTitle: 'unidad de medida',
    description: 'Define las unidades que se usarán al registrar cantidades en actas e inventario.',
    createLabel: 'Nueva unidad',
    endpoint: '/unidades-medida',
    readCapability: 'catalogs.read',
    manageCapability: 'catalogs.manage',
    tab: true,
    search: true,
    emptyTitle: 'No hay unidades de medida',
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'abbreviation', label: 'Abreviatura' },
    ],
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true, minLength: 1, maxLength: 100 },
      { name: 'abbreviation', label: 'Abreviatura', type: 'text', maxLength: 20, omitWhenEmpty: true },
    ],
  },
  'autoridades-distritales': {
    key: 'autoridades-distritales',
    title: 'Autoridades distritales',
    formTitle: 'autoridad distrital',
    description: 'Registra autoridades que autorizan o respaldan las actas de ingreso.',
    createLabel: 'Nueva autoridad',
    endpoint: '/autoridades-distritales',
    readCapability: 'authorities.manage',
    manageCapability: 'authorities.manage',
    tab: true,
    search: true,
    activeFilter: true,
    emptyTitle: 'No hay autoridades',
    columns: [
      { key: 'national_id', label: 'Identificación' },
      { key: 'first_names', label: 'Nombres' },
      { key: 'last_names', label: 'Apellidos' },
      { key: 'position', label: 'Cargo' },
      { key: 'active', label: 'Estado', kind: 'active' },
    ],
    fields: [
      { name: 'nationalId', responseKey: 'national_id', label: 'Identificación', type: 'text', maxLength: 20, omitWhenEmpty: true },
      { name: 'firstNames', responseKey: 'first_names', label: 'Nombres', type: 'text', required: true, minLength: 2, maxLength: 100 },
      { name: 'lastNames', responseKey: 'last_names', label: 'Apellidos', type: 'text', required: true, minLength: 2, maxLength: 100 },
      { name: 'position', label: 'Cargo', type: 'text', required: true, minLength: 2, maxLength: 150 },
      { name: 'active', label: 'Activo', type: 'checkbox' },
    ],
  },
  instituciones: {
    key: 'instituciones',
    title: 'Instituciones y líderes',
    formTitle: 'institución',
    description: 'Crea la institución y sus líderes en el mismo flujo, como se realiza en el proceso real.',
    createLabel: 'Nueva institución',
    endpoint: '/instituciones',
    readCapability: 'catalogs.read',
    manageCapability: 'catalogs.manage',
    tab: true,
    search: true,
    activeFilter: true,
    emptyTitle: 'No hay instituciones',
    columns: [
      { key: 'amie_code', label: 'AMIE' },
      { key: 'name', label: 'Nombre' },
      { key: 'circuit', label: 'Circuito' },
      { key: 'canton', label: 'Cantón' },
      { key: 'active', label: 'Estado', kind: 'active' },
    ],
    fields: [
      { name: 'amieCode', responseKey: 'amie_code', label: 'Código AMIE', type: 'text', maxLength: 30, omitWhenEmpty: true },
      { name: 'name', label: 'Nombre', type: 'text', required: true, minLength: 2, maxLength: 200 },
      { name: 'circuit', label: 'Circuito', type: 'text', maxLength: 50, omitWhenEmpty: true },
      { name: 'canton', label: 'Cantón', type: 'text', maxLength: 100, omitWhenEmpty: true },
      { name: 'parish', label: 'Parroquia', type: 'text', maxLength: 100, omitWhenEmpty: true },
      { name: 'phone', label: 'Teléfono', type: 'text', maxLength: 30, omitWhenEmpty: true },
      { name: 'address', label: 'Dirección', type: 'textarea', maxLength: 1000, fullSpan: true, omitWhenEmpty: true },
      { name: 'active', label: 'Activo', type: 'checkbox' },
    ],
  },
  lideres: {
    key: 'lideres',
    title: 'Líderes',
    formTitle: 'líder',
    description: 'Mantenimiento directo de líderes. El registro normal se realiza desde Instituciones y líderes.',
    createLabel: 'Nuevo líder',
    endpoint: '/lideres',
    readCapability: 'catalogs.read',
    manageCapability: 'catalogs.manage',
    tab: true,
    activeFilter: true,
    emptyTitle: 'No hay líderes',
    filters: [
      {
        key: 'institutionId',
        label: 'Institución',
        type: 'remote-select',
        remote: { endpoint: '/instituciones', labelKeys: ['name', 'amie_code'], params: { active: true, pageSize: 100 } },
      },
    ],
    columns: [
      { key: 'institution_name', label: 'Institución' },
      { key: 'national_id', label: 'Identificación' },
      { key: 'first_names', label: 'Nombres' },
      { key: 'last_names', label: 'Apellidos' },
      { key: 'position', label: 'Cargo' },
      { key: 'active', label: 'Estado', kind: 'active' },
    ],
    fields: [
      {
        name: 'institutionId',
        responseKey: 'institution_id',
        label: 'Institución',
        type: 'remote-select',
        required: true,
        remote: { endpoint: '/instituciones', labelKeys: ['name', 'amie_code'], params: { active: true, pageSize: 100 } },
      },
      { name: 'nationalId', responseKey: 'national_id', label: 'Identificación', type: 'text', required: true, minLength: 5, maxLength: 20 },
      { name: 'firstNames', responseKey: 'first_names', label: 'Nombres', type: 'text', required: true, minLength: 2, maxLength: 100 },
      { name: 'lastNames', responseKey: 'last_names', label: 'Apellidos', type: 'text', required: true, minLength: 2, maxLength: 100 },
      { name: 'position', label: 'Cargo', type: 'select', required: true, options: leaderPositionOptions },
      { name: 'active', label: 'Activo', type: 'checkbox' },
    ],
  },
  materiales: {
    key: 'materiales',
    title: 'Materiales',
    formTitle: 'material',
    description: 'Consulta y mantiene la ficha de materiales ya registrados en inventario.',
    createLabel: 'Nuevo material',
    endpoint: '/materiales',
    readCapability: 'catalogs.read',
    manageCapability: 'catalogs.manage',
    tab: true,
    search: true,
    activeFilter: true,
    emptyTitle: 'No hay materiales',
    filters: [
      {
        key: 'categoryId',
        label: 'Categoría',
        type: 'remote-select',
        remote: { endpoint: '/categorias', labelKeys: ['name'], params: { active: true, pageSize: 100 } },
      },
    ],
    columns: [
      { key: 'code', label: 'Código' },
      { key: 'name', label: 'Material' },
      { key: 'category_name', label: 'Categoría' },
      { key: 'current_stock', label: 'Stock', kind: 'decimal' },
      { key: 'minimum_stock', label: 'Mínimo', kind: 'decimal' },
      { key: 'last_unit_value', label: 'Último valor', kind: 'money' },
      { key: 'active', label: 'Estado', kind: 'active' },
    ],
    fields: [
      {
        name: 'categoryId',
        responseKey: 'category_id',
        label: 'Categoría',
        type: 'remote-select',
        required: true,
        remote: { endpoint: '/categorias', labelKeys: ['name'], params: { active: true, pageSize: 100 } },
      },
      {
        name: 'measurementUnitId',
        responseKey: 'measurement_unit_id',
        label: 'Unidad de medida',
        type: 'remote-select',
        required: true,
        remote: { endpoint: '/unidades-medida', labelKeys: ['name', 'abbreviation'], params: { pageSize: 100 } },
      },
      { name: 'code', label: 'Código', type: 'text', maxLength: 50, omitWhenEmpty: true },
      { name: 'name', label: 'Nombre', type: 'text', required: true, minLength: 2, maxLength: 200 },
      { name: 'minimumStock', responseKey: 'minimum_stock', label: 'Stock mínimo', type: 'number', omitWhenEmpty: true },
      { name: 'description', label: 'Descripción', type: 'textarea', maxLength: 2000, fullSpan: true, omitWhenEmpty: true },
      { name: 'active', label: 'Activo', type: 'checkbox' },
    ],
  },
  'procesos-adquisicion': {
    key: 'procesos-adquisicion',
    title: 'Procesos de adquisición',
    formTitle: 'proceso de adquisición',
    description: 'Registra el soporte de compra que puede asociarse a un acta de ingreso.',
    createLabel: 'Nuevo proceso',
    endpoint: '/procesos-adquisicion',
    readCapability: 'acquisitions.manage',
    manageCapability: 'acquisitions.manage',
    tab: true,
    search: true,
    emptyTitle: 'No hay procesos',
    columns: [
      { key: 'process_code', label: 'Código' },
      { key: 'process_type', label: 'Tipo' },
      { key: 'supplier_name', label: 'Proveedor' },
      { key: 'award_date', label: 'Adjudicación', kind: 'date' },
      { key: 'support_document', label: 'Soporte' },
    ],
    fields: [
      { name: 'processCode', responseKey: 'process_code', label: 'Código', type: 'text', maxLength: 100, omitWhenEmpty: true },
      { name: 'processType', responseKey: 'process_type', label: 'Tipo', type: 'text', maxLength: 100, omitWhenEmpty: true },
      { name: 'awardDate', responseKey: 'award_date', label: 'Fecha de adjudicación', type: 'date', omitWhenEmpty: true },
      { name: 'supplierName', responseKey: 'supplier_name', label: 'Proveedor', type: 'text', maxLength: 200, omitWhenEmpty: true },
      { name: 'supplierTaxId', responseKey: 'supplier_tax_id', label: 'RUC', type: 'text', maxLength: 20, omitWhenEmpty: true },
      { name: 'supportDocument', responseKey: 'support_document', label: 'Documento soporte', type: 'text', maxLength: 150, omitWhenEmpty: true },
      { name: 'portalUrl', responseKey: 'portal_url', label: 'URL del portal', type: 'text', maxLength: 2000, omitWhenEmpty: true },
      { name: 'purchaseObject', responseKey: 'purchase_object', label: 'Objeto de compra', type: 'textarea', maxLength: 3000, fullSpan: true, omitWhenEmpty: true },
      { name: 'notes', label: 'Notas', type: 'textarea', maxLength: 3000, fullSpan: true, omitWhenEmpty: true },
    ],
  },
};

export const catalogTabs = Object.values(resourceConfigs).filter((config) => config.tab);
