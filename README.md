# SIARE Frontend

Frontend web del sistema **SIARE**, una aplicación para la gestión de inventario institucional, actas de ingreso, actas de entrega-recepción, catálogos administrativos y consulta de existencias.

Este proyecto forma parte de un sistema full stack desarrollado como portafolio, con frontend en Vue y backend en Node.js/Fastify.

---

## Descripción general

SIARE permite organizar el flujo de inventario institucional mediante documentos formales. El sistema evita modificaciones manuales directas del stock y centraliza los movimientos a través de actas de ingreso y actas de entrega-recepción.

El frontend ofrece una interfaz web para:

- Consultar el estado del inventario.
- Registrar actas de ingreso.
- Registrar actas de entrega-recepción.
- Consultar existencias actuales.
- Revisar movimientos de inventario.
- Gestionar catálogos institucionales.
- Gestionar usuarios según roles.
- Visualizar alertas de materiales con bajo stock.

---

## Características principales

- Vista pública antes del inicio de sesión.
- Autenticación con token de acceso.
- Validación de sesión al ingresar a rutas protegidas.
- Menú lateral organizado por secciones.
- Protección visual de rutas según rol.
- Dashboard con resumen general del sistema.
- Consulta de existencias actuales.
- Alertas de bajo stock.
- Historial de movimientos de inventario.
- Registro y gestión de actas de ingreso.
- Registro y gestión de actas de entrega-recepción.
- Gestión de catálogos:
  - Materiales.
  - Categorías.
  - Unidades de medida.
  - Instituciones y líderes.
  - Autoridades distritales.
  - Procesos de adquisición.
- Gestión de usuarios.
- Diseño responsive para escritorio y pantallas reducidas.
- Pruebas unitarias con Vitest.

---

## Flujo de inventario

El sistema sigue un flujo seguro para evitar alteraciones manuales del stock.

```txt
Acta de ingreso
        ↓
Aumenta existencias

Acta de entrega-recepción
        ↓
Descuenta existencias

Existencias
        ↓
Consulta el stock actual

Movimientos
        ↓
Muestra el historial de entradas y salidas
```

El ajuste manual de stock fue retirado del frontend y bloqueado en el backend por seguridad.  
Las existencias solo deben cambiar mediante procesos documentados.

---

## Módulos principales

### Vista pública

Ruta inicial del sistema. Presenta información general antes del inicio de sesión.

```txt
/
```

### Inicio de sesión

Permite acceder al sistema con credenciales válidas.

```txt
/login
```

### Dashboard

Muestra un resumen general del sistema, incluyendo alertas y datos relevantes del inventario.

```txt
/dashboard
```

### Actas de ingreso

Permite registrar ingresos de materiales al inventario.

```txt
/actas/ingreso
```

### Actas de entrega-recepción

Permite registrar salidas o entregas de materiales, descontando existencias.

```txt
/actas/entrega
```

### Existencias

Lista los materiales existentes y su cantidad actual.

```txt
/inventario/existencias
```

### Movimientos de inventario

Muestra el historial de movimientos generados por ingresos y entregas.

```txt
/inventario/movimientos
```

### Catálogos

Agrupa la administración de datos base del sistema.

```txt
/catalogos/materiales
/catalogos/categorias
/catalogos/unidades-medida
/catalogos/instituciones
/catalogos/autoridades-distritales
/catalogos/procesos-adquisicion
```

### Usuarios

Permite administrar usuarios del sistema.

```txt
/usuarios
```

---

## Roles del sistema

El frontend controla la visualización de opciones según el rol del usuario.

| Rol | Descripción |
|---|---|
| `administrador` | Acceso completo a módulos administrativos, catálogos, usuarios, actas, existencias y movimientos. |
| `asistente_actas` | Acceso operativo para gestión de actas y consulta de inventario. |
| `consulta` | Acceso de solo lectura a información permitida. |

> La seguridad real se valida en el backend. El frontend solo mejora la experiencia visual y evita mostrar opciones no disponibles para cada rol.

---

## Tecnologías utilizadas

- Vue 3.
- TypeScript.
- Vite.
- Vue Router.
- Pinia.
- Axios.
- Vitest.
- Lucide Vue.
- CSS personalizado.

---

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js 20 o superior.
- npm.
- Backend de SIARE en ejecución.

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/he-code/siare-frontend.git
```

Entrar al proyecto:

```bash
cd siare-frontend
```

Instalar dependencias:

```bash
npm install
```

---

## Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Para producción, esta variable debe apuntar al backend desplegado:

```env
VITE_API_URL=https://tu-backend.onrender.com/api/v1
```

---

## Ejecución en desarrollo

```bash
npm run dev
```

El frontend se ejecutará normalmente en:

```txt
http://localhost:5173
```

---

## Scripts disponibles

### Iniciar entorno de desarrollo

```bash
npm run dev
```

### Validar TypeScript

```bash
npm run typecheck
```

### Ejecutar pruebas

```bash
npm run test
```

### Compilar para producción

```bash
npm run build
```

### Vista previa del build

```bash
npm run preview
```

---

## Validación recomendada antes de subir cambios

Antes de hacer commit o desplegar, ejecutar:

```bash
npm run typecheck
npm run test
npm run build
```

---

## Estructura general del proyecto

```txt
src/
├── auth/                 # Manejo de sesión y autenticación
├── components/           # Componentes reutilizables y layout principal
├── features/             # Vistas principales por módulo
│   ├── acts/             # Actas de ingreso y entrega
│   ├── catalogs/         # Catálogos administrativos
│   ├── dashboard/        # Dashboard principal
│   ├── inventory/        # Existencias y movimientos
│   └── users/            # Gestión de usuarios
├── http/                 # Cliente HTTP
├── permissions/          # Capacidades visuales por rol
├── routes/               # Rutas de la aplicación
├── stores/               # Estados globales
├── utils/                # Funciones auxiliares
└── views/                # Vistas generales
```

---

## Seguridad del flujo de inventario

El sistema evita el ajuste manual directo del stock.

Las existencias se modifican únicamente mediante:

- Actas de ingreso.
- Actas de entrega-recepción.

Esto ayuda a mantener trazabilidad, control documental y mayor seguridad en el manejo del inventario.

---

## Integración con backend

Este frontend consume una API REST del backend SIARE.

Endpoints principales utilizados:

```txt
POST /auth/login
GET  /auth/me
POST /auth/logout

GET  /inventario/resumen
GET  /inventario/existencias
GET  /inventario/alertas-bajo-stock
GET  /inventario/movimientos

GET  /materiales
GET  /categorias
GET  /unidades-medida
GET  /instituciones
GET  /autoridades-distritales
GET  /procesos-adquisicion
GET  /users
```

---

## Despliegue sugerido

Para un portafolio gratuito se recomienda:

```txt
Frontend: Netlify o Vercel
Backend: Render
Base de datos: Neon PostgreSQL
```

Flujo sugerido:

```txt
Usuario
  ↓
Frontend en Netlify/Vercel
  ↓
Backend en Render
  ↓
Base de datos PostgreSQL en Neon
```

---

## Configuración para producción

En producción, configurar la variable:

```env
VITE_API_URL=https://tu-backend.onrender.com/api/v1
```

Luego generar el build:

```bash
npm run build
```

El resultado se generará en:

```txt
dist/
```

---

## Estado del proyecto

Proyecto preparado para portafolio, con:

- Interfaz responsive.
- Flujo de inventario basado en actas.
- Consulta de existencias.
- Alertas de bajo stock.
- Gestión de catálogos.
- Gestión de usuarios.
- Validación de sesión.
- Pruebas básicas.
- Build de producción funcional.

---

## Autor

Desarrollado por **he-code** como proyecto de portafolio.

Repositorio:

```txt
https://github.com/he-code/siare-frontend
```