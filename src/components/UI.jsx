import React, { useState, useEffect, useMemo, useRef } from 'react';

/* ─── Avatar ─────────────────────────────────────── */
export const Avatar = React.memo(function Avatar({ user, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' };
  const initials = user ? `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase() : '?';
  return user?.avatar
    ? <img src={user.avatar} alt="avatar" className={`${sizes[size]} rounded-full object-cover border-2 border-accent/40`} />
    : (
      <div className={`${sizes[size]} rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center font-semibold text-accent-light`}>
        {initials}
      </div>
    );
});

/* ─── Toast ──────────────────────────────────────── */
export const Toast = React.memo(function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none" aria-live="assertive" aria-relevant="additions text">
      {toasts.map(t => (
        <div
          key={t.id}
          role="alert"
          onClick={() => removeToast(t.id)}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium cursor-pointer animate-toast-in backdrop-blur-md
            ${t.type === 'success' ? 'bg-emerald-900/80 border-emerald-500/30 text-emerald-300' :
              t.type === 'error' ? 'bg-red-900/80 border-red-500/30 text-red-300' :
              'bg-navy-800 border-white/10 text-slate-300'}`}
        >
          {t.type === 'success' && <span className="text-emerald-400">✓</span>}
          {t.type === 'error' && <span className="text-red-400">✗</span>}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────── */
export function Modal({ title, children, onClose }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-navy-800/90 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="font-serif text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ─── Confirm Dialog ─────────────────────────────── */
export const ConfirmDialog = React.memo(function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          </div>
          <h3 className="font-serif text-lg font-semibold text-white">Confirmar acción</h3>
        </div>
        <p className="text-slate-300 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Form Field ─────────────────────────────────── */
export const Field = React.memo(function Field({ label, id, type = 'text', value, onChange, options, required, placeholder }) {
  const base = "w-full bg-navy-900/60 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all text-sm";
  
  // Sanitización de inputs (ISO 38500 - Principio 5 Conformidad)
  const handleSanitizedChange = (e) => {
    let val = e.target.value;
    if (type !== 'password' && typeof val === 'string') {
      val = val.replace(/<[^>]*>?/gm, ''); // Previene inyección HTML estructurada
    }
    onChange(val);
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-slate-400 uppercase tracking-wider">{label}{required && <span className="text-gold ml-1">*</span>}</label>
      {type === 'select'
        ? <select id={id} value={value} onChange={handleSanitizedChange} required={required} className={base}>
            <option value="">— Seleccionar —</option>
            {options?.map(o => <option key={o.value} value={o.value} className="bg-navy-900">{o.label}</option>)}
          </select>
        : <input id={id} type={type} value={value} onChange={handleSanitizedChange} required={required} placeholder={placeholder}
            className={base} />
      }
    </div>
  );
});

/* ─── Select (standalone dropdown control) ──────── */
export function Select({ label, value, onChange, options, placeholder = '— Todos —', compact = false }) {
  const base = compact
    ? "bg-navy-900/60 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all text-xs min-w-[140px]"
    : "w-full bg-navy-900/60 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all text-sm";
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</label>}
      <select value={value ?? ''} onChange={e => onChange(e.target.value)} className={base}>
        <option value="" className="bg-navy-900">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value} className="bg-navy-900">{o.label}</option>)}
      </select>
    </div>
  );
}

/* ─── Filter Bar ─────────────────────────────────── */
export function FilterBar({ filters, values, onChange, onReset }) {
  const hasActive = Object.values(values).some(v => v !== '' && v != null);
  return (
    <div className="flex flex-wrap items-end gap-3 bg-navy-900/40 border border-white/5 rounded-xl p-3">
      <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider pr-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
      </div>
      {filters.map(f => (
        <Select
          key={f.key}
          label={f.label}
          value={values[f.key] ?? ''}
          onChange={v => onChange({ ...values, [f.key]: v })}
          options={f.options}
          placeholder={f.placeholder ?? '— Todos —'}
          compact
        />
      ))}
      {hasActive && (
        <button
          onClick={onReset}
          className="text-xs px-3 py-1.5 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

/* ─── Data Table ─────────────────────────────────── */
export const DataTable = React.memo(function DataTable({ columns, data, onEdit, onDelete, searchable = true, pageSize = 10 }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(pageSize);

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(row => columns.some(c => {
      const raw = c.render ? c.render(row) : row[c.key];
      return String(raw ?? '').toLowerCase().includes(q);
    }));
  }, [search, data, columns]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const col = columns.find(c => c.key === sort.key);
    const getValue = (row) => col?.render ? col.render(row) : row[sort.key];
    return [...filtered].sort((a, b) => {
      const va = getValue(a), vb = getValue(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      const aNum = Number(va), bNum = Number(vb);
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && va !== '' && vb !== '') {
        return sort.dir === 'asc' ? aNum - bNum : bNum - aNum;
      }
      return sort.dir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [filtered, sort, columns]);

  // Reset page to 1 when search/sort/data/perPage signature changes — React's
  // documented "adjusting state during render" pattern keeps us out of effects.
  const signature = `${search}|${sort.key}|${sort.dir}|${data.length}|${perPage}`;
  const [lastSig, setLastSig] = useState(signature);
  if (lastSig !== signature) {
    setLastSig(signature);
    if (page !== 1) setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageData = sorted.slice((safePage - 1) * perPage, safePage * perPage);

  const toggleSort = (key) => {
    setSort(prev => {
      if (prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: 'asc' };
    });
  };

  const sortIcon = (key) => {
    if (sort.key !== key) return <span className="text-slate-700">↕</span>;
    return sort.dir === 'asc' ? <span className="text-accent-light">↑</span> : <span className="text-accent-light">↓</span>;
  };

  return (
    <div className="space-y-3">
      {searchable && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full sm:w-80 bg-navy-800/60 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent/60 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Mostrar</span>
            <select
              value={perPage}
              onChange={e => setPerPage(Number(e.target.value))}
              className="bg-navy-800/60 border border-white/10 rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-accent/60 text-xs"
            >
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>por página</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-800/80 border-b border-white/10">
              {columns.map(c => (
                <th
                  key={c.key}
                  onClick={() => c.sortable !== false && toggleSort(c.key)}
                  className={`px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap select-none ${c.sortable === false ? '' : 'cursor-pointer hover:text-white transition-colors'}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {c.label}
                    {c.sortable !== false && sortIcon(c.key)}
                  </span>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pageData.length === 0
              ? <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Sin resultados</span>
                  </div>
                </td></tr>
              : pageData.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-white/5 transition-colors">
                  {columns.map(c => (
                    <td key={c.key} className="px-4 py-3 text-slate-300 whitespace-nowrap">
                      {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button onClick={() => onEdit(row)} className="text-xs px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent-light border border-accent/20 rounded-lg transition-all">
                            Editar
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(row)} className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all">
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-600">
          {sorted.length === 0
            ? 'Sin registros'
            : `Mostrando ${(safePage - 1) * perPage + 1}–${Math.min(safePage * perPage, sorted.length)} de ${sorted.length} registro${sorted.length !== 1 ? 's' : ''}`
          }
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-2.5 py-1 text-xs border border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ←
            </button>
            <span className="text-xs text-slate-400 px-3 tabular-nums">Página {safePage} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-2.5 py-1 text-xs border border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────── */
export const StatCard = React.memo(function StatCard({ label, value, icon, color = 'accent', hint }) {
  const colors = {
    accent: 'bg-accent/10 border-accent/20 text-accent-light',
    gold: 'bg-gold/10 border-gold/20 text-gold',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
  };
  return (
    <div className="bg-navy-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-4 ${colors[color]}`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white font-serif mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      {hint && <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1.5">{hint}</div>}
    </div>
  );
}

/* ─── Skeleton Row ──────────────────────────────── */
export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 animate-pulse">
      <table className="w-full">
        <thead>
          <tr className="bg-navy-800/80 border-b border-white/10">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3"><div className="h-3 bg-white/5 rounded w-20" /></th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-4 py-3"><div className="h-3 bg-white/5 rounded" style={{ width: `${60 + Math.random() * 40}%` }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Collapsible Panel ──────────────────────────── */
export function Collapsible({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-navy-800/50 border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-3 text-white font-serif font-semibold text-base">
          {icon && <span className="text-lg">{icon}</span>}
          {title}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  );
}

/* ─── Tabs ───────────────────────────────────────── */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="border-b border-white/10">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all
              ${active === t.id
                ? 'text-accent-light border-accent'
                : 'text-slate-500 hover:text-slate-300 border-transparent'}`}
          >
            {t.icon && <span className="mr-2">{t.icon}</span>}
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Bar Chart (tiny inline SVG) ─────────────────── */
export function BarChart({ data, color = '#6366f1', height = 180 }) {
  const max = Math.max(1, ...data.map(d => d.value));
  if (data.length === 0) return <div className="text-slate-500 text-sm p-4">Sin datos</div>;
  return (
    <div className="w-full">
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const h = max > 0 ? (d.value / max) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end min-w-0 group">
              <div className="text-[10px] text-slate-400 mb-1 tabular-nums">{d.value}</div>
              <div
                className="w-full rounded-t-md transition-all group-hover:opacity-90"
                style={{ height: `${h}%`, backgroundColor: color, minHeight: d.value > 0 ? 4 : 0 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-[10px] text-center text-slate-500 truncate px-0.5" title={d.label}>{d.label}</div>
        ))}
      </div>
    </div>
  );
}

/* ─── Dropdown Menu (used inside pages) ──────────── */
export function DropdownMenu({ trigger, items, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const click = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5">
        {trigger}
      </button>
      {open && (
        <div className={`absolute z-30 mt-2 min-w-[180px] bg-navy-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in ${align === 'right' ? 'right-0' : 'left-0'}`}>
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => { it.onClick?.(); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 ${it.danger ? 'text-red-400 hover:text-red-300' : 'text-slate-300'}`}
            >
              {it.icon && <span>{it.icon}</span>}
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
