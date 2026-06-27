import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import type { ApiErrorResponse } from '@/types/contracts';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

let accessToken: string | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 20_000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function registerAuthHandlers(handlers: {
  refresh: () => Promise<string | null>;
  unauthorized: () => void;
}) {
  refreshHandler = handlers.refresh;
  unauthorizedHandler = handlers.unauthorized;
}

function isAuthRefreshRequest(config?: InternalAxiosRequestConfig) {
  const url = config?.url ?? '';
  return url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout');
}

api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthRefreshRequest(originalRequest)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshHandler) {
      unauthorizedHandler?.();
      return Promise.reject(error);
    }

    const freshToken = await refreshHandler();

    if (!freshToken) {
      unauthorizedHandler?.();
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${freshToken}`;
    return api(originalRequest);
  },
);

export function extractErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const apiError = error.response?.data?.error;
    if (apiError?.message) {
      return apiError.requestId ? `${apiError.message} (${apiError.requestId})` : apiError.message;
    }

    if (error.response?.status === 403) {
      return 'Sin permisos para realizar esta acción.';
    }

    if (error.response?.status === 404) {
      return 'El recurso solicitado no existe.';
    }
  }

  return 'No se pudo completar la operación. Intenta nuevamente.';
}
