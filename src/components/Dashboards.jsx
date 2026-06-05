import { useMemo, useState, lazy, Suspense } from 'react';
import { StatCard, DataTable, FilterBar, Tabs, Select, Collapsible } from './UI.jsx';

const BarChart3D = lazy(() => import('./3D/BarChart3D.jsx'));

/* ────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────── */
const uniq = (arr) => [...new Set(arr.filter(Boolean))];
const asOpt = (v) => ({ value: v, label: v });

/* ────────────────────────────────────────────────
   Admin Dashboard (dinámico, con filtros)
──────────────────────────────────────────────── */
export function AdminDashboard({ alumnos, profesores, cursos }) {
  const [filter, setFilter] = useState({ rol: '', carrera: '' });
  const [activeTab, setActiveTab] = useState('usuarios');

  const carrerasOpts = uniq(cursos.map(c => c.carrera)).map(asOpt);

  const filters = [
    { key: 'rol', label: 'Rol', options: [asOpt('Alumno'), asOpt('Profesor')] },
    { key: 'carrera', label: 'Carrera', options: carrerasOpts },
  ];

  // Consolidar todos los usuarios
  const todosLosUsuarios = useMemo(() => {
    const cursosById = Object.fromEntries(cursos.map(c => [c.id, c]));
    const arr = [];
    alumnos.forEach(a => {
      const c = cursosById[a.cursoId];
      arr.push({ ...a, rol: 'Alumno', carrera: c?.carrera || '—', nivel: c?.nivel || '—' });
    });
    profesores.forEach(p => {
      arr.push({ ...p, rol: 'Profesor', carrera: '—', nivel: '—' });
    });
    return arr;
  }, [alumnos, profesores, cursos]);

  // Filtrar
  const usuariosFiltrados = useMemo(() => {
    return todosLosUsuarios.filter(u => {
      if (filter.rol && u.rol !== filter.rol) return false;
      if (filter.carrera && u.carrera !== filter.carrera) return false;
      return true;
    });
  }, [todosLosUsuarios, filter]);

  const columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'email', label: 'Email' },
    {
      key: 'rol',
      label: 'Rol',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${r.rol === 'Profesor' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-[#0052CC]/10 text-[#00E5FF] border-[#00E5FF]/20'}`}>
          {r.rol}
        </span>
      )
    },
    { key: 'carrera', label: 'Carrera' },
    {
      key: 'actions',
      label: 'Acciones',
      render: () => (
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 bg-[#0052CC]/20 text-[#00E5FF] rounded hover:bg-[#0052CC]/40 transition-colors">Editar</button>
          <button className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/40 transition-colors">Baja</button>
        </div>
      )
    }
  ];

  const tabs = [
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: '👥' },
    { id: 'auditoria', label: 'Logs de Auditoría', icon: '📝' },
    { id: 'sistema', label: 'Estado del Sistema', icon: '⚙️' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#F4F6F9]">Consola de Control del Sistema</h1>
        <p className="text-slate-400 text-sm mt-1">Panel Administrativo SGE_PI</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Estudiantes Activos" value={alumnos.length} icon="🎓" color="accent" />
        <StatCard label="Personal Docente" value={profesores.length} icon="👨‍🏫" color="emerald" />
        <StatCard label="Estado Servidores" value="Estable" icon="🟢" color="emerald" hint="Docker OK" />
        <StatCard label="Alertas de Seguridad" value="0" icon="🛡️" color="gold" hint="Sin reportes" />
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'usuarios' && (
        <div className="space-y-4 animate-fade-in">
          <FilterBar
            filters={filters}
            values={filter}
            onChange={setFilter}
            onReset={() => setFilter({ rol: '', carrera: '' })}
          />

          <div className="bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-[#F4F6F9]">Directorio Central</h2>
              <button className="bg-[#0052CC] text-[#F4F6F9] px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-colors shadow-lg shadow-[#00E5FF]/20">
                + Nuevo Usuario
              </button>
            </div>
            <DataTable columns={columnas} data={usuariosFiltrados} pageSize={10} />
          </div>
        </div>
      )}

      {activeTab === 'auditoria' && (
        <div className="animate-fade-in bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center backdrop-blur-sm">
           <div className="text-4xl mb-4">📝</div>
           <h3 className="text-[#F4F6F9] font-medium mb-1">Módulo de Auditoría en construcción</h3>
           <p className="text-slate-500 text-sm">Visualice el registro de altas, bajas y modificaciones.</p>
        </div>
      )}

      {activeTab === 'sistema' && (
        <div className="animate-fade-in bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center backdrop-blur-sm">
           <div className="text-4xl mb-4">⚙️</div>
           <h3 className="text-[#F4F6F9] font-medium mb-1">Módulo de Sistema en construcción</h3>
           <p className="text-slate-500 text-sm">Monitoreo de rendimiento, memoria y conectividad base de datos.</p>
        </div>
      )}
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

  const coursesFilt = cursos.filter(c =>
    (!filter.carrera || c.carrera === filter.carrera) &&
    (!filter.nivel   || c.nivel   === filter.nivel)
  );
  const cursosIds = new Set(coursesFilt.map(c => c.id));
  const alumnosFilt = alumnos.filter(a => cursosIds.has(a.cursoId));
  const materiasFilt = materias.filter(m => cursosIds.has(m.cursoId));

  // ⚡ Bolt: O(n) pre-calculation of counts to avoid N+1 filters during render
  const alumnosByCurso = useMemo(() => alumnos.reduce((acc, a) => {
    acc[a.cursoId] = (acc[a.cursoId] || 0) + 1;
    return acc;
  }, {}), [alumnos]);

  const materiasByCurso = useMemo(() => materias.reduce((acc, m) => {
    acc[m.cursoId] = (acc[m.cursoId] || 0) + 1;
    return acc;
  }, {}), [materias]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#F4F6F9]">Dashboard — Secretaría</h1>
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
        <StatCard label="Secciones"  value={coursesFilt.length}   icon="📚" color="gold"    hint="según filtros" />
        <StatCard label="Materias"   value={materiasFilt.length} icon="📋" color="violet"  hint="según filtros" />
      </div>

      <Collapsible title="Secciones visibles" icon="📚">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {coursesFilt.slice(0, 30).map(c => {
            const count = alumnosByCurso[c.id] || 0;
            const mats  = materiasByCurso[c.id] || 0;
            return (
              <div key={c.id} className="bg-[#0B132B] border border-[#E2E8F0]/10 rounded-xl p-3 hover:border-[#E2E8F0]/20 transition-all">
                <div className="text-sm text-[#F4F6F9] font-medium">{c.carrera}</div>
                <div className="text-xs text-slate-400 mt-0.5">{c.nivel} · Sección {c.paralelo}</div>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] bg-[#0052CC]/10 text-[#00E5FF] px-2 py-0.5 rounded-full border border-[#00E5FF]/20">{count} alumno{count !== 1 ? 's' : ''}</span>
                  <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full border border-gold/20">{mats} materia{mats !== 1 ? 's' : ''}</span>
                </div>
              </div>
            );
          })}
          {coursesFilt.length === 0 && <p className="text-slate-500 text-sm">No hay secciones con esos filtros.</p>}
        </div>
      </Collapsible>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Profesor Dashboard (con dropdown de curso)
──────────────────────────────────────────────── */
export function ProfesorDashboard({ user, materias, alumnos }) {
  // ⚡ Performance optimization: Memoize O(N) lookup for static prop references.
  // Helps prevent expensive recalculation on every render (e.g. tab changes).

  const { misMaterias, todosMisAlumnos } = useMemo(() => {
    const mMaterias = materias.filter(m => m.profesorId === user.profesorId);
    const misCursoIdsSet = new Set(mMaterias.map(m => m.cursoId));
    const todosAlumnos = alumnos.filter(a => misCursoIdsSet.has(a.cursoId));
    return { misMaterias: mMaterias, todosMisAlumnos: todosAlumnos };
  }, [materias, alumnos, user.profesorId]);

  const [activeTab, setActiveTab] = useState('calificaciones');
  const [selectedMateria, setSelectedMateria] = useState(misMaterias[0]?.id || '');

  // Optimization: O(1) map lookup instead of multiple .find() calls
  const materiasById = useMemo(() => Object.fromEntries(misMaterias.map(m => [m.id, m])), [misMaterias]);

  const { materiaElegida, alumnosDelCurso } = useMemo(() => {
    const materia = materiasById[selectedMateria];
    const delCurso = materia ? alumnos.filter(a => a.cursoId === materia.cursoId) : todosMisAlumnos;
    return { materiaElegida: materia, alumnosDelCurso: delCurso };
  }, [materiasById, selectedMateria, alumnos, todosMisAlumnos]);

  const tabs = [
    { id: 'horarios', label: 'Mis Horarios', icon: '📅' },
    { id: 'asistencia', label: 'Control de Asistencia', icon: '✅' },
    { id: 'calificaciones', label: 'Registro de Calificaciones', icon: '📝' },
  ];

  const colCalificaciones = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'email', label: 'Email' },
    {
      key: 'actions',
      label: 'Acciones',
      render: () => (
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 bg-[#0052CC]/20 text-[#00E5FF] rounded hover:bg-[#0052CC]/40 transition-colors">Editar Nota</button>
          <button className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/40 transition-colors">Reportar Falta</button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#F4F6F9]">Panel de Gestión de Clases</h1>
        <p className="text-slate-400 text-sm mt-1">Prof. {user.nombre} {user.apellido}</p>
      </div>

      {/* Sección Superior: StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Clases del Día" value="3" icon="📅" color="accent" hint="Hoy" />
        <StatCard label="Alumnos a cargo" value={todosMisAlumnos.length} icon="🎓" color="emerald" hint="Total" />
        <StatCard label="Tareas por Calificar" value="12" icon="📝" color="gold" hint="Pendientes" />
        <StatCard label="Alertas" value="2" icon="⚠️" color="red" hint="Alumnos en riesgo" />
      </div>

      {/* Cuerpo Principal */}
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="bg-[#0B132B] border border-[#E2E8F0]/10 rounded-xl p-3 flex flex-wrap items-end gap-3">
        <div className="text-xs text-slate-500 uppercase tracking-wider pr-2 flex items-center gap-2">
          <span>📚</span> Seleccionar Materia
        </div>
        <Select
          value={selectedMateria}
          onChange={setSelectedMateria}
          options={misMaterias.map(m => ({ value: m.id, label: m.nombre }))}
          placeholder="— Seleccione materia —"
          compact
        />
      </div>

      {activeTab === 'calificaciones' && (
        <div className="animate-fade-in bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-5 backdrop-blur-sm">
          <h2 className="font-serif text-lg font-semibold text-[#F4F6F9] mb-4">
            Alumnos {materiaElegida ? `de ${materiaElegida.nombre}` : ''}
          </h2>
          {alumnosDelCurso.length > 0 ? (
            <DataTable columns={colCalificaciones} data={alumnosDelCurso} pageSize={10} />
          ) : (
            <p className="text-slate-500 text-sm">No hay alumnos asignados a esta materia.</p>
          )}
        </div>
      )}

      {activeTab === 'asistencia' && (
        <div className="animate-fade-in bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center backdrop-blur-sm">
           <div className="text-4xl mb-4">✅</div>
           <h3 className="text-[#F4F6F9] font-medium mb-1">Módulo de Asistencia en construcción</h3>
           <p className="text-slate-500 text-sm">Seleccione la pestaña de calificaciones para ver el listado interactivo.</p>
        </div>
      )}

      {activeTab === 'horarios' && (
        <div className="animate-fade-in bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center backdrop-blur-sm">
           <div className="text-4xl mb-4">📅</div>
           <h3 className="text-[#F4F6F9] font-medium mb-1">Módulo de Horarios en construcción</h3>
           <p className="text-slate-500 text-sm">Seleccione la pestaña de calificaciones para ver el listado interactivo.</p>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────
   Alumno Dashboard (con tabs: Perfil / Materias / Horario)
──────────────────────────────────────────────── */
export function AlumnoDashboard({ user, alumnos, cursos, materias }) {
  // ⚡ Bolt: Optimize O(N) entity lookups in render
  const alumno = useMemo(() => alumnos.find(a => a.email === user.email), [alumnos, user.email]);
  const seccion = useMemo(() => cursos.find(c => c.id === alumno?.cursoId), [cursos, alumno?.cursoId]);
  const myMaterias = useMemo(() => materias.filter(m => m.cursoId === alumno?.cursoId), [materias, alumno?.cursoId]);

  // Datos mockeados para rendimiento
  const rendimientoData = [
    { label: 'Parcial 1', value: 85 },
    { label: 'Parcial 2', value: 92 },
    { label: 'Parcial 3', value: 78 },
    { label: 'Examen', value: 88 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#F4F6F9]">Mi Progreso Académico</h1>
          <p className="text-slate-400 text-sm mt-1">Hola, {user.nombre} {user.apellido}</p>
        </div>
        {seccion && (
          <span className="inline-flex items-center gap-2 bg-[#0052CC]/10 border border-[#00E5FF]/30 text-[#00E5FF] px-4 py-1.5 rounded-full text-sm font-semibold">
            <span className="w-2 h-2 rounded-full brightness-110"></span>
            {seccion.carrera} · {seccion.nivel} · Sección {seccion.paralelo}
          </span>
        )}
      </div>

      {/* Sección Superior: StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Promedio General" value="8.9" icon="📈" color="gold" hint="Sobre 10" />
        <StatCard label="Asistencia" value="95%" icon="✅" color="emerald" hint="Este semestre" />
        <StatCard label="Materias Aprobadas" value={myMaterias.length > 0 ? myMaterias.length - 1 : 0} icon="📚" color="accent" hint="Histórico" />
        <StatCard label="Próxima Evaluación" value="2 días" icon="⏳" color="violet" hint="Física II" />
      </div>

      {/* Cuerpo Principal: 2 columnas */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Columna Izquierda (65%) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { id: 'materias', label: 'Mis Materias', icon: '📚', desc: `${myMaterias.length} registradas` },
            { id: 'horarios', label: 'Horarios', icon: '📅', desc: 'Clases y tutorías' },
            { id: 'calificaciones', label: 'Calificaciones', icon: '📝', desc: 'Historial académico' },
            { id: 'tramites', label: 'Trámites', icon: '📄', desc: 'Solicitudes y pagos' },
            { id: 'evaluacion', label: 'Evaluación Docente', icon: '⭐', desc: 'Pendiente (2)' },
          ].map(modulo => (
            <div
              key={modulo.id}
              className="bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] hover:border-[#00E5FF]/40 transition-all group flex flex-col items-center text-center gap-3 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-[#0B132B] flex items-center justify-center text-2xl group-hover:bg-[#0052CC]/20 transition-colors">
                {modulo.icon}
              </div>
              <div>
                <h3 className="text-[#F4F6F9] font-medium text-sm">{modulo.label}</h3>
                <p className="text-xs text-slate-400 mt-1">{modulo.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Columna Derecha (35%) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-5 backdrop-blur-sm">
            <h2 className="font-serif text-base font-semibold text-[#F4F6F9] mb-4">Rendimiento (Último período)</h2>
            <div className="h-[200px] w-full rounded-xl overflow-hidden bg-[#0B132B]">
              <Suspense fallback={<div className="h-full flex items-center justify-center text-slate-500">Cargando 3D...</div>}>
                <BarChart3D data={rendimientoData} />
              </Suspense>
            </div>
          </div>

          <div className="bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-5 backdrop-blur-sm">
            <h2 className="font-serif text-base font-semibold text-[#F4F6F9] mb-3 flex items-center gap-2">
              <span>🔔</span> Avisos del Campus
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-[#0052CC]/10 border border-[#00E5FF]/20 rounded-xl">
                <p className="text-xs font-medium text-[#00E5FF]">Inicio de matrículas extraordinarias</p>
                <p className="text-[10px] text-slate-400 mt-1">15 de Junio, 2024</p>
              </div>
              <div className="p-3 bg-white/5 border border-[#E2E8F0]/20 rounded-xl">
                <p className="text-xs font-medium text-slate-200">Mantenimiento del Sistema</p>
                <p className="text-[10px] text-slate-400 mt-1">Este fin de semana de 00:00 a 04:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  const cursoById = useMemo(() => Object.fromEntries(cursos.map(c => [c.id, c])), [cursos]);

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
    const c = cursoById[m.cursoId];
    if (filter.carrera && c?.carrera !== filter.carrera) return false;
    if (filter.nivel   && c?.nivel   !== filter.nivel)   return false;
    if (filter.cursoId && m.cursoId  !== filter.cursoId) return false;
    return true;
  });

  const cols = [
    { key: 'nombre',   label: 'Materia' },
    { key: 'codigo',   label: 'Código' },
    { key: 'creditos', label: 'Créditos' },
    { key: 'carrera',  label: 'Carrera', render: r => cursoById[r.cursoId]?.carrera ?? '—' },
    { key: 'nivel',    label: 'Nivel',   render: r => cursoById[r.cursoId]?.nivel ?? '—' },
    { key: 'paralelo', label: 'Sección', render: r => cursoById[r.cursoId]?.paralelo ?? '—' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#F4F6F9]">Mis Materias</h1>
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

  const cursoById = useMemo(() => Object.fromEntries(cursos.map(c => [c.id, c])), [cursos]);

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
    const c = cursoById[a.cursoId];
    if (filter.carrera && c?.carrera !== filter.carrera) return false;
    if (filter.nivel   && c?.nivel   !== filter.nivel)   return false;
    if (filter.cursoId && a.cursoId  !== filter.cursoId) return false;
    return true;
  });

  const cols = [
    { key: 'nombre',   label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'email',    label: 'Email' },
    { key: 'carrera',  label: 'Carrera', render: r => cursoById[r.cursoId]?.carrera ?? '—' },
    { key: 'nivel',    label: 'Nivel',   render: r => cursoById[r.cursoId]?.nivel ?? '—' },
    { key: 'paralelo', label: 'Sección', render: r => cursoById[r.cursoId]?.paralelo ?? '—' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#F4F6F9]">Mis Alumnos</h1>
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
  const alumno = useMemo(() => alumnos.find(a => a.email === user.email), [alumnos, user.email]);
  const myMaterias = useMemo(() => materias.filter(m => m.cursoId === alumno?.cursoId), [materias, alumno?.cursoId]);

  const [filter, setFilter] = useState({ profesorId: '' });

  // ⚡ Bolt: O(1) Map Lookups for Related Entities
  const profById = useMemo(() => Object.fromEntries(profesores.map(p => [p.id, p])), [profesores]);

  const profOpts = useMemo(() => uniq(myMaterias.map(m => m.profesorId))
    .map(id => profById[id])
    .filter(Boolean)
    .map(p => ({ value: p.id, label: `${p.nombre} ${p.apellido}` })), [myMaterias, profById]);

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
      render: r => { const p = profById[r.profesorId]; return p ? `${p.nombre} ${p.apellido}` : '—'; },
    },
  ];

  return (
    <div className="space-y-5">
      {!compact && <h1 className="font-serif text-2xl font-bold text-[#F4F6F9]">Mis Materias</h1>}
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

function buildSchedule(materias) {
  const grid = {};
  DAYS.forEach(d => { grid[d] = Array(TIME_SLOTS.length).fill(null); });
  if (!materias || materias.length === 0) return grid;

  let pos = 0;
  const totalSlots = DAYS.length * TIME_SLOTS.length;
  materias.forEach((m) => {
    for (let s = 0; s < 2; s++) {
      let tries = 0;
      while (tries < totalSlots) {
        const d = DAYS[pos % DAYS.length];
        const t = Math.floor(pos / DAYS.length) % TIME_SLOTS.length;
        pos = (pos + 1) % totalSlots;
        if (!grid[d][t]) { grid[d][t] = m; break; }
        tries++;
      }
    }
    pos = (pos + 3) % totalSlots;
  });
  return grid;
}

export function AlumnoHorario({ user, alumnos, materias, profesores, cursos }) {
  const alumno = useMemo(() => alumnos?.find(a => a.email === user.email), [alumnos, user.email]);
  const seccion = useMemo(() => cursos?.find(c => c.id === alumno?.cursoId), [cursos, alumno?.cursoId]);
  const myMaterias = useMemo(
    () => materias?.filter(m => m.cursoId === alumno?.cursoId) ?? [],
    [materias, alumno?.cursoId]
  );

  // ⚡ Bolt: O(1) Map Lookups for Related Entities
  const profById = useMemo(() => Object.fromEntries((profesores || []).map(p => [p.id, p])), [profesores]);

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
          <h1 className="font-serif text-2xl font-bold text-[#F4F6F9]">Mi Horario Semanal</h1>
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
        <div className="bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-2xl p-8 text-center text-slate-500 text-sm">
          No tienes materias asignadas — el horario aparecerá cuando estés inscrito en una sección con materias.
        </div>
      ) : view === 'semanal' ? (
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1C2541]/80 border-b border-[#E2E8F0]/20">
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
                          ? <div className="bg-[#0052CC]/10 border border-[#00E5FF]/20 rounded-lg px-3 py-2 min-w-[140px]">
                              <div className="text-[#00E5FF] text-xs font-semibold truncate">{m.nombre}</div>
                              <div className="text-[10px] text-slate-500 truncate">{m.codigo}</div>
                              {profesores && (() => {
                                const p = profById[m.profesorId];
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
            <div key={d} className="bg-[#1C2541]/80 border border-[#E2E8F0]/20 rounded-xl p-4">
              <h3 className="text-[#F4F6F9] font-semibold text-sm mb-3">{d}</h3>
              <div className="space-y-2">
                {grid[d].map((m, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-xs text-slate-500 font-mono w-28 shrink-0">{TIME_SLOTS[i]}</span>
                    {m
                      ? <div className="flex-1 bg-[#0052CC]/10 border border-[#00E5FF]/20 rounded-lg px-3 py-1.5">
                          <span className="text-[#00E5FF] text-xs font-medium">{m.nombre}</span>
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