# SIARE Frontend

Frontend web de **SIARE - Sistema de Inventario y Actas de Recepción y Entrega**.

Aplicación desarrollada con Vue 3 para consumir el backend de SIARE y permitir la gestión de inventario, catálogos, actas de ingreso, actas de entrega-recepción, movimientos de inventario y descarga de documentos PDF.

## Tecnologías

- Vue 3
- Vite
- TypeScript
- Pinia
- Vue Router
- Axios
- Vitest

## Requisitos

- Node.js 20 o superior
- npm
- Backend de SIARE en ejecución

## Instalación

```bash
npm ci
```

## Configuración

Crear un archivo `.env` tomando como base `.env.example`:

```bash
cp .env.example .env
```

Configurar la URL del backend:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Ejecución en desarrollo

```bash
npm run dev
```

Por defecto, Vite levanta el frontend en:

```txt
http://localhost:5173
```

El backend debe permitir este origen en su configuración CORS.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run typecheck
```

## Módulos principales

- Autenticación y sesión de usuario
- Dashboard
- Usuarios
- Autoridades distritales
- Instituciones educativas
- Líderes institucionales
- Categorías
- Unidades de medida
- Materiales
- Procesos de adquisición
- Actas de ingreso
- Actas de entrega-recepción
- Movimientos de inventario
- Ajustes de stock
- Descarga de PDFs generados por el backend

## Roles contemplados

- `administrador`: acceso completo.
- `asistente_actas`: creación y consulta de actas de entrega.
- `consulta`: solo visualización.

## Flujo general

1. El usuario inicia sesión.
2. El frontend obtiene el token de acceso.
3. Las solicitudes se envían al backend usando `VITE_API_URL`.
4. El backend maneja la cookie segura de refresh token.
5. El frontend descarga los PDFs generados por el backend.

## Archivos que no deben subirse al repositorio

```txt
node_modules/
dist/
.npm-cache/
.git-local/
coverage/
.env
```

El archivo `package-lock.json` sí debe mantenerse versionado.

## Estado del proyecto

Frontend listo para integración con backend.  
Pendiente realizar prueba funcional completa con backend, base de datos y generación real de PDFs.
