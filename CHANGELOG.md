# Changelog - SGE_PI

Todas las notas de la versión relevantes a implementaciones, revisiones técnicas o compliance se documentarán aquí.

## [1.0.0] - 2026-04-21
### Añadido
- **Gobernanza TI:** Implementación del marco ISO/IEC 38500:2015 completo.
- **Principio 1 (Responsabilidad):** Control de Accesos Basado en Roles (RBAC) centralizado. El sistema no expone módulos protegidos mediante intercepción de URL (HOC `ProtectedRoute`).
- **Principio 2 (Estrategia):** Arquitectura regida funcionalmente ("Strategy"). El enrutamiento y menús laterales se generan dinámicamente según matrices autorreferenciales en `permissions.js`.
- **Principio 3 (Adquisición):** Optimización técnica de entrega con Docker multi-stage y uso de licencias conformes (MIT). El código JS realiza bundle-splitting separando vendor code (React) mediante `esbuild`.
- **Principio 4 (Desempeño):** Hooks de performance predictivos `usePerformance` inyectados en consola local y estructuración de los "Dashboards" bajo Lazy Loading puro mediante `React.lazy()` y `<Suspense>`.
- **Principio 5 (Conformidad):** Sanitización de inputs globales para evitar XSS básico. Directivas en el proxy reverso Nginx para inhabilitar su montaje en frames ajenos (Clickjacking denial) y un modelo estricto de CSP (Content Security Policy). Ocultado en ambiente de producción de atajos (Credenciales de Demo protegidas por variable nativa DEV).
