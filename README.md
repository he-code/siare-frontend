# SIARE Frontend

Frontend web de **SIARE**, un sistema para gestionar inventario institucional mediante actas de ingreso, actas de entrega-recepción, catálogos administrativos, usuarios, existencias y movimientos.

Este repositorio contiene la aplicación Vue que consume la API de [siare-backend](https://github.com/he-code/siare-backend). El proyecto ya está preparado para despliegue y para conectar con el backend publicado en Railway.

## Enlaces

| Recurso | URL |
|---|---|
| Repositorio frontend | https://github.com/he-code/siare-frontend |
| Repositorio backend | https://github.com/he-code/siare-backend |
| API desplegada | https://siare-backend-production.up.railway.app |
| Documentación API | https://siare-backend-production.up.railway.app/docs |
| Frontend desplegado | https://siare-frontend.vercel.app/ |

> El backend debe incluir `https://siare-frontend.vercel.app` en `CORS_ORIGINS` para permitir el consumo desde producción.

## Descripción

SIARE organiza el flujo de inventario con documentos formales. Las existencias no se modifican manualmente: aumentan al emitir actas de ingreso y disminuyen al emitir actas de entrega-recepción. Esto conserva trazabilidad, reduce errores operativos y mantiene un historial consultable de entradas y salidas.

El frontend permite:

- Consultar dashboard, existencias, alertas de bajo stock y movimientos.
- Registrar, revisar, emitir y anular actas de ingreso.
- Registrar, revisar, emitir y anular actas de entrega-recepción.
- Administrar catálogos institucionales.
- Gestionar usuarios y mostrar opciones según rol.
- Mantener sesión con access token y refresh cookie `HttpOnly`.

## Estado del despliegue

La aplicación está lista para ejecutarse en un hosting estático como Vercel, Netlify o Railway Static. La API productiva está desplegada en Railway:

```env
VITE_API_URL=https://siare-backend-production.up.railway.app/api/v1
```

Si el backend recibe la URL sin `/api/v1`, las rutas del frontend fallarán porque los clientes HTTP usan rutas relativas como `/auth/login`, `/inventario/resumen` y `/actas-ingreso`.

## Tecnologías

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Axios
- Vitest
- Lucide Vue
- CSS personalizado

## Requisitos

- Node.js 20 o superior
- npm
- Backend SIARE disponible localmente o desplegado

## Inicio rápido

```bash
git clone https://github.com/he-code/siare-frontend.git
cd siare-frontend
npm install
cp .env.example .env
npm run dev
```

Para desarrollo local, usar:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Para conectar con la API desplegada, usar:

```env
VITE_API_URL=https://siare-backend-production.up.railway.app/api/v1
```

El servidor de desarrollo queda normalmente en:

```txt
http://localhost:5173
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta Vite en modo desarrollo |
| `npm run typecheck` | Valida TypeScript y componentes Vue |
| `npm run test` | Ejecuta pruebas con Vitest |
| `npm run build` | Valida tipos y genera `dist/` |
| `npm run preview` | Sirve el build localmente |

Antes de publicar cambios:

```bash
npm run typecheck
npm run test
npm run build
```

## Flujo de inventario

```txt
Acta de ingreso emitida
  -> aumenta existencias

Acta de entrega-recepción emitida
  -> descuenta existencias

Existencias
  -> muestra stock actual

Movimientos
  -> conserva historial de entradas y salidas
```

El ajuste manual de stock fue retirado del frontend y bloqueado en el backend por seguridad.

## Módulos principales

| Módulo | Ruta |
|---|---|
| Vista pública | `/` |
| Inicio de sesión | `/login` |
| Dashboard | `/dashboard` |
| Actas de ingreso | `/actas/ingreso` |
| Actas de entrega-recepción | `/actas/entrega` |
| Existencias | `/inventario/existencias` |
| Movimientos | `/inventario/movimientos` |
| Materiales | `/catalogos/materiales` |
| Categorías | `/catalogos/categorias` |
| Unidades de medida | `/catalogos/unidades-medida` |
| Instituciones | `/catalogos/instituciones` |
| Autoridades distritales | `/catalogos/autoridades-distritales` |
| Procesos de adquisición | `/catalogos/procesos-adquisicion` |
| Usuarios | `/usuarios` |

## Roles

| Rol | Acceso |
|---|---|
| `administrador` | Gestión completa de usuarios, catálogos, actas, existencias y movimientos |
| `asistente_actas` | Operación de actas y consulta de inventario |
| `consulta` | Lectura de información permitida |

La seguridad real se valida en el backend. El frontend solo ajusta navegación y acciones visibles para mejorar la experiencia.

## Integración con la API

El cliente HTTP está en `src/api/http.ts` y usa `VITE_API_URL` como `baseURL`. Endpoints principales consumidos:

```txt
POST /auth/login
POST /auth/refresh
GET  /auth/me
POST /auth/logout

GET  /inventario/resumen
GET  /inventario/existencias
GET  /inventario/alertas-bajo-stock
GET  /inventario/movimientos

GET  /actas-ingreso
GET  /actas-entrega
GET  /materiales
GET  /categorias
GET  /unidades-medida
GET  /instituciones
GET  /autoridades-distritales
GET  /procesos-adquisicion
GET  /users
```

## Estructura

```txt
src/
|-- api/                  # Cliente HTTP y manejo de errores
|-- auth/                 # Sesión y autenticación
|-- components/           # Componentes reutilizables y layout
|-- features/             # Vistas principales por módulo
|   |-- acts/             # Actas de ingreso y entrega
|   |-- catalogs/         # Catálogos administrativos
|   |-- dashboard/        # Dashboard principal
|   |-- inventory/        # Existencias y movimientos
|   |-- profile/          # Perfil de usuario
|   `-- users/            # Gestión de usuarios
|-- permissions/          # Capacidades visuales por rol
|-- routes/               # Rutas de la aplicación
|-- stores/               # Estado global
|-- types/                # Contratos TypeScript
`-- views/                # Vistas generales
```

## Despliegue

1. Crear el proyecto en el proveedor de hosting.
2. Configurar `VITE_API_URL` con la URL productiva de la API y el prefijo `/api/v1`.
3. Usar `npm install` como comando de instalación.
4. Usar `npm run build` como comando de build.
5. Publicar la carpeta `dist/`.
6. Agregar la URL pública del frontend a `CORS_ORIGINS` en el backend.

## Autor

Desarrollado por **he-code** como proyecto de portafolio.
