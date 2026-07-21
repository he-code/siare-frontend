<template>
  <div class="app-shell" :class="{ 'app-shell--collapsed': sidebarCollapsed }">
    <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen, 'sidebar--collapsed': sidebarCollapsed }">
      <RouterLink class="brand" to="/dashboard">
        <PackageCheck aria-hidden="true" />
        <span>SIARE</span>
      </RouterLink>

      <nav class="main-nav" aria-label="Principal">
        <div v-for="group in visibleMenuGroups" :key="group.label" class="main-nav__group">
          <span class="main-nav__section-title">{{ group.label }}</span>
          <RouterLink v-for="item in group.items" :key="item.to" :to="item.to" class="main-nav__item" @click="sidebarOpen = false">
            <component :is="item.icon" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </div>

      </nav>
    </aside>

    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="sidebarOpen = false" />

    <div class="content-shell">
      <header class="topbar">
        <AppButton variant="ghost" icon-only class="topbar__menu" :aria-label="sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'" @click="toggleSidebar">
          <template #icon><Menu aria-hidden="true" /></template>

        </AppButton>

        <div class="topbar__title">
          <span>{{ currentSection }}</span>
          <small v-if="auth.user">{{ roleLabel(auth.user.role) }}</small>
        </div>

        <div class="topbar__actions">
          <button class="topbar-theme-toggle" @click="theme.toggle" :aria-label="theme.isDark ? 'Modo claro' : 'Modo oscuro'">
            <component :is="theme.isDark ? Sun : Moon" aria-hidden="true" />
          </button>
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
  Building2,
  ClipboardList,
  FileInput,
  FileOutput,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PackageCheck,
  Settings2,
  Sun,
  UserRound,
  UsersRound,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppButton from '@/components/AppButton.vue';
import { useAuthStore } from '@/auth/session';
import { useThemeStore } from '@/stores/theme';
import { can, roleLabel, type Capability } from '@/permissions/capabilities';

interface MenuItem {
  label: string;
  to: string;
  icon: unknown;
  capability: Capability;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Inicio',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, capability: 'inventory.summary' }],
  },
  {
    label: 'Actas',
    items: [
      { label: 'Actas de ingreso', to: '/actas-ingreso', icon: FileInput, capability: 'entryActs.read' },
      { label: 'Actas de entrega', to: '/actas-entrega', icon: FileOutput, capability: 'deliveryActs.read' },
    ],
  },
  {
    label: 'Catálogos',
    items: [
      { label: 'Materiales', to: '/catalogos/materiales', icon: PackageCheck, capability: 'catalogs.read' },
      { label: 'Categorías', to: '/catalogos/categorias', icon: BookOpenCheck, capability: 'catalogs.read' },
      { label: 'Unidades de medida', to: '/catalogos/unidades-medida', icon: Boxes, capability: 'catalogs.read' },
      { label: 'Instituciones y líderes', to: '/catalogos/instituciones', icon: Building2, capability: 'catalogs.read' },
    ],
  },
  {
    label: 'Procesos',
    items: [
      {
        label: 'Autoridades distritales',
        to: '/catalogos/autoridades-distritales',
        icon: UserRound,
        capability: 'authorities.manage',
      },
      {
        label: 'Procesos de adquisición',
        to: '/catalogos/procesos-adquisicion',
        icon: Settings2,
        capability: 'acquisitions.manage',
      },
    ],
  },
  {
    label: 'Inventario',
    items: [
      { label: 'Existencias', to: '/inventario/existencias', icon: Boxes, capability: 'inventory.summary' },
      { label: 'Movimientos', to: '/inventario/movimientos', icon: ClipboardList, capability: 'inventory.movements' },
    ],
  },
  {
    label: 'Administración',
    items: [{ label: 'Usuarios', to: '/usuarios', icon: UsersRound, capability: 'users.manage' }],
  },
];

const auth = useAuthStore();
const theme = useThemeStore();
const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);
const loggingOut = ref(false);

function toggleSidebar(){
  if (window.matchMedia('(max-width: 900px)').matches){
    sidebarOpen.value = !sidebarOpen.value;
    return;
  }
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

const visibleMenuGroups = computed(() =>
  menuGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => can(auth.user?.role, item.capability)) }))
    .filter((group) => group.items.length > 0),
);

const currentSection = computed(() => String(route.meta.title ?? 'SIARE'));

async function logout() {
  loggingOut.value = true;
  await auth.logout();
  loggingOut.value = false;
  await router.push('/');
}
</script>
