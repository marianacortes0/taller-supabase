# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# taller-supabase

> **Documentación Técnica — HomeworksProject**  
> Azure App Service · Chile Central · Versión 1.0

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura de Tiers](#2-arquitectura-de-tiers)
3. [Layers del Sistema](#3-layers-del-sistema)
4. [Endpoints de la API REST](#4-endpoints-de-la-api-rest)
5. [Modelo de Base de Datos](#5-modelo-de-base-de-datos)
6. [Paso a Paso del Desarrollo](#6-paso-a-paso-del-desarrollo)
7. [Variables de Entorno](#7-variables-de-entorno)
8. [Estructura de Carpetas](#8-estructura-de-carpetas)
9. [Glosario](#9-glosario)

---

## 1. Resumen Ejecutivo

**taller-supabase** es una aplicación web fullstack para la gestión de tareas escolares (*Homeworks*). Está desplegada en **Azure App Service** en la región de Chile Central y utiliza **Supabase** como plataforma BaaS para la base de datos PostgreSQL, autenticación de usuarios y almacenamiento de archivos.

La aplicación implementa una arquitectura de tres capas (presentación, lógica de negocio y datos) con separación clara de responsabilidades entre el frontend SPA y el backend API REST.

| Campo | Valor |
|---|---|
| **URL de producción** | https://homeworksproject-h2fhfjfrg8dddnd8.chilecentral-01.azurewebsites.net |
| **Plataforma cloud** | Microsoft Azure App Service (Chile Central) |
| **Stack principal** | Node.js / Next.js + Supabase (PostgreSQL) |
| **Autenticación** | JWT via Supabase Auth |
| **Base de datos** | PostgreSQL gestionado por Supabase |
| **Versión** | 1.0.0 |

---

## 2. Arquitectura de Tiers

El sistema se organiza en **4 tiers** con responsabilidades y tecnologías bien diferenciadas.

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1 — Presentación (Frontend SPA)                       │
│  React / Next.js · Azure App Service                        │
├─────────────────────────────────────────────────────────────┤
│  TIER 2 — Lógica de Negocio (Backend API)                   │
│  Node.js / Express · Azure App Service Chile Central        │
├─────────────────────────────────────────────────────────────┤
│  TIER 3 — Datos (Supabase + PostgreSQL)                     │
│  PostgreSQL · Auth · Storage · Realtime · RLS               │
├─────────────────────────────────────────────────────────────┤
│  TIER 4 — Infraestructura & DevOps                          │
│  Azure App Service · CI/CD · Monitor · App Settings         │
└─────────────────────────────────────────────────────────────┘
```

---

### Tier 1 — Capa de Presentación (Frontend)

> Single Page Application — React / Next.js

| Componente | Descripción |
|---|---|
| **Tecnología** | React.js / Next.js con TypeScript |
| **Hosting** | Azure App Service (servido como SPA) |
| **Routing** | React Router / Next.js App Router para navegación del lado cliente |
| **Estado** | Context API o Zustand para manejo global de estado |
| **Formularios** | React Hook Form + validación con Zod o Yup |
| **HTTP Client** | Axios o Fetch API para consumo de la API REST |
| **Auth UI** | Páginas de Login, Register y Reset Password integradas con Supabase Auth |
| **Estilos** | Tailwind CSS o CSS Modules para el diseño de interfaces |

---

### Tier 2 — Capa de Lógica de Negocio (Backend API)

> Node.js / Express o Next.js API Routes

| Componente | Descripción |
|---|---|
| **Tecnología** | Node.js con Express o Next.js API Routes |
| **Estilo API** | REST — JSON sobre HTTP/HTTPS |
| **Autenticación** | Middleware JWT: verifica tokens emitidos por Supabase Auth |
| **Validación** | Validación de payloads con Joi, Zod o class-validator |
| **CORS** | Configurado para aceptar orígenes del dominio de producción |
| **Errores** | Middleware centralizado de manejo de errores HTTP |
| **Patrón** | Arquitectura en capas: Route → Controller → Service → Repository |
| **Variables** | `.env` / Azure App Settings para secretos y configuración |

---

### Tier 3 — Capa de Datos (Supabase + PostgreSQL)

> Backend-as-a-Service — Supabase Cloud

| Componente | Descripción |
|---|---|
| **Motor DB** | PostgreSQL 15 gestionado por Supabase |
| **Supabase Auth** | Gestión completa de usuarios, sesiones y tokens JWT |
| **RLS** | Row Level Security: políticas de acceso por usuario en cada tabla |
| **Storage** | Supabase Storage para archivos adjuntos (imágenes, PDFs de tareas) |
| **Realtime** | Supabase Realtime (WebSockets) para actualizaciones en tiempo real |
| **Client SDK** | `supabase-js` v2 como cliente oficial en el backend |
| **Migrations** | SQL Migrations versionadas para evolución del esquema |
| **Backups** | Backups automáticos diarios gestionados por Supabase |

---

### Tier 4 — Infraestructura & DevOps

> Microsoft Azure — Chile Central

| Componente | Descripción |
|---|---|
| **Plataforma** | Azure App Service (Plan B1 o superior) |
| **Región** | Chile Central (`chilecentral-01`) — baja latencia para usuarios en Chile |
| **CI/CD** | GitHub Actions o Azure DevOps para despliegue automático en push a `main` |
| **Secretos** | Azure App Settings como variables de entorno en producción |
| **SSL** | Certificado TLS/HTTPS automático provisto por Azure App Service |
| **Logging** | Azure Monitor + Application Insights para trazabilidad y alertas |
| **Scaling** | Auto-scaling horizontal disponible según el plan de App Service |
| **Dominio** | Subdominio `azurewebsites.net` provisto por Azure |

---

## 3. Layers del Sistema

### 3.1 Backend — Capas internas

El backend implementa una arquitectura en capas que separa las responsabilidades y facilita el testing y la mantenibilidad.

```
HTTP Request
     │
     ▼
┌─────────────┐
│ Routes      │  ← Define los endpoints y asocia cada ruta con su controller
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │  ← Valida JWT, permisos, schemas, gestión de errores globales
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │  ← Recibe req/res, extrae params/body, retorna JSON
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Service     │  ← Lógica de negocio, reglas, orquestación entre repositorios
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Repository  │  ← Acceso directo a Supabase (único punto de contacto con la DB)
└──────┬──────┘
       │
       ▼
  Supabase DB
```

| Capa | Archivo/Módulo | Responsabilidad |
|---|---|---|
| **Routes Layer** | `routes/*.ts` | Define los endpoints HTTP y asocia cada ruta con su controller. Sin lógica de negocio. |
| **Middleware Layer** | `middlewares/*.ts` | Intercepta peticiones para validar JWT, verificar permisos, validar schemas y gestionar errores globales. |
| **Controller Layer** | `controllers/*.ts` | Recibe la petición HTTP, extrae parámetros/body, llama al Service y retorna la respuesta JSON. |
| **Service Layer** | `services/*.ts` | Contiene toda la lógica de negocio: reglas, cálculos, orquestación entre repositorios. |
| **Repository Layer** | `repositories/*.ts` | Accede directamente a Supabase (insertar, leer, actualizar, eliminar). Único punto de contacto con la DB. |
| **DTOs / Schemas** | `schemas/*.ts` | Define y valida la forma de los datos de entrada y salida (Data Transfer Objects). |

---

### 3.2 Frontend — Capas internas

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| **Pages / Views** | `src/pages/` | Vistas principales del router. Cada archivo corresponde a una ruta de la aplicación (login, dashboard, homeworks, etc.). |
| **Components** | `src/components/` | Componentes de UI reutilizables (botones, tarjetas, tablas, modales). Stateless o con estado local mínimo. |
| **Hooks** | `src/hooks/` | Custom hooks de React que encapsulan lógica de estado, efectos y llamadas a la API. |
| **API Client** | `src/api/` | Funciones tipadas para llamar al backend. Centraliza la URL base, headers de autorización y manejo de errores. |
| **Auth Context** | `src/context/` | Context de autenticación: almacena el usuario activo, token JWT y expone funciones `login`/`logout`. |
| **Types / Models** | `src/types/` | Definiciones TypeScript de las entidades del dominio (Homework, User, Grade, etc.). |

---

## 4. Endpoints de la API REST

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <JWT_TOKEN>
```

El token es emitido por Supabase Auth al hacer login.

---

### 4.1 Módulo de Autenticación — `/api/auth`

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión con email y contraseña. Retorna JWT. | Público |
| `POST` | `/api/auth/register` | Crear nueva cuenta de usuario. | Público |
| `POST` | `/api/auth/logout` | Invalidar la sesión actual y revocar el token. | JWT |
| `GET` | `/api/auth/me` | Obtener perfil del usuario autenticado. | JWT |
| `POST` | `/api/auth/refresh` | Refrescar el token JWT antes de que expire. | JWT |
| `POST` | `/api/auth/forgot-password` | Enviar email de recuperación de contraseña. | Público |
| `POST` | `/api/auth/reset-password` | Cambiar contraseña con token de recuperación. | Público |

**Ejemplo de request — login:**
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Ejemplo de response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario"
  }
}
```

---

### 4.2 Módulo de Tareas — `/api/homeworks`

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/homeworks` | Listar todas las tareas del usuario autenticado. | JWT |
| `GET` | `/api/homeworks/:id` | Obtener detalle de una tarea específica. | JWT |
| `POST` | `/api/homeworks` | Crear una nueva tarea. | JWT |
| `PUT` | `/api/homeworks/:id` | Actualizar completamente una tarea existente. | JWT |
| `PATCH` | `/api/homeworks/:id` | Actualizar parcialmente una tarea (ej: marcar como completada). | JWT |
| `DELETE` | `/api/homeworks/:id` | Eliminar una tarea. | JWT |
| `GET` | `/api/homeworks/:id/files` | Listar archivos adjuntos de una tarea. | JWT |
| `POST` | `/api/homeworks/:id/files` | Subir archivo adjunto (`multipart/form-data`). | JWT |

---

### 4.3 Módulo de Usuarios — `/api/users`

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/users` | Listar todos los usuarios (solo admin). | JWT |
| `GET` | `/api/users/:id` | Obtener perfil de un usuario específico. | JWT |
| `PUT` | `/api/users/:id` | Actualizar perfil de usuario. | JWT |
| `DELETE` | `/api/users/:id` | Eliminar cuenta de usuario (solo admin). | JWT |
| `GET` | `/api/users/:id/homeworks` | Obtener tareas asignadas a un usuario. | JWT |

---

### 4.4 Módulo de Cursos — `/api/courses`

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/courses` | Listar todos los cursos disponibles. | JWT |
| `GET` | `/api/courses/:id` | Obtener detalle de un curso. | JWT |
| `POST` | `/api/courses` | Crear un nuevo curso. | JWT |
| `PUT` | `/api/courses/:id` | Actualizar un curso. | JWT |
| `DELETE` | `/api/courses/:id` | Eliminar un curso. | JWT |
| `GET` | `/api/courses/:id/homeworks` | Obtener tareas asociadas a un curso. | JWT |

---

### 4.5 Endpoints de Sistema

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Health check del servidor. Retorna `200 OK`. | Público |
| `GET` | `/api` | Información general de la API (versión, nombre). | Público |

---

## 5. Modelo de Base de Datos

La base de datos está en **PostgreSQL** gestionado por Supabase. Todas las tablas tienen **Row Level Security (RLS)** habilitado.

```
┌────────────┐       ┌─────────────┐       ┌──────────┐
│   users    │──┐    │  homeworks  │──────▶│  grades  │
│────────────│  │    │─────────────│       │──────────│
│ id (PK)    │  │    │ id (PK)     │       │ id (PK)  │
│ email      │  └───▶│ user_id(FK) │       │homework_id│
│ name       │       │ course_id(FK│       │ user_id  │
│ role       │       │ title       │       │ score    │
│ created_at │       │ description │       │ feedback │
└────────────┘       │ due_date    │       └──────────┘
                     │ status      │
      ┌──────────┐   └──────┬──────┘
      │ courses  │          │
      │──────────│          ▼
      │ id (PK)  │    ┌──────────┐
      │ name     │    │  files   │
      │teacher_id│    │──────────│
      │created_at│    │homework_id│
      └──────────┘    │ url      │
                      │ name     │
                      │ size     │
                      └──────────┘
```

| Tabla | Columnas principales | Relaciones | Descripción |
|---|---|---|---|
| `users` | `id, email, name, role, created_at` | FK → `auth.users` | Perfiles extendidos. Referencia a la tabla `auth.users` de Supabase. |
| `homeworks` | `id, title, description, due_date, status, user_id, course_id` | FK `users`, `courses` | Tabla principal de tareas. Vinculada a un usuario y un curso. |
| `courses` | `id, name, description, teacher_id, created_at` | FK `users` (teacher) | Cursos o materias. El `teacher_id` apunta al docente encargado. |
| `grades` | `id, homework_id, user_id, score, feedback, graded_at` | FK `homeworks`, `users` | Calificaciones asignadas a cada tarea por usuario. |
| `files` | `id, homework_id, url, name, size, created_at` | FK `homeworks` | Archivos adjuntos almacenados en Supabase Storage. |

> **Row Level Security (RLS):** Todas las tablas tienen RLS habilitado. Las políticas SQL garantizan que un usuario solo pueda leer y modificar sus propios registros. Ejemplo: un usuario con `role="student"` solo ve sus propios `homeworks`.

---

## 6. Paso a Paso del Desarrollo

### Paso 1 — Configuración inicial del proyecto
- Crear repositorio Git
- Inicializar proyecto Node.js (`npm init`)
- Instalar dependencias base: `express` / `next`, `supabase-js`, `dotenv`, `typescript`
- Crear archivo `.env` con `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`

### Paso 2 — Configuración de Supabase
- Crear proyecto en [Supabase Dashboard](https://supabase.com)
- Obtener URL y API Keys del proyecto
- Habilitar Supabase Auth con proveedor `email/password`
- Configurar políticas de email y URL de redirección post-login

### Paso 3 — Modelado de base de datos
- Diseñar el esquema de tablas en el SQL Editor de Supabase
- Crear tablas: `users`, `homeworks`, `courses`, `grades`, `files`
- Definir claves foráneas y tipos de datos
- Ejecutar migraciones SQL

```sql
-- Ejemplo: tabla homeworks
create table homeworks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  course_id uuid references courses(id),
  title text not null,
  description text,
  due_date timestamptz,
  status text default 'pending',
  created_at timestamptz default now()
);
```

### Paso 4 — Implementación de Row Level Security
- Habilitar RLS en cada tabla
- Crear políticas: `"Users can only read their own rows"`
- Crear políticas de inserción y actualización
- Probar políticas con usuarios de prueba

```sql
-- Habilitar RLS
alter table homeworks enable row level security;

-- Política: solo el dueño puede ver sus tareas
create policy "Users see own homeworks"
  on homeworks for select
  using (auth.uid() = user_id);
```

### Paso 5 — Backend: módulo de autenticación
- Implementar `POST /api/auth/login` con `supabase.auth.signInWithPassword()`
- Implementar `POST /api/auth/register` con `supabase.auth.signUp()`
- Crear middleware `verifyJWT` que decodifica y valida el token en cada request protegido

```typescript
// middleware/verifyJWT.ts
import { createClient } from '@supabase/supabase-js';

export async function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: 'Invalid token' });

  req.user = data.user;
  next();
}
```

### Paso 6 — Backend: CRUD de recursos
- Implementar CRUD completo para `homeworks`, `courses`, `users` y `grades`
- Aplicar patrón Route → Controller → Service → Repository en cada módulo

```typescript
// repository/homeworkRepository.ts
export const homeworkRepository = {
  findAll: (userId: string) =>
    supabase.from('homeworks').select('*').eq('user_id', userId),

  findById: (id: string) =>
    supabase.from('homeworks').select('*').eq('id', id).single(),

  create: (data: CreateHomeworkDto) =>
    supabase.from('homeworks').insert(data).select().single(),

  update: (id: string, data: UpdateHomeworkDto) =>
    supabase.from('homeworks').update(data).eq('id', id).select().single(),

  delete: (id: string) =>
    supabase.from('homeworks').delete().eq('id', id),
};
```

### Paso 7 — Frontend: base y autenticación
- Crear el proyecto React/Next.js
- Configurar React Router / App Router
- Implementar páginas de Login y Register conectadas al endpoint `/api/auth`
- Almacenar el JWT en `localStorage` o `sessionStorage`
- Crear `AuthContext` para gestión global de sesión

### Paso 8 — Frontend: vistas principales
- Implementar Dashboard con listado de tareas
- Crear vista de detalle de Homework
- Implementar formularios de creación y edición
- Agregar carga de archivos adjuntos
- Proteger rutas privadas con `PrivateRoute` (redirect a `/login` si no hay token)

### Paso 9 — Testing
- Pruebas unitarias de servicios con **Jest**
- Pruebas de integración de endpoints con **Supertest**
- Verificación manual de flujos de login/register
- Pruebas de RLS directamente en Supabase Dashboard

### Paso 10 — Despliegue en Azure App Service
- Crear App Service en Azure Portal (región Chile Central, runtime Node.js)
- Configurar App Settings con las variables de entorno de producción
- Conectar el repositorio GitHub al App Service para despliegue continuo
- Habilitar HTTPS automático
- Verificar la URL de producción

### Paso 11 — Configuración de CI/CD
- Crear workflow de GitHub Actions (`.github/workflows/azure.yml`)
- Configurar secreto `AZURE_WEBAPP_PUBLISH_PROFILE` en el repositorio
- Pipeline: `build → test → deploy to Azure App Service`
- Validar que cada push a `main` despliegue automáticamente

```yaml
# .github/workflows/azure.yml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: azure/webapps-deploy@v2
        with:
          app-name: homeworksproject
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: .
```

---

## 7. Variables de Entorno

Configura estas variables en `.env` (desarrollo) y en **Azure App Settings** (producción).

| Variable | Entorno | Descripción |
|---|---|---|
| `SUPABASE_URL` | Ambos | URL del proyecto Supabase (`https://<id>.supabase.co`) |
| `SUPABASE_ANON_KEY` | Ambos | Clave pública (anon) de Supabase para el cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend only | Clave de service role — **NUNCA exponer en el frontend** |
| `JWT_SECRET` | Backend only | Secreto para firmar/verificar tokens JWT |
| `PORT` | Local | Puerto del servidor Express en desarrollo (ej: `3000`) |
| `NODE_ENV` | Ambos | Entorno de ejecución: `development` \| `production` |
| `NEXT_PUBLIC_API_URL` | Frontend | URL base de la API consumida por el frontend |
| `DATABASE_URL` | Backend only | Connection string de PostgreSQL (para ORMs como Prisma) |

```env
# .env — ejemplo desarrollo local
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> ⚠️ **Seguridad:** `SUPABASE_SERVICE_ROLE_KEY` tiene acceso total a la base de datos y bypasea RLS. Nunca debe incluirse en el código del frontend ni exponerse en el cliente.

---

## 8. Estructura de Carpetas

### Backend

```
/
├── src/
│   ├── routes/            ← Definición de rutas HTTP por módulo
│   │   ├── auth.routes.ts
│   │   ├── homework.routes.ts
│   │   ├── course.routes.ts
│   │   └── user.routes.ts
│   ├── controllers/       ← Manejo de req/res, sin lógica de negocio
│   │   ├── auth.controller.ts
│   │   ├── homework.controller.ts
│   │   └── ...
│   ├── services/          ← Lógica de negocio y reglas de dominio
│   │   ├── auth.service.ts
│   │   ├── homework.service.ts
│   │   └── ...
│   ├── repositories/      ← Acceso a Supabase (queries a la DB)
│   │   ├── homework.repository.ts
│   │   └── ...
│   ├── middlewares/       ← Auth JWT, validación, errores
│   │   ├── verifyJWT.ts
│   │   ├── validate.ts
│   │   └── errorHandler.ts
│   ├── schemas/           ← DTOs y validadores (Zod/Joi)
│   │   ├── homework.schema.ts
│   │   └── ...
│   ├── config/            ← Inicialización del cliente Supabase
│   │   └── supabase.ts
│   └── app.ts             ← Configuración de Express/Next.js
├── .env                   ← Variables de entorno (no subir a Git)
├── .gitignore
├── package.json
└── tsconfig.json
```

### Frontend

```
/
├── src/
│   ├── pages/             ← Vistas/rutas de la aplicación
│   │   ├── index.tsx      (Dashboard)
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── homeworks/
│   │       ├── index.tsx
│   │       └── [id].tsx
│   ├── components/        ← Componentes UI reutilizables
│   │   ├── HomeworkCard.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── hooks/             ← Custom hooks de React
│   │   ├── useHomeworks.ts
│   │   └── useAuth.ts
│   ├── api/               ← Funciones de llamada al backend
│   │   ├── auth.api.ts
│   │   └── homework.api.ts
│   ├── context/           ← Auth context y providers
│   │   └── AuthContext.tsx
│   ├── types/             ← Definiciones TypeScript
│   │   └── index.ts
│   └── utils/             ← Funciones auxiliares
│       └── helpers.ts
├── public/                ← Assets estáticos
├── .env.local             ← Variables de entorno del frontend
└── package.json
```

---

## 9. Glosario

| Término | Definición |
|---|---|
| **Supabase** | Plataforma BaaS (Backend-as-a-Service) open-source que provee PostgreSQL, Auth, Storage y Realtime. |
| **JWT** | JSON Web Token. Token firmado digitalmente usado para autenticar peticiones HTTP sin estado de sesión en el servidor. |
| **RLS** | Row Level Security. Mecanismo de PostgreSQL que restringe el acceso a filas individuales según políticas SQL por usuario. |
| **SPA** | Single Page Application. Aplicación web donde la navegación ocurre en el cliente sin recargar la página completa. |
| **Azure App Service** | Plataforma PaaS de Microsoft para alojar aplicaciones web sin administrar servidores directamente. |
| **REST** | Representational State Transfer. Estilo arquitectónico para APIs que usa verbos HTTP (GET, POST, PUT, DELETE). |
| **CI/CD** | Continuous Integration / Continuous Deployment. Pipeline automático que construye, prueba y despliega el código en cada commit. |
| **Middleware** | Función que intercepta peticiones HTTP antes de que lleguen al controller para validar, autenticar o transformar datos. |
| **Repository pattern** | Patrón de diseño que abstrae el acceso a la base de datos en una capa dedicada, desacoplando la lógica de negocio del ORM/SDK. |
| **supabase-js** | SDK oficial de JavaScript/TypeScript de Supabase para interactuar con Auth, Database, Storage y Realtime desde Node.js. |
| **BaaS** | Backend-as-a-Service. Proveedor que gestiona la infraestructura del servidor, DB y servicios comunes por el desarrollador. |
| **Tier** | Capa lógica o física que agrupa componentes con responsabilidades similares dentro de una arquitectura de software. |

---

*taller-supabase · Documentación Técnica v1.0 · 2025 · Azure App Service — Chile Central*
