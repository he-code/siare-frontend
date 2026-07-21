<p align="center">
  <img src="https://img.shields.io/badge/Vue_3-4FC08D?logo=vue.js&logoColor=white" alt="Vue 3">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Pinia-FFD859?logo=pinia&logoColor=black" alt="Pinia">
  <img src="https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white" alt="Vitest">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/demo-online-success" alt="Demo online">
</p>

<h1 align="center">SIARE Frontend</h1>

<p align="center">
  <strong>Sistema Integral de Administración de Recursos y Existencias</strong><br>
  Aplicación web empresarial para gestión de inventario y actas administrativas.
</p>

---

## Sobre el proyecto

SIARE es una SPA construida con **Vue 3 + TypeScript** que resuelve un problema real de gestión institucional: trazabilidad completa de inventario mediante actas documentadas (ingreso y entrega-recepción), catálogos configurables, control de acceso por roles y dashboard de métricas.

El frontend se conecta a un [backend Fastify/Laravel](https://github.com/he-code/siare-backend) y está desplegado en Vercel.

---

## Lo que demuestra este proyecto

### Arquitectura y patrones

| Decisión técnica | Implementación |
|---|---|
| **Refresh token con coalescencia** | Interceptor de Axios que ante un 401 renueva el token. Si múltiples peticiones fallan simultáneamente, solo una llama al refresh; las demás esperan la misma promesa. |
| **RBAC en dos capas** | Route guard global verifica capabilities antes de renderizar; los menús se filtran por rol. 3 roles, 12 capabilities declarativas. |
| **CRUD config-driven** | Un solo `ResourceListView.vue` renderiza 8 catálogos distintos basado en configuraciones declarativas (`resourceConfigs.ts`): columnas, tipos de campo, validaciones, filtros y permisos. |
| **Query-synced filters** | Filtros y paginación sincronizados con query params de la URL. Búsqueda con debounce de 350ms. |
| **Request deduplication** | `AbortController` + contador `requestId` para cancelar peticiones obsoletas al cambiar filtros. |
| **Feature-based structure** | Organización por dominio (`features/acts/`, `features/inventory/`) en lugar de por tipo técnico. |
| **Snapshots en actas** | Los datos de autoridades, instituciones y líderes se capturan al crear el acta, garantizando integridad histórica aunque esos registros cambien después. |

### Componentes y UX

- **Sin librería UI externa** — Todos los componentes (modal, paginación, skeleton loader, toast, badges, botones) están construidos a mano con CSS custom properties y más de 40 variables de tema.
- **Modo oscuro** — Toggle persistido en `localStorage`, implementado con atributo `data-theme` en `<html>` y variables CSS.
- **Focus trap** — El modal `ModalSheet.vue` atrapa el foco y cierra con Escape, implementado manualmente.
- **Page transitions** — Transiciones `out-in` entre rutas con `<Transition>` de Vue.
- **v-scroll-shadow** — Directiva personalizada que añade sombra al hacer scroll horizontal en tablas.
- **Skeleton loaders** — Tres variantes (table, card, metric) para estados de carga.
- **Confirmación en acciones destructivas** — Diálogo de confirmación con campo de motivo obligatorio para acciones como cancelar actas.

### Estado y datos

- **Pinia** — 3 stores modulares (auth, theme, toast) con APIs options y composition según el caso.
- **Token en memoria + localStorage** — Access token en variable JS (seguro contra XSS) con respaldo en `localStorage` para restaurar sesión al recargar.
- **HTTP layer tipado** — Generic helpers `listResource<T>()`, `getResource<T>()`, `createResource<T>()`, `updateResource<T>()` con tipos genéricos `PaginatedResponse<T>` y `DataResponse<T>`.
- **Manejo de errores** — `extractErrorMessage()` parsea errores de Axios en mensajes amigables en español, incluyendo requestId para depuración.

### Tipado

- `strict: true` en tsconfig
- Interfaces explícitas para cada respuesta API, metadatos de ruta y modelos de dominio (~30 tipos)
- RouteMeta extendido con `title`, `public`, `capability`, `resourceKey`, `actKind`
- Enums como union types (`Role`, `ActStatus`, `MovementType`, `LeaderPosition`)

### Testing

- Vitest + Vue Test Utils + jsdom
- Pruebas de la función `can()` del RBAC para los 3 roles
- Pruebas de formato (fechas, decimales, etiquetas de estado)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Lenguaje | TypeScript (strict mode) |
| Build | Vite |
| Router | Vue Router 4 (lazy loading, guards, route meta) |
| Estado | Pinia |
| HTTP | Axios (interceptors, refresh token, retry) |
| Iconos | Lucide Vue (tree-shaking) |
| Estilos | CSS personalizado con variables + modo oscuro |
| Pruebas | Vitest + Vue Test Utils + jsdom |
| Validación | vue-tsc |

---

## Demo

| Recurso | URL |
|---|---|
| Aplicación | https://siare-frontend.vercel.app/ |
| API | https://siare-backend-production.up.railway.app |
| Documentación API | https://siare-backend-production.up.railway.app/docs |
| Backend | https://github.com/he-code/siare-backend |

**Acceso demo:**

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin@example.com` | `password1234` | Administrador |

---

## Instalación

```bash
git clone https://github.com/he-code/siare-frontend.git
cd siare-frontend
npm install
cp .env.example .env
```

Configurar `VITE_API_URL` en `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm run preview` | Vista previa del build |
| `npm run typecheck` | Validación de tipos TypeScript |
| `npm run test` | Pruebas unitarias |

---

## Estructura

```
src/
├── api/            # Cliente HTTP, interceptores, CRUD genérico
├── auth/           # Sesión y autenticación (Pinia store)
├── components/     # Componentes reutilizables (sin librería externa)
├── features/       # Módulos funcionales por dominio
│   ├── acts/       # Actas de ingreso y entrega-recepción
│   ├── catalogs/   # Catálogos (CRUD config-driven)
│   ├── dashboard/  # Dashboard con métricas y alertas
│   ├── inventory/  # Existencias, movimientos, ajustes
│   └── profile/    # Perfil de usuario
├── permissions/    # Matriz de capacidades por rol (RBAC)
├── routes/         # Rutas y guards de navegación
├── stores/         # Estado global (toast, tema)
├── types/          # Interfaces TypeScript
├── utils/          # Composables y helpers
└── views/          # Vistas públicas (welcome, login, 403, 404)
```

---

## Roles

| Rol | Acceso |
|---|---|
| `administrador` | Completo |
| `asistente_actas` | Gestión de actas e inventario |
| `consulta` | Solo lectura |

---

## Despliegue

| Componente | Plataforma |
|---|---|
| Frontend | Vercel |
| Backend | Railway |

---

## Licencia

MIT. Proyecto de portafolio por [he-code](https://github.com/he-code).
