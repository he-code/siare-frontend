# SIARE Frontend

Aplicación web desarrollada con **Vue 3** y **TypeScript** para la
gestión institucional de inventario mediante actas administrativas.

SIARE (Sistema Institucional de Administración de Recursos Educativos)
permite controlar el ingreso, entrega y seguimiento de materiales,
administrando el inventario mediante procesos documentados y manteniendo
trazabilidad completa de cada movimiento.

La aplicación consume la API REST de **SIARE Backend** y ofrece una
experiencia moderna, segura y responsive para los diferentes perfiles de
usuario.

------------------------------------------------------------------------

# 🚀 Demo

  ------------------------------------------------------------------------------------------
  Recurso                             URL
  ----------------------------------- ------------------------------------------------------
  Aplicación                          https://siare-frontend.vercel.app/

  API                                 https://siare-backend-production.up.railway.app

  Documentación API                   https://siare-backend-production.up.railway.app/docs

  Repositorio Frontend                https://github.com/he-code/siare-frontend

  Repositorio Backend                 https://github.com/he-code/siare-backend
  ------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 🔑 Acceso de demostración

  Usuario               Contraseña
  --------------------- ----------------
  `admin@example.com`   `password1234`

> Estas credenciales están destinadas exclusivamente para la
> demostración del sistema.

------------------------------------------------------------------------

# 🎯 Objetivo del proyecto

Este proyecto fue desarrollado para digitalizar los procesos
administrativos relacionados con el control de inventario institucional,
reemplazando registros manuales por una aplicación web moderna basada en
una arquitectura desacoplada frontend/backend.

El sistema demuestra el desarrollo de aplicaciones empresariales
utilizando tecnologías modernas, autenticación segura, control de acceso
por roles e integración con una API REST.

------------------------------------------------------------------------

# ✨ Características

-   Dashboard con indicadores de inventario.
-   Gestión de actas de ingreso.
-   Gestión de actas de entrega-recepción.
-   Consulta de existencias.
-   Historial de movimientos.
-   Administración de materiales.
-   Gestión de instituciones.
-   Gestión de autoridades distritales.
-   Gestión de usuarios.
-   Control de acceso basado en roles.
-   Integración con API REST.
-   Persistencia de sesión mediante Access Token y Refresh Token.

------------------------------------------------------------------------

# 🏗 Arquitectura

El frontend está desarrollado como una SPA (Single Page Application)
independiente que consume la API REST de SIARE Backend.

``` text
Usuario
   │
   ▼
Vue 3 + TypeScript
   │
Axios
   │
API REST (Fastify)
   │
PostgreSQL
```

------------------------------------------------------------------------

# 🛠 Tecnologías utilizadas

## Frontend

-   Vue 3
-   TypeScript
-   Vite

## Estado y navegación

-   Pinia
-   Vue Router

## Comunicación

-   Axios

## Interfaz

-   Lucide Vue
-   CSS personalizado

## Calidad

-   Vitest

------------------------------------------------------------------------

# 📦 Instalación

## Requisitos

-   Node.js 20 o superior
-   npm
-   Backend SIARE disponible

``` bash
git clone https://github.com/he-code/siare-frontend.git
cd siare-frontend
npm install
cp .env.example .env
```

------------------------------------------------------------------------

# ⚙️ Configuración

Desarrollo local:

``` env
VITE_API_URL=http://localhost:3000/api/v1
```

Producción:

``` env
VITE_API_URL=https://siare-backend-production.up.railway.app/api/v1
```

> El backend debe incluir `https://siare-frontend.vercel.app` en
> `CORS_ORIGINS`.

------------------------------------------------------------------------

# ▶️ Ejecución

``` bash
npm run dev
```

Servidor local:

``` text
http://localhost:5173
```

## Scripts

  Comando               Descripción
  --------------------- -----------------------
  `npm run dev`         Desarrollo
  `npm run typecheck`   Validación TypeScript
  `npm run test`        Pruebas
  `npm run build`       Compilación
  `npm run preview`     Vista previa

------------------------------------------------------------------------

# 📂 Estructura del proyecto

``` text
src/
├── api/
├── auth/
├── components/
├── features/
│   ├── acts/
│   ├── catalogs/
│   ├── dashboard/
│   ├── inventory/
│   ├── profile/
│   └── users/
├── permissions/
├── routes/
├── stores/
├── types/
└── views/
```

------------------------------------------------------------------------

# 🔌 Integración con la API

El cliente HTTP utiliza `VITE_API_URL` como URL base y consume módulos
como:

-   Autenticación
-   Dashboard
-   Inventario
-   Actas
-   Materiales
-   Instituciones
-   Usuarios

La documentación de la API está disponible en:

https://siare-backend-production.up.railway.app/docs

------------------------------------------------------------------------

# 🔐 Roles

  Rol                 Acceso
  ------------------- -------------------------
  `admin`             Administración completa
  `asistente_actas`   Gestión operativa
  `consulta`          Solo lectura

> La autorización se valida en el backend. El frontend adapta la
> interfaz según el rol autenticado.

------------------------------------------------------------------------

# 🧪 Pruebas

Antes de publicar cambios:

``` bash
npm run typecheck
npm run test
npm run build
```

------------------------------------------------------------------------

# 🚀 Despliegue

Frontend desplegado en **Vercel**.

Backend desplegado en **Railway**.

------------------------------------------------------------------------

# 🗺 Hoja de ruta

-   Mayor cobertura de pruebas.
-   Mejoras de accesibilidad.
-   Optimización de rendimiento.
-   Nuevos módulos administrativos.

------------------------------------------------------------------------

# 👨‍💻 Autor

**Cherno Alpha**

Ingeniero en Sistemas · Full Stack Developer Junior

-   GitHub: https://github.com/he-code
