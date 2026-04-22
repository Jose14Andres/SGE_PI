import { useMemo, useState } from 'react';
import { StatCard, DataTable, FilterBar, BarChart, Tabs, Select, Collapsible } from './UI.jsx';

/* ────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────── */
const uniq = (arr) => [...new Set(arr.filter(Boolean))];
const asOpt = (v) => ({ value: v, label: v });

/* ────────────────────────────────────────────────
   Admin Dashboard (dinámico, con filtros)
──────────────────────────────────────────────── */
export function AdminDashboard({ alumnos, profesores, cursos, materias }) {
  const [filter, setFilter] = useState({ carrera: '', nivel: '' });

  const carrerasOpts = uniq(cursos.map(c => c.carrera)).map(asOpt);
  const nivelesOpts  = uniq(cursos.map(c => c.nivel)).map(asOpt);

  const filters = [
    { key: 'carrera', label: 'Carrera', options: carrerasOpts },
    { key: 'nivel',   label: 'Nivel',   options: nivelesOpts },
  ];

  // Cursos filtrados por selección
  const cursosFiltrados = useMemo(() => cursos.filter(c =>
    (!filter.carrera || c.carrera === filter.carrera) &&
    (!filter.nivel   || c.nivel   === filter.nivel)
  ), [cursos, filter]);
  const cursosIdsFiltrados = new Set(cursosFiltrados.map(c => c.id));
  const alumnosFiltrados = alumnos.filter(a => cursosIdsFiltrados.has(a.cursoId));
  const materiasFiltradas = materias.filter(m => cursosIdsFiltrados.has(m.cursoId));

  // Charts
  const alumnosPorCarrera = useMemo(() => {
    const counts = {};
    alumnos.forEach(a => {
      const c = cursos.find(x => x.id === a.cursoId);
      if (!c) return;
      counts[c.carrera] = (counts[c.carrera] ?? 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [alumnos, cursos]);

  const materiasPorCarrera = useMemo(() => {
    const counts = {};
    materias.forEach(m => {
      const c = cursos.find(x => x.id === m.cursoId);
      if (!c) return;
      counts[c.carrera] = (counts[c.carrera] ?? 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [materias, cursos]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Panel general del SGE — vista administrativa</p>
      </div>

      <FilterBar
        filters={filters}
        values={filter}
        onChange={setFilter}
        onReset={() => setFilter({ carrera: '', nivel: '' })}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Alumnos"    value={alumnosFiltrados.length}  icon="🎓" color="accent"  hint={filter.carrera || filter.nivel ? 'filtrado' : 'total'} />
        <StatCard label="Profesores" value={profesores.length}        icon="👨‍🏫" color="emerald" />
        <StatCard label="Secciones"  value={cursosFiltrados.length}   icon="📚" color="gold"    hint={filter.carrera || filter.nivel ? 'filtrado' : 'total'} />
        <StatCard label="Materias"   value={materiasFiltradas.length} icon="📋" color="violet"  hint={filter.carrera || filter.nivel ? 'filtrado' : 'total'} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Collapsible title="Alumnos por Carrera" icon="📊">
          <BarChart data={alumnosPorCarrera} color="#6366f1" />
        </Collapsible>
        <Collapsible title="Materias por Carrera" icon="📘">
          <BarChart data={materiasPorCarrera} color="#f59e0b" />
        </Collapsible>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Collapsible title="Últimos Alumnos Registrados" icon="🆕">
          <div className="space-y-2">
            {alumnos.slice(-5).reverse().map(a => {
              const c = cursos.find(x => x.id === a.cursoId);
              return (
                <div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent-light">
                    {a.nombre[0]}{a.apellido[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-200 truncate">{a.nombre} {a.apellido}</div>
                    <div className="text-xs text-slate-500 truncate">{a.email}</div>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{c?.carrera} · {c?.nivel}</span>
                </div>
              );
            })}
          </div>
        </Collapsible>

        <Collapsible title="Secciones Activas (filtradas)" icon="📚">
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {cursosFiltrados.length === 0
              ? <p className="text-slate-500 text-sm">No hay secciones con esos filtros.</p>
              : cursosFiltrados.slice(0, 10).map(c => {
                  const count = alumnos.filter(a => a.cursoId === c.id).length;
                  return (
                    <div key={c.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-slate-200 truncate">{c.nombre}</div>
                        <div className="text-xs text-slate-500">{c.anioLectivo}</div>
                      </div>
                      <span className="text-xs bg-accent/10 text-accent-light border border-accent/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {count} alumno{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })
            }
            {cursosFiltrados.length > 10 && (
              <p className="text-xs text-slate-500 pt-2 text-center">+ {cursosFiltrados.length - 10} secciones más…</p>
            )}
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Secretary Dashboard (vista consulta)
──────────────────────────────────────────────── */
export function SecretaryDashboard({ alumnos, profesores, cursos, materias }) {
  const [filter, setFilter] = useState({ carrera: '', nivel: '' });
  const carrerasOpts = uniq(cursos.map(c => c.carrera)).map(asOpt);
  const nivelesOpts  = uniq(cursos.map(c => c.nivel)).map(asOpt);
  const filters = [
    { key: 'carrera', label: 'Carrera', options: carrerasOpts },
    { key: 'nivel',   label: 'Nivel',   options: nivelesOpts },
  ];

  const cursosFilt = cursos.filter(c =>
    (!filter.carrera || c.carrera === filter.carrera) &&
    (!filter.nivel   || c.nivel   === filter.nivel)
  );
  const cursosIds = new Set(cursosFilt.map(c => c.id));
  const alumnosFilt = alumnos.filter(a => cursosIds.has(a.cursoId));
  const materiasFilt = materias.filter(m => cursosIds.has(m.cursoId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Dashboard — Secretaría</h1>
        <p className="text-slate-400 text-sm mt-1">Resumen de consulta del sistema</p>
      </div>

      <FilterBar
        filters={filters}
        values={filter}
        onChange={setFilter}
        onReset={() => setFilter({ carrera: '', nivel: '' })}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Alumnos"    value={alumnosFilt.length}  icon="🎓" color="accent"  hint="según filtros" />
        <StatCard label="Profesores" value={profesores.length}   icon="👨‍🏫" color="emerald" />
        <StatCard label="Secciones"  value={cursosFilt.length}   icon="📚" color="gold"    hint="según filtros" />
        <StatCard label="Materias"   value={materiasFilt.length} icon="📋" color="violet"  hint="según filtros" />
      </div>

      <Collapsible title="Secciones visibles" icon="📚">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {cursosFilt.slice(0, 30).map(c => {
            const count = alumnos.filter(a => a.cursoId === c.id).length;
            const mats  = materias.filter(m => m.cursoId === c.id).length;
            return (
              <div key={c.id} className="bg-navy-900/40 border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all">
                <div className="text-sm text-white font-medium">{c.carrera}</div>
                <div className="text-xs text-slate-400 mt-0.5">{c.nivel} · Sección {c.paralelo}</div>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] bg-accent/10 text-accent-light px-2 py-0.5 rounded-full border border-accent/20">{count} alumno{count !== 1 ? 's' : ''}</span>
                  <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full border border-gold/20">{mats} materia{mats !== 1 ? 's' : ''}</span>
                </div>
              </div>
            );
          })}
          {cursosFilt.length === 0 && <p className="text-slate-500 text-sm">No hay secciones con esos filtros.</p>}
        </div>
      </Collapsible>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Profesor Dashboard (con dropdown de curso)
──────────────────────────────────────────────── */
export function ProfesorDashboard({ user, materias, cursos, alumnos }) {
  const misMaterias = materias.filter(m => m.profesorId === user.profesorId);
  const misCursoIds = [...new Set(misMaterias.map(m => m.cursoId))];
  const misCursos = cursos.filter(c => misCursoIds.includes(c.id));
  const todosMisAlumnos = alumnos.filter(a => misCursoIds.includes(a.cursoId));

  const [selectedCurso, setSelectedCurso] = useState('');

  const cursoElegido = cursos.find(c => c.id === selectedCurso);
  const materiasDelCurso = selectedCurso
    ? misMaterias.filter(m => m.cursoId === selectedCurso)
    : misMaterias;
  const alumnosDelCurso = selectedCurso
    ? alumnos.filter(a => a.cursoId === selectedCurso)
    : todosMisAlumnos;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Mi Panel</h1>
        <p className="text-slate-400 text-sm mt-1">Hola, {user.nombre} {user.apellido} — {user.email}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Mis Materias" value={misMaterias.length}     icon="📋" color="accent" />
        <StatCard label="Mis Secciones" value={misCursoIds.length}    icon="📚" color="gold" />
        <StatCard label="Mis Alumnos" value={todosMisAlumnos.length}  icon="🎓" color="emerald" />
      </div>

      <div className="bg-navy-900/40 border border-white/5 rounded-xl p-3 flex flex-wrap items-end gap-3">
        <div className="text-xs text-slate-500 uppercase tracking-wider pr-2 flex items-center gap-2">
          <span>📚</span> Filtrar por sección
        </div>
        <Select
          value={selectedCurso}
          onChange={setSelectedCurso}
          options={misCursos.map(c => ({ value: c.id, label: c.nombre }))}
          placeholder="— Todas mis secciones —"
          compact
        />
        {selectedCurso && (
          <button onClick={() => setSelectedCurso('')} className="text-xs px-3 py-1.5 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg">
            Limpiar
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Collapsible title={cursoElegido ? `Materias en ${cursoElegido.nombre}` : 'Mis Materias Asignadas'} icon="📋">
          {materiasDelCurso.length === 0
            ? <p className="text-slate-500 text-sm">No tienes materias asignadas aún.</p>
            : <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {materiasDelCurso.map(m => {
                  const curso = cursos.find(c => c.id === m.cursoId);
                  return (
                    <div key={m.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-slate-200 font-medium truncate">{m.nombre}</div>
                        <div className="text-xs text-slate-500 truncate">{curso?.nombre}</div>
                      </div>
                      <span className="text-xs text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full whitespace-nowrap">{m.creditos} créditos</span>
                    </div>
                  );
                })}
              </div>
          }
        </Collapsible>

        <Collapsible title={cursoElegido ? `Alumnos de ${cursoElegido.nombre}` : 'Mis Alumnos'} icon="🎓">
          {alumnosDelCurso.length === 0
            ? <p className="text-slate-500 text-sm">No hay alumnos que mostrar.</p>
            : <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {alumnosDelCurso.slice(0, 12).map(a => {
                  const c = cursos.find(x => x.id === a.cursoId);
                  return (
                    <div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-semibold text-emerald-300">
                        {a.nombre[0]}{a.apellido[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-200 truncate">{a.nombre} {a.apellido}</div>
                        <div className="text-xs text-slate-500 truncate">{a.email}</div>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">{c?.carrera} · {c?.nivel}</span>
                    </div>
                  );
                })}
                {alumnosDelCurso.length > 12 && (
                  <p className="text-xs text-slate-500 pt-2 text-center">+ {alumnosDelCurso.length - 12} alumnos más…</p>
                )}
              </div>
          }
        </Collapsible>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Alumno Dashboard (con tabs: Perfil / Materias / Horario)
──────────────────────────────────────────────── */
export function AlumnoDashboard({ user, alumnos, cursos, materias, profesores }) {
  const alumno = alumnos.find(a => a.email === user.email);
  const seccion = cursos.find(c => c.id === alumno?.cursoId);
  const myMaterias = materias.filter(m => m.cursoId === alumno?.cursoId);

  const [tab, setTab] = useState('resumen');

  const tabs = [
    { id: 'resumen',  label: 'Resumen',    icon: '📋' },
    { id: 'materias', label: 'Mis Materias', icon: '📚' },
    { id: 'horario',  label: 'Mi Horario', icon: '📅' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Mi Perfil Académico</h1>
          <p className="text-slate-400 text-sm mt-1">Hola, {user.nombre} {user.apellido}</p>
        </div>
        {seccion && (
          <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent-light px-4 py-1.5 rounded-full text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-accent-light"></span>
            {seccion.carrera} · {seccion.nivel} · Sección {seccion.paralelo}
          </span>
        )}
      </div>

      {seccion && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Carrera"  value={seccion.carrera}             icon="🎓" color="accent" />
          <StatCard label="Nivel"    value={seccion.nivel}               icon="📊" color="gold" />
          <StatCard label="Sección"  value={`Sección ${seccion.paralelo}`} icon="🏫" color="emerald" />
          <StatCard label="Materias" value={myMaterias.length}           icon="📋" color="violet" />
        </div>
      )}

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'resumen' && (
        <div className="grid md:grid-cols-2 gap-5 animate-fade-in">
          <div className="bg-navy-800/60 border border-white/10 rounded-2xl p-5">
            <h2 className="font-serif text-base font-semibold text-white mb-4">Información Personal</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex gap-2"><dt className="text-slate-500 w-28 shrink-0">Nombre:</dt><dd className="text-slate-200">{alumno?.nombre} {alumno?.apellido}</dd></div>
              <div className="flex gap-2"><dt className="text-slate-500 w-28 shrink-0">Email:</dt><dd className="text-slate-200 break-all">{alumno?.email}</dd></div>
              <div className="flex gap-2"><dt className="text-slate-500 w-28 shrink-0">F. Nacimiento:</dt><dd className="text-slate-200">{alumno?.fechaNacimiento || '—'}</dd></div>
            </dl>
          </div>
          <div className="bg-navy-800/60 border border-white/10 rounded-2xl p-5">
            <h2 className="font-serif text-base font-semibold text-white mb-4">Inscripción Académica</h2>
            {seccion
              ? <dl className="space-y-3 text-sm">
                  <div className="flex gap-2"><dt className="text-slate-500 w-28 shrink-0">Carrera:</dt><dd className="text-slate-200 font-semibold">{seccion.carrera}</dd></div>
                  <div className="flex gap-2"><dt className="text-slate-500 w-28 shrink-0">Nivel:</dt><dd className="text-slate-200">{seccion.nivel}</dd></div>
                  <div className="flex gap-2"><dt className="text-slate-500 w-28 shrink-0">Sección:</dt><dd className="text-slate-200">Sección {seccion.paralelo}</dd></div>
                  <div className="flex gap-2"><dt className="text-slate-500 w-28 shrink-0">Período:</dt><dd className="text-slate-200">{seccion.anioLectivo}</dd></div>
                </dl>
              : <p className="text-slate-500 text-sm">No asignado a ninguna sección.</p>
            }
          </div>
        </div>
      )}

      {tab === 'materias' && (
        <div className="animate-fade-in">
          <AlumnoMisMaterias user={user} alumnos={alumnos} materias={materias} profesores={profesores} cursos={cursos} compact />
        </div>
      )}

      {tab === 'horario' && (
        <div className="animate-fade-in">
          <AlumnoHorario user={user} alumnos={alumnos} materias={materias} profesores={profesores} cursos={cursos} />
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────
   Profesor: Mis Materias (con filtros)
──────────────────────────────────────────────── */
export function ProfesorMisMaterias({ user, materias, cursos }) {
  const misMaterias = useMemo(() => materias.filter(m => m.profesorId === user.profesorId), [materias, user]);
  const misCursoIds = [...new Set(misMaterias.map(m => m.cursoId))];
  const misCursos = cursos.filter(c => misCursoIds.includes(c.id));

  const [filter, setFilter] = useState({ carrera: '', nivel: '', cursoId: '' });
  const carrerasOpts = uniq(misCursos.map(c => c.carrera)).map(asOpt);
  const nivelesOpts  = uniq(misCursos.map(c => c.nivel)).map(asOpt);
  const cursoOpts    = misCursos.map(c => ({ value: c.id, label: c.nombre }));

  const filters = [
    { key: 'carrera', label: 'Carrera',  options: carrerasOpts },
    { key: 'nivel',   label: 'Nivel',    options: nivelesOpts },
    { key: 'cursoId', label: 'Sección',  options: cursoOpts },
  ];

  const filtered = misMaterias.filter(m => {
    const c = cursos.find(x => x.id === m.cursoId);
    if (filter.carrera && c?.carrera !== filter.carrera) return false;
    if (filter.nivel   && c?.nivel   !== filter.nivel)   return false;
    if (filter.cursoId && m.cursoId  !== filter.cursoId) return false;
    return true;
  });

  const cols = [
    { key: 'nombre',   label: 'Materia' },
    { key: 'codigo',   label: 'Código' },
    { key: 'creditos', label: 'Créditos' },
    { key: 'carrera',  label: 'Carrera', render: r => cursos.find(c => c.id === r.cursoId)?.carrera ?? '—' },
    { key: 'nivel',    label: 'Nivel',   render: r => cursos.find(c => c.id === r.cursoId)?.nivel ?? '—' },
    { key: 'paralelo', label: 'Sección', render: r => cursos.find(c => c.id === r.cursoId)?.paralelo ?? '—' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Mis Materias</h1>
        <p className="text-slate-400 text-sm mt-1">{filtered.length} de {misMaterias.length} materia{misMaterias.length !== 1 ? 's' : ''}</p>
      </div>
      <FilterBar filters={filters} values={filter} onChange={setFilter} onReset={() => setFilter({ carrera: '', nivel: '', cursoId: '' })} />
      <DataTable columns={cols} data={filtered} />
    </div>
  );
}

/* ────────────────────────────────────────────────
   Profesor: Mis Alumnos (con filtros por curso y materia)
──────────────────────────────────────────────── */
export function ProfesorMisAlumnos({ user, materias, alumnos, cursos }) {
  const misMaterias = materias.filter(m => m.profesorId === user.profesorId);
  const misCursoIds = [...new Set(misMaterias.map(m => m.cursoId))];
  const misCursos = cursos.filter(c => misCursoIds.includes(c.id));
  const misAlumnos = alumnos.filter(a => misCursoIds.includes(a.cursoId));

  const [filter, setFilter] = useState({ carrera: '', nivel: '', cursoId: '' });
  const carrerasOpts = uniq(misCursos.map(c => c.carrera)).map(asOpt);
  const nivelesOpts  = uniq(misCursos.map(c => c.nivel)).map(asOpt);
  const cursoOpts    = misCursos.map(c => ({ value: c.id, label: c.nombre }));

  const filters = [
    { key: 'carrera', label: 'Carrera', options: carrerasOpts },
    { key: 'nivel',   label: 'Nivel',   options: nivelesOpts },
    { key: 'cursoId', label: 'Sección', options: cursoOpts },
  ];

  const filtered = misAlumnos.filter(a => {
    const c = cursos.find(x => x.id === a.cursoId);
    if (filter.carrera && c?.carrera !== filter.carrera) return false;
    if (filter.nivel   && c?.nivel   !== filter.nivel)   return false;
    if (filter.cursoId && a.cursoId  !== filter.cursoId) return false;
    return true;
  });

  const cols = [
    { key: 'nombre',   label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'email',    label: 'Email' },
    { key: 'carrera',  label: 'Carrera', render: r => cursos.find(c => c.id === r.cursoId)?.carrera ?? '—' },
    { key: 'nivel',    label: 'Nivel',   render: r => cursos.find(c => c.id === r.cursoId)?.nivel ?? '—' },
    { key: 'paralelo', label: 'Sección', render: r => cursos.find(c => c.id === r.cursoId)?.paralelo ?? '—' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Mis Alumnos</h1>
        <p className="text-slate-400 text-sm mt-1">{filtered.length} de {misAlumnos.length} alumno{misAlumnos.length !== 1 ? 's' : ''}</p>
      </div>
      <FilterBar filters={filters} values={filter} onChange={setFilter} onReset={() => setFilter({ carrera: '', nivel: '', cursoId: '' })} />
      <DataTable columns={cols} data={filtered} />
    </div>
  );
}

/* ────────────────────────────────────────────────
   Alumno: Mis Materias
──────────────────────────────────────────────── */
export function AlumnoMisMaterias({ user, alumnos, materias, profesores, compact = false }) {
  const alumno = alumnos.find(a => a.email === user.email);
  const myMaterias = materias.filter(m => m.cursoId === alumno?.cursoId);

  const [filter, setFilter] = useState({ profesorId: '' });
  const profOpts = uniq(myMaterias.map(m => m.profesorId))
    .map(id => profesores.find(p => p.id === id))
    .filter(Boolean)
    .map(p => ({ value: p.id, label: `${p.nombre} ${p.apellido}` }));

  const filters = [
    { key: 'profesorId', label: 'Profesor', options: profOpts },
  ];

  const filtered = myMaterias.filter(m => !filter.profesorId || m.profesorId === filter.profesorId);

  const cols = [
    { key: 'nombre',   label: 'Materia' },
    { key: 'codigo',   label: 'Código' },
    { key: 'creditos', label: 'Créditos' },
    {
      key: 'profesorId', label: 'Profesor',
      render: r => { const p = profesores.find(x => x.id === r.profesorId); return p ? `${p.nombre} ${p.apellido}` : '—'; },
    },
  ];

  return (
    <div className="space-y-5">
      {!compact && <h1 className="font-serif text-2xl font-bold text-white">Mis Materias</h1>}
      {profOpts.length > 1 && (
        <FilterBar filters={filters} values={filter} onChange={setFilter} onReset={() => setFilter({ profesorId: '' })} />
      )}
      <DataTable columns={cols} data={filtered} />
    </div>
  );
}

/* ────────────────────────────────────────────────
   Alumno: Mi Horario (dinámico desde sus materias)
──────────────────────────────────────────────── */
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const TIME_SLOTS = ['07:00 – 08:30', '08:45 – 10:15', '10:30 – 12:00', '13:00 – 14:30', '14:45 – 16:15'];

// Distribuye materias en días / slots de forma determinística
function buildSchedule(materias) {
  const grid = {};
  DAYS.forEach(d => { grid[d] = Array(TIME_SLOTS.length).fill(null); });
  if (!materias || materias.length === 0) return grid;

  // Cada materia ocupa 2 sesiones por semana (dos bloques distintos) para simular horario
  let pos = 0;
  const totalSlots = DAYS.length * TIME_SLOTS.length;
  materias.forEach((m) => {
    for (let s = 0; s < 2; s++) {
      // saltamos slots ocupados
      let tries = 0;
      while (tries < totalSlots) {
        const d = DAYS[pos % DAYS.length];
        const t = Math.floor(pos / DAYS.length) % TIME_SLOTS.length;
        pos = (pos + 1) % totalSlots;
        if (!grid[d][t]) { grid[d][t] = m; break; }
        tries++;
      }
    }
    // separa las ocurrencias de distintas materias
    pos = (pos + 3) % totalSlots;
  });
  return grid;
}

export function AlumnoHorario({ user, alumnos, materias, profesores, cursos }) {
  const alumno = alumnos?.find(a => a.email === user.email);
  const seccion = cursos?.find(c => c.id === alumno?.cursoId);
  const myMaterias = useMemo(
    () => materias?.filter(m => m.cursoId === alumno?.cursoId) ?? [],
    [materias, alumno?.cursoId]
  );

  const [view, setView] = useState('semanal');
  const [diaFiltro, setDiaFiltro] = useState('');

  const grid = useMemo(() => buildSchedule(myMaterias), [myMaterias]);

  const diasOpts = DAYS.map(asOpt);

  if (!alumno) {
    return <div className="text-slate-500">No se encontró información del alumno.</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Mi Horario Semanal</h1>
          <p className="text-slate-400 text-sm mt-1">
            {seccion ? `${seccion.carrera} · ${seccion.nivel} · Sección ${seccion.paralelo}` : 'Sin sección asignada'}
          </p>
        </div>
        <div className="flex items-end gap-3">
          <Select
            label="Vista"
            value={view}
            onChange={setView}
            options={[{ value: 'semanal', label: 'Semanal' }, { value: 'diaria', label: 'Por día' }]}
            placeholder="Semanal"
            compact
          />
          {view === 'diaria' && (
            <Select
              label="Día"
              value={diaFiltro}
              onChange={setDiaFiltro}
              options={diasOpts}
              placeholder="— Seleccionar —"
              compact
            />
          )}
        </div>
      </div>

      {myMaterias.length === 0 ? (
        <div className="bg-navy-800/50 border border-white/10 rounded-2xl p-8 text-center text-slate-500 text-sm">
          No tienes materias asignadas — el horario aparecerá cuando estés inscrito en una sección con materias.
        </div>
      ) : view === 'semanal' ? (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-800/80 border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-32">Hora</th>
                {DAYS.map(d => (
                  <th key={d} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {TIME_SLOTS.map((slot, i) => (
                <tr key={slot} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">{slot}</td>
                  {DAYS.map(d => {
                    const m = grid[d][i];
                    return (
                      <td key={d} className="px-4 py-3 align-top">
                        {m
                          ? <div className="bg-accent/10 border border-accent/20 rounded-lg px-3 py-2 min-w-[140px]">
                              <div className="text-accent-light text-xs font-semibold truncate">{m.nombre}</div>
                              <div className="text-[10px] text-slate-500 truncate">{m.codigo}</div>
                              {profesores && (() => {
                                const p = profesores.find(x => x.id === m.profesorId);
                                return p ? <div className="text-[10px] text-slate-400 mt-1 truncate">Prof. {p.apellido}</div> : null;
                              })()}
                            </div>
                          : <span className="text-slate-700 text-xs">—</span>
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          {(diaFiltro ? [diaFiltro] : DAYS).map(d => (
            <div key={d} className="bg-navy-800/50 border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">{d}</h3>
              <div className="space-y-2">
                {grid[d].map((m, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-xs text-slate-500 font-mono w-28 shrink-0">{TIME_SLOTS[i]}</span>
                    {m
                      ? <div className="flex-1 bg-accent/10 border border-accent/20 rounded-lg px-3 py-1.5">
                          <span className="text-accent-light text-xs font-medium">{m.nombre}</span>
                          <span className="text-[10px] text-slate-500 ml-2">{m.codigo}</span>
                        </div>
                      : <span className="text-slate-700 text-xs">— libre —</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
