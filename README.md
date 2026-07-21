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

<p align="center">
  <a href="https://siare-frontend.vercel.app/" target="_blank">🌐 Demo en vivo</a>
  ·
  <a href="https://github.com/he-code/siare-backend" target="_blank">📦 Backend (Fastify)</a>
  ·
  <a href="https://siare-backend-production.up.railway.app/docs" target="_blank">📖 Documentación API</a>
</p>

---

## 📋 Tabla de contenidos

- [Demo](#demo)
- [Technical Highlights](#technical-highlights)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Stack tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Scripts](#scripts)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Roles](#roles)
- [Despliegue](#despliegue)
- [Licencia](#licencia)

---

## 🚀 Demo

| Recurso               | URL                                                    |
| --------------------- | ------------------------------------------------------ |
| Aplicación            | https://siare-frontend.vercel.app/                     |
| API                   | https://siare-backend-production.up.railway.app        |
| Documentación API     | https://siare-backend-production.up.railway.app/docs   |
| Repositorio Frontend  | https://github.com/he-code/siare-frontend              |
| Repositorio Backend   | https://github.com/he-code/siare-backend               |

**Acceso de demostración:**

| Usuario             | Contraseña    | Rol           |
| ------------------- | ------------- | ------------- |
| `admin@example.com` | `password1234` | Administrador |

---

## 💡 Technical Highlights

| Patrón / Decisión                                          | Implementación                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Refresh token automático**                               | Axios interceptor que renueva el token en 401s con coalescencia de llamadas concurrentes para evitar múltiples refreshes |
| **RBAC en dos capas**                                      | Route guard global + guards en componentes. Mapeo declarativo `role → capabilities` con 3 roles y ~16 permisos |
| **Config-driven CRUD**                                     | Vistas de catálogos genéricas impulsadas por `resourceConfigs.ts`: columnas, filtros, formularios y permisos en un solo archivo |
| **Query-synced filters**                                   | Filtros y paginación sincronizados con query params. Búsqueda con debounce de 350ms |
| **Request deduplication**                                  | AbortController + contador `requestId` para cancelar peticiones obsoletas al filtrar o navegar |
| **Feature-based structure**                                | Organización por dominio (`features/acts/`, `features/inventory/`) en lugar de por tipo técnico |
| **Composition API (`<script setup>`)**                     | Todos los componentes usan la API de composición de Vue 3 con tipado estricto |
| **Session persistence**                                    | Token en memoria (variable JS) + respaldo en `localStorage`. Restauración automática al recargar |
| **Lazy loading**                                           | Todas las rutas usan importaciones dinámicas |
| **Tipado fuerte**                                          | Interfaces explícitas para respuestas API (`PaginatedResponse<T>`, `DataResponse<T>`), metadatos de ruta y modelos de dominio |

---

## ✨ Características

- Autenticación con Access Token + Refresh Token y renovación automática
- Dashboard con métricas clave, alertas de bajo stock y movimientos recientes
- Actas de ingreso con creación de materiales en línea
- Actas de entrega-recepción con descuento automático de existencias
- Consulta de existencias e historial de movimientos
- Catálogos: materiales, categorías, unidades, instituciones, autoridades, procesos
- Gestión de usuarios con 3 roles y permisos granulares
- Sin ajustes manuales de stock — todo se modifica mediante actas documentadas
- Modo oscuro
- Diseño responsive

---

## 🏗️ Arquitectura

```
Browser ──▶ Vue 3 SPA ──▶ Axios (interceptors + refresh token) ──▶ API REST ──▶ PostgreSQL
                                  │
                                  ├─ Request: attach Bearer token
                                  └─ Response 401: auto-refresh + retry
```

---

## 🛠️ Stack tecnológico

| Capa         | Tecnología                                          |
| ------------ | --------------------------------------------------- |
| Framework    | Vue 3 (Composition API, `<script setup>`)           |
| Lenguaje     | TypeScript (strict mode)                            |
| Build tool   | Vite 8                                              |
| Router       | Vue Router 4 (lazy loading, guards, route meta)     |
| Estado       | Pinia (stores modulares)                            |
| HTTP         | Axios (interceptors, refresh token, retry)          |
| Iconos       | Lucide Vue (tree-shaking)                           |
| Estilos      | CSS personalizado con variables + modo oscuro       |
| Pruebas      | Vitest + Vue Test Utils + jsdom                     |
| Validación   | vue-tsc                                             |

---

## 📦 Instalación

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

## 🔧 Scripts

| Comando             | Descripción                     |
| ------------------- | ------------------------------- |
| `npm run dev`       | Servidor de desarrollo          |
| `npm run build`     | Compilar para producción        |
| `npm run preview`   | Vista previa del build          |
| `npm run typecheck` | Validación de tipos TypeScript  |
| `npm run test`      | Pruebas unitarias               |

---

## 📁 Estructura del proyecto

```
src/
├── api/            # Cliente HTTP e interceptores
├── auth/           # Sesión y autenticación
├── components/     # Componentes reutilizables
├── features/       # Módulos funcionales por dominio
│   ├── acts/       # Actas de ingreso y entrega
│   ├── catalogs/   # Catálogos (config-driven CRUD)
│   ├── dashboard/  # Dashboard principal
│   ├── inventory/  # Existencias y movimientos
│   ├── profile/    # Perfil de usuario
│   └── users/      # Gestión de usuarios
├── permissions/    # Matriz de capacidades por rol
├── routes/         # Rutas y guards de navegación
├── stores/         # Estados globales (toast, tema)
├── types/          # Interfaces TypeScript
├── utils/          # Utilidades y helpers
└── views/          # Vistas públicas
```

---

## 👥 Roles

| Rol               | Acceso                      |
| ----------------- | --------------------------- |
| `administrador`   | Acceso completo             |
| `asistente_actas` | Gestión de actas e inventario |
| `consulta`        | Solo lectura                |

La autorización se valida en backend. El frontend adapta la interfaz según el rol autenticado.

---

## 🚀 Despliegue

| Componente | Plataforma     |
| ---------- | -------------- |
| Frontend   | Vercel         |
| Backend    | Railway        |

---

## 📄 Licencia

MIT. Proyecto de portafolio desarrollado por [he-code](https://github.com/he-code).
