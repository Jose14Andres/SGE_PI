import { canAccess } from '../config/permissions.js';

/**
 * Componente que intercepta y protege las rutas/vistas en base al RBAC.
 * Garantiza validación lógica antes del renderizado de los módulos.
 * 
 * @param {Object} props
 * @param {Object} props.user - El usuario autenticado (debe contener un rol válido).
 * @param {string} props.view - La vista (ruta) solicitada.
 * @param {React.ReactNode} props.children - Contenido a renderizar si es permitido.
 */
export default function ProtectedRoute({ user, view, children }) {
  // Validación de seguridad de la conexión/autenticación
  if (!user || !user.role) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="bg-red-900/50 border border-red-500/50 p-6 rounded-xl text-center shadow-lg">
          <h2 className="text-xl font-bold text-red-200 mb-2">Acceso Denegado</h2>
          <p className="text-red-300/80">No hay usuario autenticado válido en el sistema.</p>
        </div>
      </div>
    );
  }

  // Validación RBAC del Rol vs la Ruta (Responsibility y Stategy / ISO 38500)
  if (!canAccess(user.role, view)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in h-full">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 text-red-500 text-4xl mb-6 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif text-[#F4F6F9] mb-3">Acceso Restringido</h2>
        <p className="text-slate-400 max-w-sm">
          Las credenciales del rol <strong className="text-[#F4F6F9]">{user.role}</strong> no poseen privilegios suficientes para acceder al módulo de "<span className="text-gold">{view}</span>".
        </p>
      </div>
    );
  }

  // Cumple con la autorización
  return children;
}
