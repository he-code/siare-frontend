import { defineStore } from 'pinia';

import { api, setAccessToken } from '@/api/http';
import type { CurrentUser, DataResponse, LoginResponse, RefreshResponse } from '@/types/contracts';

interface AuthState {
  user: CurrentUser | null;
  status: 'idle' | 'checking' | 'authenticated' | 'guest';
  initialized: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

function normalizeLoginUser(user: LoginResponse['user']): CurrentUser {
  return {
    ...user,
    active: true,
  };
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    status: 'idle',
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      setAccessToken(response.data.accessToken);
      this.user = normalizeLoginUser(response.data.user);
      this.status = 'authenticated';
      this.initialized = true;
    },
    async refreshToken() {
      if (!refreshPromise) {
        refreshPromise = api
          .post<RefreshResponse>('/auth/refresh')
          .then((response) => {
            setAccessToken(response.data.accessToken);
            return response.data.accessToken;
          })
          .catch(() => {
            this.clearSession();
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise;
    },
    async syncUser() {
      const response = await api.get<DataResponse<CurrentUser>>('/auth/me');
      this.user = response.data.data;
      this.status = 'authenticated';
      return this.user;
    },
    async restore() {
      if (this.initialized || this.status === 'checking') {
        return this.user;
      }

      this.status = 'checking';
      const token = await this.refreshToken();

      if (!token) {
        this.clearSession();
        this.initialized = true;
        return null;
      }

      try {
        await this.syncUser();
      } catch {
        this.clearSession();
      } finally {
        this.initialized = true;
      }

      return this.user;
    },
    async logout() {
      try {
        await api.post('/auth/logout');
      } finally {
        this.clearSession();
        this.initialized = true;
      }
    },
    clearSession() {
      setAccessToken(null);
      this.user = null;
      this.status = 'guest';
    },
  },
});
