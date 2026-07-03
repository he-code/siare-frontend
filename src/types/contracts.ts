export type Id = string;
export type DecimalString = string;
export type DateOnly = string;
export type IsoDateTime = string;

export type Role = 'administrador' | 'asistente_actas' | 'consulta';
export type ActStatus = 'borrador' | 'emitida' | 'anulada';
export type LeaderPosition = 'rector' | 'director';
export type MovementType = 'entrada' | 'salida' | 'ajuste' | 'anulacion';

export interface ApiErrorResponse {
  error?: {
    code: string;
    message: string;
    details?: unknown;
    requestId: string;
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface DataResponse<T> {
  data: T;
}

export interface CurrentUser {
  id: Id;
  name: string;
  email: string;
  role: Role;
  position: string | null;
  active: boolean;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: Omit<CurrentUser, 'active'>;
}

export interface RefreshResponse {
  accessToken: string;
  tokenType: 'Bearer';
}

export interface InventoryStockItem {
  id: Id;
  code: string | null;
  name: string;
  description: string | null;
  current_stock: DecimalString;
  minimum_stock: DecimalString | null;
  last_unit_value: DecimalString | null;
  active: boolean;
  category_id: Id;
  category_name: string;
  measurement_unit_id: Id;
  unit_name: string;
  unit_abbreviation: string | null;
  low_stock: boolean;
  stock_deficit: DecimalString;
}

export interface InventorySummary {
  active_materials: number;
  low_stock_materials: number;
  total_units: DecimalString;
  lowStockAlerts?: InventoryStockItem[];
  latestMovements: Array<{
    id: Id;
    material_name: string;
    movement_type: MovementType;
    quantity: DecimalString;
    created_at: IsoDateTime;
  }>;
}

export interface InventoryMovement {
  id: Id;
  material_id: Id;
  material_code: string | null;
  material_name: string;
  movement_type: MovementType;
  quantity: DecimalString;
  previous_stock: DecimalString;
  new_stock: DecimalString;
  reference_type: 'acta_ingreso' | 'acta_entrega' | 'ajuste' | 'anulacion';
  reference_id: Id;
  notes: string | null;
  user_id: Id;
  responsible_user: string;
  created_at: IsoDateTime;
}

export interface EntryActItem {
  id: Id;
  material_id: Id;
  material_code: string | null;
  material_name: string;
  unit: string | null;
  quantity: DecimalString;
  unit_value: DecimalString;
  applies_vat: boolean;
  vat_percentage: DecimalString;
  subtotal: DecimalString;
  vat_value: DecimalString;
  total: DecimalString;
  notes: string | null;
}

export interface DeliveryActItem {
  id: Id;
  material_id: Id;
  material_code: string | null;
  material_name: string;
  unit: string | null;
  quantity: DecimalString;
  notes: string | null;
}

export interface EntryActDetail {
  id: Id;
  acquisition_process_id: Id | null;
  authorized_by_id: Id | null;
  user_id: Id;
  registered_by: string;
  period: number | null;
  sequence: number | null;
  act_number: string | null;
  act_date: DateOnly;
  concept: string | null;
  subtotal: DecimalString;
  vat_total: DecimalString;
  total: DecimalString;
  notes: string | null;
  status: ActStatus;
  cancellation_reason: string | null;
  issued_at: IsoDateTime | null;
  cancelled_at: IsoDateTime | null;
  created_at: IsoDateTime;
  items: EntryActItem[];
  authority_snapshot: {
    nationalId: string | null;
    firstNames: string;
    lastNames: string;
    position: string;
  } | null;
  authority_first_names: string | null;
  authority_last_names: string | null;
  authority_position: string | null;
  acquisition_process_type: string | null;
  acquisition_process_code: string | null;
  supplier_name: string | null;
  supplier_tax_id: string | null;
  support_document: string | null;
}

export interface DeliveryActDetail {
  id: Id;
  institution_id: Id;
  institution_name: string;
  leader_id: Id;
  leader_first_names: string;
  leader_last_names: string;
  leader_position: LeaderPosition;
  user_id: Id;
  registered_by: string;
  period: number | null;
  sequence: number | null;
  act_number: string | null;
  act_date: DateOnly;
  subject: string | null;
  notes: string | null;
  status: ActStatus;
  cancellation_reason: string | null;
  issued_at: IsoDateTime | null;
  cancelled_at: IsoDateTime | null;
  created_at: IsoDateTime;
  items: DeliveryActItem[];
  institution_snapshot: {
    amieCode: string | null;
    name: string;
    circuit: string | null;
    canton: string | null;
    parish: string | null;
    address: string | null;
  } | null;
  leader_snapshot: {
    nationalId: string;
    firstNames: string;
    lastNames: string;
    position: LeaderPosition;
  } | null;
}

export type ActDetail = EntryActDetail | DeliveryActDetail;
