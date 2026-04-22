/**
 * Matriz central de permisos de acceso.
 * Define a qué vistas (módulos funcionales) tiene acceso cada rol.
 */
export const ROLES_PERMISSIONS = {
  Administrador: ['dashboard', 'alumnos', 'profesores', 'cursos', 'materias', 'perfil'],
  Secretaria: ['dashboard', 'alumnos', 'cursos', 'materias', 'perfil'],
  Profesor: ['dashboard', 'mis-materias', 'mis-alumnos', 'perfil'],
  Alumno: ['dashboard', 'mis-materias', 'mi-horario', 'perfil'],
};

/**
 * Función de validación RBAC (Role-Based Access Control).
 * @param {string} role - Rol del usuario.
 * @param {string} view - Vista solicitada.
 * @returns {boolean} - true si tiene permiso, false caso contrario.
 */
export const canAccess = (role, view) => {
  if (!ROLES_PERMISSIONS[role]) return false;
  return ROLES_PERMISSIONS[role].includes(view);
};
