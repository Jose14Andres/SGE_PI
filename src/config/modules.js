/**
 * Registro Funcional de Módulos (Strategy Principle).
 * Define la estructura, agrupación y metadata visual de todas las rutas de la aplicación.
 * Para agregar un nuevo módulo, se registra aquí y se asigna acceso en permissions.js.
 */
export const APP_MODULES = [
  { id: 'dashboard',   group: 'Principal',         groupIcon: '▦',  label: 'Dashboard',    icon: '▦' },
  { id: 'alumnos',     group: 'Gestión Académica', groupIcon: '🎯',  label: 'Alumnos',      icon: '🎓' },
  { id: 'profesores',  group: 'Gestión Académica', groupIcon: '🎯',  label: 'Profesores',   icon: '👨‍🏫' },
  { id: 'cursos',      group: 'Gestión Académica', groupIcon: '🎯',  label: 'Secciones',    icon: '📚' },
  { id: 'materias',    group: 'Gestión Académica', groupIcon: '🎯',  label: 'Materias',     icon: '📋' },
  { id: 'mis-materias',group: 'Mi Académico',      groupIcon: '📘',  label: 'Mis Materias', icon: '📋' },
  { id: 'mis-alumnos', group: 'Mi Académico',      groupIcon: '📘',  label: 'Mis Alumnos',  icon: '🎓' },
  { id: 'mi-horario',  group: 'Mi Académico',      groupIcon: '🎓',  label: 'Mi Horario',   icon: '📅' },
  { id: 'perfil',      group: 'Cuenta',            groupIcon: '⚙️',   label: 'Mi Perfil',    icon: '👤' },
];

/**
 * Deriva solo los módulos permitidos para un rol específico.
 * @param {Array<string>} allowedIds - IDs obtenidos de ROLES_PERMISSIONS[role]
 * @returns {Array<Object>} Arreglo agrupado { group, icon, items: [] } estructurado para la UI.
 */
export const getNavigationForRole = (allowedIds = []) => {
  const allowed = APP_MODULES.filter(m => allowedIds.includes(m.id));
  const grouped = {};
  
  allowed.forEach(m => {
    if (!grouped[m.group]) {
      grouped[m.group] = { group: m.group, icon: m.groupIcon, items: [] };
    }
    grouped[m.group].items.push(m);
  });
  
  return Object.values(grouped);
};
