import { api } from '@/api/http';
import type { DataResponse, PaginatedResponse } from '@/types/contracts';

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean | '';
  [key: string]: string | number | boolean | undefined | '';
}

export async function listResource<T>(endpoint: string, params: ListParams, signal?: AbortSignal) {
  const response = await api.get<PaginatedResponse<T>>(endpoint, { params, signal });
  return response.data;
}

export async function getResource<T>(endpoint: string, id: string) {
  const response = await api.get<DataResponse<T>>(`${endpoint}/${id}`);
  return response.data.data;
}

export async function createResource<T>(endpoint: string, body: Record<string, unknown>) {
  const response = await api.post<DataResponse<T>>(endpoint, body);
  return response.data.data;
}

export async function updateResource<T>(endpoint: string, id: string, body: Record<string, unknown>) {
  const response = await api.patch<DataResponse<T>>(`${endpoint}/${id}`, body);
  return response.data.data;
}
