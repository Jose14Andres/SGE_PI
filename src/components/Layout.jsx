import { useState, useEffect } from 'react';
import { Avatar } from './UI.jsx';
import { ROLES_PERMISSIONS } from '../config/permissions.js';
import { getNavigationForRole, APP_MODULES } from '../config/modules.js';

const ROLE_BADGE = {
  Administrador: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Secretaria:    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Profesor:      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Alumno:        'bg-gold/20 text-gold border-gold/30',
};

export default function Layout({ user, currentView, onNavigate, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const groups = getNavigationForRole(ROLES_PERMISSIONS[user.role]);
  const currentTitle = APP_MODULES.find(m => m.id === currentView)?.label ?? '—';

  // Cada grupo conoce si está abierto; por defecto todos abiertos,
  // pero cerramos los que no contengan el currentView cuando se navega.
  const initialOpen = () => {
    const obj = {};
    groups.forEach(g => { obj[g.group] = true; });
    return obj;
  };
  const [openGroups, setOpenGroups] = useState(initialOpen);

  useEffect(() => {
    // Siempre mantener abierto el grupo con el currentView
    setOpenGroups(prev => {
      const next = { ...prev };
      let changed = false;
      groups.forEach(g => {
        if (g.items.some(i => i.id === currentView) && !next[g.group]) {
          next[g.group] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, user.role]);

  const toggleGroup = (name) => setOpenGroups(p => ({ ...p, [name]: !p[name] }));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent-light">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5v-7l9 5 9-5v7l-9 5z" />
            </svg>
          </div>
          <div>
            <div className="font-serif text-base font-bold text-white leading-tight">SGE</div>
            <div className="text-xs text-slate-500">Gestión Educativa</div>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
        {groups.map(group => (
          <div key={group.group}>
            <button
              onClick={() => toggleGroup(group.group)}
              aria-expanded={!!openGroups[group.group]}
              aria-controls={`nav-group-${group.group.replace(/\s+/g, '-')}`}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>{group.icon}</span>
                {group.group}
              </span>
              <svg className={`w-3 h-3 transition-transform ${openGroups[group.group] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openGroups[group.group] && (
              <div id={`nav-group-${group.group.replace(/\s+/g, '-')}`} className="space-y-1 mt-1 animate-fade-in" role="group" aria-label={`Submenú de ${group.group}`}>
                {group.items.map(item => (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left
                      ${currentView === item.id
                        ? 'bg-accent/20 text-accent-light border border-accent/30 shadow-sm shadow-accent/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                  >
                    <span className="text-base leading-none">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer" onClick={() => onNavigate('perfil')}>
          <Avatar user={user} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user.nombre} {user.apellido}</div>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${ROLE_BADGE[user.role]}`}>{user.role}</span>
          </div>
        </div>
        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-navy-900/70 backdrop-blur-md border-r border-white/10 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 flex flex-col w-64 bg-navy-900 border-r border-white/10 animate-slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-navy-900/70 backdrop-blur-md border-b border-white/10">
          <button onClick={() => setMobileOpen(true)} aria-label="Abrir menú de navegación" aria-expanded={mobileOpen} className="text-slate-400 hover:text-white p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-serif font-bold text-white">SGE</span>
          <button onClick={() => onNavigate('perfil')} aria-label="Ir al perfil" title="Perfil">
            <Avatar user={user} size="sm" />
          </button>
        </header>

        {/* Top bar (desktop) with breadcrumb */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-white/5 bg-navy-900/30">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">SGE</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300 font-medium">{currentTitle}</span>
          </div>
          <button onClick={() => onNavigate('perfil')} aria-label="Ir al perfil" title="Perfil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar user={user} size="sm" />
            <span className="text-sm text-slate-400">{user.nombre}</span>
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div key={currentView} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
