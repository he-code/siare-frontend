<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
      <RouterLink class="brand" to="/">
        <PackageCheck aria-hidden="true" />
        <span>SIARE</span>
      </RouterLink>

      <nav class="main-nav" aria-label="Principal">
        <RouterLink v-for="item in visibleMenu" :key="item.to" :to="item.to" class="main-nav__item" @click="sidebarOpen = false">
          <component :is="item.icon" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="content-shell">
      <header class="topbar">
        <AppButton variant="ghost" icon-only class="topbar__menu" aria-label="Abrir menú" @click="sidebarOpen = !sidebarOpen">
          <template #icon><Menu aria-hidden="true" /></template>
        </AppButton>

        <div class="topbar__title">
          <span>{{ currentSection }}</span>
          <small v-if="auth.user">{{ roleLabel(auth.user.role) }}</small>
        </div>

        <div class="topbar__actions">
          <RouterLink to="/perfil" class="session-pill">
            <UserRound aria-hidden="true" />
            <span>{{ auth.user?.name }}</span>
          </RouterLink>
          <AppButton variant="ghost" icon-only aria-label="Cerrar sesión" :busy="loggingOut" @click="logout">
            <template #icon><LogOut aria-hidden="true" /></template>
          </AppButton>
        </div>
      </header>

      <main class="page-frame">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BookOpenCheck,
  Boxes,
  ClipboardList,
  FileInput,
  FileOutput,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageCheck,
  Settings2,
  UserRound,
  UsersRound,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppButton from '@/components/AppButton.vue';
import { useAuthStore } from '@/auth/session';
import { can, roleLabel, type Capability } from '@/permissions/capabilities';

interface MenuItem {
  label: string;
  to: string;
  icon: unknown;
  capability: Capability;
}

const menu: MenuItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, capability: 'inventory.summary' },
  { label: 'Actas de ingreso', to: '/actas-ingreso', icon: FileInput, capability: 'entryActs.read' },
  { label: 'Actas de entrega', to: '/actas-entrega', icon: FileOutput, capability: 'deliveryActs.read' },
  { label: 'Movimientos', to: '/inventario/movimientos', icon: ClipboardList, capability: 'inventory.movements' },
  { label: 'Ajuste de stock', to: '/inventario/ajustes', icon: Boxes, capability: 'inventory.adjust' },
  { label: 'Usuarios', to: '/usuarios', icon: UsersRound, capability: 'users.manage' },
  { label: 'Catálogos', to: '/catalogos/materiales', icon: BookOpenCheck, capability: 'catalogs.read' },
  { label: 'Procesos', to: '/catalogos/procesos-adquisicion', icon: Settings2, capability: 'acquisitions.manage' },
];

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(false);
const loggingOut = ref(false);

const visibleMenu = computed(() => menu.filter((item) => can(auth.user?.role, item.capability)));

const currentSection = computed(() => String(route.meta.title ?? 'SIARE'));

async function logout() {
  loggingOut.value = true;
  await auth.logout();
  loggingOut.value = false;
  await router.push('/login');
}
</script>
