# SGE — Sistema de Gestión Académica

Aplicación web (SPA) para la administración académica de una institución educativa: alumnos, profesores, secciones (cursos), materias y horarios, con acceso diferenciado por rol.

Construida con **React 19 + Vite**, visualizaciones 3D con **Three.js / React Three Fiber**, y desplegable como imagen **Docker + Nginx**. El diseño del proyecto sigue el marco de gobernanza de TI **ISO/IEC 38500:2015** (ver [CHANGELOG.md](CHANGELOG.md)).

> ⚠️ El sistema no tiene backend: los datos viven en el estado del frontend (`src/data.js`) y la autenticación está simulada. Es un proyecto académico/demostrativo.

---

## Características

- **Control de acceso por roles (RBAC)** centralizado en `src/config/permissions.js`, con rutas protegidas (`ProtectedRoute`).
- **Menú lateral dinámico**: la navegación se genera a partir del registro de módulos (`src/config/modules.js`) filtrado por los permisos del rol.
- **Dashboards por rol**, incluyendo gráficos de barras 3D y fondo 3D en el login.
- **CRUD** de alumnos, profesores, secciones y materias (según permisos).
- **Perfil de usuario**: edición de datos, avatar y cambio de contraseña.
- **Carga diferida** (`React.lazy` + `Suspense`) de dashboards y módulos, y separación del código de terceros en un chunk `vendor`.
- **Datos de ejemplo**: 5 carreras (Ingeniería, Psicología, Derecho, Medicina, Marketing), 20 profesores y secciones generadas por nivel y paralelo.

## Roles y permisos

| Módulo | Administrador | Secretaria | Profesor | Alumno |
|---|:---:|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Alumnos | CRUD completo | Crear / editar (sin eliminar) | — | — |
| Profesores | CRUD completo | — | — | — |
| Secciones (cursos) | CRUD completo | Solo lectura | — | — |
| Materias | CRUD completo | Solo lectura | — | — |
| Mis Materias | — | — | ✅ | ✅ |
| Mis Alumnos | — | — | ✅ | — |
| Mi Horario | — | — | — | ✅ |
| Mi Perfil | ✅ | ✅ | ✅ | ✅ |

Para agregar un módulo nuevo: regístralo en `src/config/modules.js`, asígnalo a los roles en `src/config/permissions.js` y añade su vista en `src/App.jsx`.

## Seguridad

- Contraseñas almacenadas como hash **SHA-256** (Web Crypto API).
- Sesión en `sessionStorage` firmada para detectar manipulación del rol o del ID (`src/utils/crypto.js`).
- Validación de que el rol solicitado en el login coincide con el rol registrado del usuario.
- **Bloqueo temporal** tras 5 intentos fallidos de inicio de sesión.
- Validación de longitud de entradas y límite de tamaño en la subida de avatar.
- Prevención de *mass assignment*: las actualizaciones de estado solo aceptan campos permitidos.
- Usuarios demo cargados **solo en desarrollo** (`import.meta.env.DEV`); no se incluyen en el build de producción.
- Cabeceras de seguridad en Nginx: `X-Frame-Options: DENY`, `X-Content-Type-Options`, `X-XSS-Protection` y **Content Security Policy**.

El registro de hallazgos y correcciones de seguridad está en [`.jules/sentinel.md`](.jules/sentinel.md); las optimizaciones de rendimiento, en [`.jules/bolt.md`](.jules/bolt.md).

## Tecnologías

| Área | Herramientas |
|---|---|
| UI | React 19, Tailwind CSS (CDN), Google Fonts (Playfair Display, DM Sans) |
| 3D | three, @react-three/fiber, @react-three/drei |
| Build | Vite 8, @vitejs/plugin-react |
| Calidad | ESLint 9, `node --test` |
| Despliegue | Docker (multi-stage), Nginx |

## Requisitos

- Node.js 20 o superior
- npm (también hay `pnpm-lock.yaml` si prefieres pnpm)
- Docker (opcional, para producción)

## Instalación y uso

```bash
git clone https://github.com/Jose14Andres/SGE_PI.git
cd SGE_PI
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Usuarios de demostración (solo en `npm run dev`)

| Rol | Correo |
|---|---|
| Administrador | `admin@sge.edu` |
| Secretaria | `secretaria@sge.edu` |
| Profesor | `profesor@sge.edu` |
| Alumno | `alumno@sge.edu` |

Las contraseñas están guardadas como hash en `src/data.js`; solicítalas al equipo del proyecto.

### Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Análisis estático con ESLint |
| `npm test` | Pruebas unitarias (`permissions`, `modules`, `crypto`) |

### Variables de entorno (opcional)

| Variable | Uso |
|---|---|
| `VITE_SESSION_SECRET` | Secreto para firmar la sesión. Si no se define, se genera uno aleatorio en cada carga. |

## Despliegue con Docker

```bash
docker compose up -d --build
```

Compila la app con Node 20 y la sirve con Nginx en `http://localhost` (puerto 80). La configuración de Nginx (`nginx.conf`) redirige todas las rutas a `index.html` (SPA), aplica las cabeceras de seguridad y cachea los recursos estáticos.

## Estructura del proyecto

```
SGE_PI/
├── src/
│   ├── App.jsx                # Estado global, sesión, CRUD y enrutamiento por rol
│   ├── main.jsx               # Punto de entrada
│   ├── data.js                # Datos de ejemplo (usuarios, profesores, cursos, materias, alumnos)
│   ├── components/
│   │   ├── Auth.jsx           # Login con bloqueo por intentos fallidos
│   │   ├── Layout.jsx         # Sidebar y estructura general
│   │   ├── Dashboards.jsx     # Dashboards y vistas por rol
│   │   ├── Modules.jsx        # Módulos CRUD
│   │   ├── Profile.jsx        # Perfil de usuario
│   │   ├── ProtectedRoute.jsx # Protección de vistas por permisos
│   │   ├── ErrorBoundary.jsx
│   │   ├── UI.jsx             # Componentes de interfaz reutilizables
│   │   └── 3D/                # BarChart3D y LoginBackground
│   ├── config/
│   │   ├── permissions.js     # Matriz de permisos RBAC
│   │   └── modules.js         # Registro de módulos y navegación
│   ├── hooks/usePerformance.js
│   └── utils/crypto.js        # Hash, aleatorio seguro y firma de sesión
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── vite.config.js
```

## Historial de cambios

Ver [CHANGELOG.md](CHANGELOG.md).
