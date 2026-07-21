# SIARE Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Vue_3-4FC08D?logo=vue.js&logoColor=white" alt="Vue 3">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Pinia-FFD859?logo=pinia&logoColor=black" alt="Pinia">
  <img src="https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white" alt="Vitest">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
</p>

**SIARE** (Sistema Integral de Administración de Recursos y Existencias) es una aplicación web para la gestión de inventario institucional mediante documentos formales. Permite registrar actas de ingreso y entrega-recepción, consultar existencias, rastrear movimientos y administrar catálogos institucionales — todo con trazabilidad completa y sin modificaciones directas del stock.

> Este repositorio contiene el **frontend** construido con Vue 3, TypeScript y Vite. El backend (Fastify/Node.js) está en un repositorio separado.

---

## 🔍 Vista rápida

| Ruta | Descripción |
|---|---|
| `/` | Página pública con información del sistema |
| `/login` | Inicio de sesión |
| `/dashboard` | Resumen general con métricas y alertas |
| `/actas-ingreso` | Gestión de actas de ingreso |
| `/actas-entrega` | Gestión de actas de entrega-recepción |
| `/inventario/existencias` | Consulta de stock actual |
| `/inventario/movimientos` | Historial de movimientos |
| `/catalogos/*` | Administración de catálogos |
| `/usuarios` | Gestión de usuarios |

---

## ✨ Características

- **Página pública** informativa antes del inicio de sesión
- **Autenticación** con token de acceso y renovación automática
- **Control de acceso** por roles con protección visual de rutas
- **Dashboard** con métricas clave, alertas de bajo stock y movimientos recientes
- **Actas de ingreso** — registro de entrada de materiales al inventario
- **Actas de entrega-recepción** — registro de salidas con descuento de existencias
- **Existencias** — consulta del stock actual de materiales
- **Movimientos** — historial completo con trazabilidad
- **Catálogos** — gestión de materiales, categorías, unidades, instituciones, autoridades y procesos
- **Usuarios** — administración de cuentas del sistema
- **Diseño responsive** — adaptable a escritorio, tablet y móvil
- **Modo oscuro** — toggle para alternar entre tema claro y oscuro
- **Pruebas unitarias** con Vitest

---

## 🏗️ Flujo de inventario

El sistema garantiza la trazabilidad del inventario mediante documentos formales:

```
Acta de ingreso
       ↓
Aumenta existencias

Acta de entrega-recepción
       ↓
Descuenta existencias

Existencias
       ↓
Consulta del stock actual

Movimientos
       ↓
Historial de entradas y salidas
```

> El ajuste manual de stock está bloqueado tanto en frontend como en backend. Las existencias solo se modifican mediante actas documentadas.

---

## 👥 Roles del sistema

| Rol | Descripción |
|---|---|
| `administrador` | Acceso completo a todos los módulos |
| `asistente_actas` | Gestión de actas y consulta de inventario |
| `consulta` | Acceso de solo lectura |

La seguridad real se valida en backend; el frontend adapta la interfaz según el rol.

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API) |
| Lenguaje | TypeScript |
| Build tool | Vite |
| Router | Vue Router 4 |
| Estado | Pinia |
| HTTP | Axios |
| Iconos | Lucide Vue |
| Estilos | CSS personalizado con variables |
| Pruebas | Vitest + jsdom |

---

## 📦 Requisitos

- Node.js 20+
- npm
- Backend de SIARE en ejecución

---

## 🚀 Instalación y ejecución

```bash
# Clonar
git clone https://github.com/he-code/siare-frontend.git

# Entrar al proyecto
cd siare-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear .env en la raíz con:
# VITE_API_URL=http://localhost:3000/api/v1

# Iniciar en desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

---

## 🔧 Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm run preview` | Vista previa del build |
| `npm run typecheck` | Validación de tipos TypeScript |
| `npm run test` | Ejecutar pruebas unitarias |

### Validación pre-commit

```bash
npm run typecheck && npm run test && npm run build
```

---

## 📁 Estructura del proyecto

```
src/
├── api/            # Cliente HTTP e interceptores
├── auth/           # Sesión y autenticación
├── components/     # Componentes reutilizables (layout, botones, modales, etc.)
├── features/       # Módulos funcionales
│   ├── acts/       # Actas de ingreso y entrega
│   ├── catalogs/   # Catálogos administrativos
│   ├── dashboard/  # Dashboard principal
│   ├── inventory/  # Existencias y movimientos
│   ├── profile/    # Perfil de usuario
│   └── users/      # Gestión de usuarios
├── permissions/    # Matriz de capacidades por rol
├── routes/         # Configuración de rutas y guards
├── stores/         # Estados globales (toast, etc.)
├── types/          # Interfaces TypeScript
├── utils/          # Funciones auxiliares
└── views/          # Vistas públicas
```

---

## 🔌 Integración con backend

Este frontend consume una API REST. Endpoints principales:

```
Autenticación
  POST /auth/login
  GET  /auth/me
  POST /auth/logout

Inventario
  GET  /inventario/resumen
  GET  /inventario/existencias
  GET  /inventario/alertas-bajo-stock
  GET  /inventario/movimientos

Catálogos y usuarios
  GET  /materiales
  GET  /categorias
  GET  /unidades-medida
  GET  /instituciones
  GET  /autoridades-distritales
  GET  /procesos-adquisicion
  GET  /users
```

---

## 🌐 Despliegue

Configurar variable de entorno en producción:

```env
VITE_API_URL=https://tu-backend.onrender.com/api/v1
```

Luego generar el build:

```bash
npm run build    # genera en dist/
```

Recomendación para portafolio gratuito:

```
Frontend → Vercel o Netlify
Backend  → Render
BD       → Neon PostgreSQL
```

---

## 📄 Licencia

MIT

---

## 👤 Autor

Desarrollado por [he-code](https://github.com/he-code) como proyecto de portafolio.
