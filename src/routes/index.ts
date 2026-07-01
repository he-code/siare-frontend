import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import { useAuthStore } from '@/auth/session';
import MainLayout from '@/components/MainLayout.vue';
import { can, type Capability } from '@/permissions/capabilities';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    public?: boolean;
    capability?: Capability;
    resourceKey?: string;
    actKind?: 'entry' | 'delivery';
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'welcome',
    component: () => import('@/views/WelcomeView.vue'),
    meta: { public: true, title: 'Inicio' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, title: 'Inicio de sesión' },
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/features/dashboard/DashboardView.vue'),
        meta: { title: 'Dashboard', capability: 'inventory.summary' },
      },
      {
        path: 'perfil',
        name: 'profile',
        component: () => import('@/features/profile/ProfileView.vue'),
        meta: { title: 'Perfil' },
      },
      {
        path: 'usuarios',
        name: 'users',
        component: () => import('@/features/catalogs/ResourceListView.vue'),
        meta: { title: 'Usuarios', capability: 'users.manage', resourceKey: 'users' },
      },
      {
        path: 'catalogos/:resource',
        name: 'catalogs',
        component: () => import('@/features/catalogs/ResourceListView.vue'),
        meta: { title: 'Catálogos', capability: 'catalogs.read' },
      },
      {
        path: 'actas-ingreso',
        name: 'entry-acts',
        component: () => import('@/features/acts/ActListView.vue'),
        meta: { title: 'Actas de ingreso', capability: 'entryActs.read', actKind: 'entry' },
      },
      {
        path: 'actas-ingreso/nueva',
        name: 'entry-act-new',
        component: () => import('@/features/acts/ActFormView.vue'),
        meta: { title: 'Nueva acta de ingreso', capability: 'entryActs.manage', actKind: 'entry' },
      },
      {
        path: 'actas-ingreso/:id/editar',
        name: 'entry-act-edit',
        component: () => import('@/features/acts/ActFormView.vue'),
        meta: { title: 'Editar acta de ingreso', capability: 'entryActs.manage', actKind: 'entry' },
      },
      {
        path: 'actas-ingreso/:id',
        name: 'entry-act-detail',
        component: () => import('@/features/acts/ActDetailView.vue'),
        meta: { title: 'Detalle de ingreso', capability: 'entryActs.read', actKind: 'entry' },
      },
      {
        path: 'actas-entrega',
        name: 'delivery-acts',
        component: () => import('@/features/acts/ActListView.vue'),
        meta: { title: 'Actas de entrega', capability: 'deliveryActs.read', actKind: 'delivery' },
      },
      {
        path: 'actas-entrega/nueva',
        name: 'delivery-act-new',
        component: () => import('@/features/acts/ActFormView.vue'),
        meta: { title: 'Nueva acta de entrega', capability: 'deliveryActs.manage', actKind: 'delivery' },
      },
      {
        path: 'actas-entrega/:id/editar',
        name: 'delivery-act-edit',
        component: () => import('@/features/acts/ActFormView.vue'),
        meta: { title: 'Editar acta de entrega', capability: 'deliveryActs.manage', actKind: 'delivery' },
      },
      {
        path: 'actas-entrega/:id',
        name: 'delivery-act-detail',
        component: () => import('@/features/acts/ActDetailView.vue'),
        meta: { title: 'Detalle de entrega', capability: 'deliveryActs.read', actKind: 'delivery' },
      },
      {
        path: 'inventario/movimientos',
        name: 'inventory-movements',
        component: () => import('@/features/inventory/MovementsView.vue'),
        meta: { title: 'Movimientos', capability: 'inventory.movements' },
      },
      {
        path: 'inventario/ajustes',
        name: 'inventory-adjustments',
        component: () => import('@/features/inventory/AdjustmentView.vue'),
        meta: { title: 'Ajuste de stock', capability: 'inventory.adjust' },
      },
      {
        path: '403',
        name: 'forbidden',
        component: () => import('@/views/ForbiddenView.vue'),
        meta: { title: 'Sin permisos' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true, title: 'Página no encontrada' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (!auth.initialized) {
    await auth.restore();
  }

  if (to.meta.public) {
    if (to.name === 'login' && auth.user) {
      return { name: 'dashboard' };
    }

    return true;
  }

  if (!auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.capability && !can(auth.user.role, to.meta.capability)) {
    return { name: 'forbidden' };
  }

  return true;
});

export default router;
