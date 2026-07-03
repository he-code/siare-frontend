import { defineStore } from 'pinia';

import { api, getAccessToken, setAccessToken } from '@/api/http';
import type { CurrentUser, DataResponse, LoginResponse, RefreshResponse } from '@/types/contracts';

interface AuthState {
  user: CurrentUser | null;
  status: 'idle' | 'checking' | 'authenticated' | 'guest';
  initialized: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

const SESSION_STORAGE_KEY = 'siare.session';

interface StoredSession {
  accessToken: string;
  user?: CurrentUser | null;
}

function readStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function persistSession(accessToken: string | null, user: CurrentUser | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!accessToken) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ accessToken, user }));
}

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
      persistSession(response.data.accessToken, this.user);
    },
    async refreshToken() {
      if (!refreshPromise) {
        refreshPromise = api
          .post<RefreshResponse>('/auth/refresh')
          .then((response) => {
            setAccessToken(response.data.accessToken);
            persistSession(response.data.accessToken, this.user);
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
      persistSession(getAccessToken(), this.user);
      return this.user;
    },
    async restore() {
      if (this.initialized || this.status === 'checking') {
        return this.user;
      }

      this.status = 'checking';

      const storedSession = readStoredSession();
      if (storedSession?.accessToken) {
        setAccessToken(storedSession.accessToken);
        this.user = null;

        try {
          await this.syncUser();
          this.initialized = true;
          return this.user;
        } catch {
          this.clearSession();
          this.initialized = true;
          return null;
        }
      }

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
      persistSession(null, null);
      this.user = null;
      this.status = 'guest';
    },
  },
});
