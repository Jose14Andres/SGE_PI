import { useState, useMemo } from 'react';
import { DataTable, Modal, Field, ConfirmDialog, SkeletonTable, FilterBar } from './UI.jsx';

/* ──────────────────────────────────
   Utilidades
────────────────────────────────── */
const uniq = (arr) => [...new Set(arr.filter(Boolean))];
const asOpt = (v) => ({ value: v, label: v });

/* ──────────────────────────────────
   CRUD Module factory (con filtros)
────────────────────────────────── */
function CrudModule({
  title,
  columns,
  data,
  formFields,
  emptyForm,
  filters = [],
  applyFilters,
  onAdd,
  onEdit,
  onDelete,
  loading,
  readonly = false,
  noDelete = false,
  hint,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [confirmItem, setConfirmItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [filterValues, setFilterValues] = useState(() =>
    filters.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})
  );

  const openAdd = () => { setEditingItem(null); setFormData(emptyForm); setErrors({}); setModalOpen(true); };
  const openEdit = (item) => { setEditingItem(item); setFormData({ ...item }); setErrors({}); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingItem(null); setErrors({}); };

  const visibleFields = formFields.filter(f => !f.onlyOnAdd || !editingItem);

  const validate = () => {
    const e = {};
    visibleFields.forEach(f => {
      if (f.required && !formData[f.key]?.toString().trim()) e[f.key] = 'Campo requerido';
      if (f.type === 'email' && formData[f.key] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[f.key])) e[f.key] = 'Email inválido';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingItem) onEdit({ ...editingItem, ...formData });
    else onAdd(formData);
    closeModal();
  };

  const filteredData = useMemo(() => {
    if (!applyFilters) return data;
    return applyFilters(data, filterValues);
  }, [data, filterValues, applyFilters]);

  const resetFilters = () => setFilterValues(filters.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#F4F6F9]">{title}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {filteredData.length} de {data.length} registro{data.length !== 1 ? 's' : ''}
            {hint && <span className="text-slate-500"> · {hint}</span>}
          </p>
        </div>
        {!readonly && (
          <button id={`btn-add-${title.replace(/\s/g, '')}`} onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-[#0052CC] to-[#00E5FF] hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#00E5FF] px-4 py-2 rounded-xl text-sm font-medium text-[#F4F6F9] transition-colors shadow-lg shadow-[#00E5FF]/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Agregar
          </button>
        )}
      </div>

      {filters.length > 0 && (
        <FilterBar filters={filters} values={filterValues} onChange={setFilterValues} onReset={resetFilters} />
      )}

      {loading
        ? <SkeletonTable rows={5} cols={columns.length} />
        : <DataTable
            columns={columns}
            data={filteredData}
            onEdit={readonly ? null : openEdit}
            onDelete={readonly || noDelete ? null : (item) => setConfirmItem(item)}
          />
      }

      {modalOpen && (
        <Modal title={editingItem ? `Editar ${title}` : `Agregar ${title}`} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {visibleFields.map(f => (
              <div key={f.key}>
                <Field
                  label={f.label}
                  id={`field-${f.key}`}
                  type={f.type ?? 'text'}
                  value={formData[f.key] ?? ''}
                  onChange={v => setFormData(prev => ({ ...prev, [f.key]: v }))}
                  options={f.options}
                  required={f.required}
                  placeholder={f.placeholder}
                  maxLength={f.maxLength}
                />
                {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
              </div>
            ))}
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-slate-400 hover:text-[#F4F6F9] border border-[#E2E8F0]/20 hover:border-white/20 rounded-lg transition-all">Cancelar</button>
              <button type="submit" className="px-5 py-2 text-sm bg-gradient-to-r from-[#0052CC] to-[#00E5FF] hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#00E5FF] text-[#F4F6F9] rounded-lg transition-colors font-medium">
                {editingItem ? 'Guardar cambios' : 'Agregar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmItem && (
        <ConfirmDialog
          message={`¿Seguro que deseas eliminar este registro? Esta acción no se puede deshacer.`}
          onConfirm={() => { onDelete(confirmItem); setConfirmItem(null); }}
          onCancel={() => setConfirmItem(null)}
        />
      )}
    </div>
  );
}

/* ──────────────────────────────────
   Alumnos Module
────────────────────────────────── */
export function AlumnosModule({ alumnos, cursos, onAdd, onEdit, onDelete, loading, readonly, noDelete }) {
  const cursoById = useMemo(() => Object.fromEntries(cursos.map(c => [c.id, c])), [cursos]);

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'email', label: 'Email' },
    { key: 'fechaNacimiento', label: 'F. Nacimiento' },
    {
      key: 'carrera', label: 'Carrera',
      render: row => cursoById[row.cursoId]?.carrera ?? '—',
    },
    {
      key: 'nivel', label: 'Nivel',
      render: row => cursoById[row.cursoId]?.nivel ?? '—',
    },
    {
      key: 'paralelo', label: 'Sección',
      render: row => cursoById[row.cursoId]?.paralelo ?? '—',
    },
  ];

  const formFields = [
    { key: 'nombre',          label: 'Nombre',              required: true,  placeholder: 'ej. Lucía', maxLength: 100 },
    { key: 'apellido',        label: 'Apellido',            required: true,  placeholder: 'ej. Torres', maxLength: 100 },
    { key: 'email',           label: 'Email',               type: 'email',   required: true, placeholder: 'lucia@sge.edu', maxLength: 100 },
    { key: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date',    required: true },
    { key: 'cursoId',         label: 'Sección Asignada',    type: 'select',  required: true, options: cursos.map(c => ({ value: c.id, label: c.nombre })) },
    { key: 'password',        label: 'Contraseña de Acceso', type: 'password', required: true, placeholder: 'Contraseña para el alumno', onlyOnAdd: true, maxLength: 100 },
  ];

  const carrerasOpts = uniq(cursos.map(c => c.carrera)).map(asOpt);
  const nivelesOpts  = uniq(cursos.map(c => c.nivel)).map(asOpt);
  const paralelosOpts = uniq(cursos.map(c => c.paralelo)).map(asOpt);

  const filters = [
    { key: 'carrera',  label: 'Carrera',  options: carrerasOpts },
    { key: 'nivel',    label: 'Nivel',    options: nivelesOpts },
    { key: 'paralelo', label: 'Sección',  options: paralelosOpts },
  ];

  const applyFilters = (rows, v) => rows.filter(r => {
    const c = cursoById[r.cursoId];
    if (!c) return !(v.carrera || v.nivel || v.paralelo);
    if (v.carrera  && c.carrera  !== v.carrera) return false;
    if (v.nivel    && c.nivel    !== v.nivel)   return false;
    if (v.paralelo && c.paralelo !== v.paralelo) return false;
    return true;
  });

  return <CrudModule title="Alumnos" columns={columns} data={alumnos} formFields={formFields}
    emptyForm={{ nombre: '', apellido: '', email: '', fechaNacimiento: '', cursoId: '', password: '' }}
    filters={filters} applyFilters={applyFilters}
    onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} loading={loading} readonly={readonly} noDelete={noDelete} />;
}

/* ──────────────────────────────────
   Profesores Module
────────────────────────────────── */
export function ProfesoresModule({ profesores, onAdd, onEdit, onDelete, loading, readonly }) {
  const columns = [
    { key: 'nombre',       label: 'Nombre' },
    { key: 'apellido',     label: 'Apellido' },
    { key: 'email',        label: 'Email' },
    { key: 'especialidad', label: 'Especialidad' },
  ];
  const formFields = [
    { key: 'nombre',       label: 'Nombre',       required: true, maxLength: 100 },
    { key: 'apellido',     label: 'Apellido',     required: true, maxLength: 100 },
    { key: 'email',        label: 'Email',        type: 'email', required: true, maxLength: 100 },
    { key: 'especialidad', label: 'Especialidad', required: true, placeholder: 'ej. Matemáticas', maxLength: 100 },
  ];

  const especialidadesOpts = uniq(profesores.map(p => p.especialidad)).map(asOpt);
  const filters = [
    { key: 'especialidad', label: 'Especialidad', options: especialidadesOpts },
  ];
  const applyFilters = (rows, v) => rows.filter(r => !v.especialidad || r.especialidad === v.especialidad);

  return <CrudModule title="Profesores" columns={columns} data={profesores} formFields={formFields}
    emptyForm={{ nombre: '', apellido: '', email: '', especialidad: '' }}
    filters={filters} applyFilters={applyFilters}
    onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} loading={loading} readonly={readonly} />;
}

/* ──────────────────────────────────
   Cursos Module (Secciones)
────────────────────────────────── */
const CARRERAS_OPTIONS = [
  { value: 'Ingeniería',  label: 'Ingeniería' },
  { value: 'Psicología',  label: 'Psicología' },
  { value: 'Derecho',     label: 'Derecho' },
  { value: 'Medicina',    label: 'Medicina' },
  { value: 'Marketing',   label: 'Marketing' },
];

export function CursosModule({ cursos, onAdd, onEdit, onDelete, loading, readonly }) {
  const columns = [
    { key: 'carrera',     label: 'Carrera' },
    { key: 'nivel',       label: 'Nivel' },
    { key: 'paralelo',    label: 'Sección' },
    { key: 'anioLectivo', label: 'Período' },
  ];
  const formFields = [
    { key: 'carrera',     label: 'Carrera',         type: 'select', required: true, options: CARRERAS_OPTIONS },
    { key: 'nivel',       label: 'Nivel',           required: true, placeholder: 'ej. 1er Nivel', maxLength: 100 },
    { key: 'paralelo',    label: 'Sección',         required: true, placeholder: 'ej. A', maxLength: 50 },
    { key: 'anioLectivo', label: 'Período Lectivo', required: true, placeholder: 'ej. 2024-2025', maxLength: 50 },
  ];

  const carrerasOpts  = uniq(cursos.map(c => c.carrera)).map(asOpt);
  const nivelesOpts   = uniq(cursos.map(c => c.nivel)).map(asOpt);
  const paralelosOpts = uniq(cursos.map(c => c.paralelo)).map(asOpt);
  const periodosOpts  = uniq(cursos.map(c => c.anioLectivo)).map(asOpt);

  const filters = [
    { key: 'carrera',     label: 'Carrera',  options: carrerasOpts },
    { key: 'nivel',       label: 'Nivel',    options: nivelesOpts },
    { key: 'paralelo',    label: 'Sección',  options: paralelosOpts },
    { key: 'anioLectivo', label: 'Período',  options: periodosOpts },
  ];

  const applyFilters = (rows, v) => rows.filter(r =>
    (!v.carrera     || r.carrera     === v.carrera) &&
    (!v.nivel       || r.nivel       === v.nivel) &&
    (!v.paralelo    || r.paralelo    === v.paralelo) &&
    (!v.anioLectivo || r.anioLectivo === v.anioLectivo)
  );

  return <CrudModule title="Secciones" columns={columns} data={cursos} formFields={formFields}
    emptyForm={{ carrera: '', nivel: '', paralelo: '', anioLectivo: '' }}
    filters={filters} applyFilters={applyFilters}
    onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} loading={loading} readonly={readonly} />;
}

/* ──────────────────────────────────
   Materias Module
────────────────────────────────── */
export function MateriasModule({ materias, profesores, cursos, onAdd, onEdit, onDelete, loading, readonly }) {
  const cursoById = useMemo(() => Object.fromEntries(cursos.map(c => [c.id, c])), [cursos]);
  const profById  = useMemo(() => Object.fromEntries(profesores.map(p => [p.id, p])), [profesores]);

  const columns = [
    { key: 'nombre',   label: 'Materia' },
    { key: 'codigo',   label: 'Código' },
    { key: 'creditos', label: 'Créditos' },
    {
      key: 'profesorId', label: 'Profesor',
      render: r => { const p = profById[r.profesorId]; return p ? `${p.nombre} ${p.apellido}` : '—'; },
    },
    {
      key: 'carrera', label: 'Carrera',
      render: r => cursoById[r.cursoId]?.carrera ?? '—',
    },
    {
      key: 'nivel', label: 'Nivel',
      render: r => cursoById[r.cursoId]?.nivel ?? '—',
    },
  ];

  const formFields = [
    { key: 'nombre',     label: 'Nombre de la Materia', required: true, maxLength: 100 },
    { key: 'codigo',     label: 'Código',        required: true, placeholder: 'ej. ING-CAL1', maxLength: 50 },
    { key: 'creditos',   label: 'Créditos',      type: 'number', required: true, maxLength: 3 },
    { key: 'profesorId', label: 'Profesor Asignado', type: 'select', required: true, options: profesores.map(p => ({ value: p.id, label: `${p.nombre} ${p.apellido}` })) },
    { key: 'cursoId',    label: 'Sección Asignada',  type: 'select', required: true, options: cursos.map(c => ({ value: c.id, label: c.nombre })) },
  ];

  const carrerasOpts = uniq(cursos.map(c => c.carrera)).map(asOpt);
  const nivelesOpts  = uniq(cursos.map(c => c.nivel)).map(asOpt);
  const profOpts     = profesores.map(p => ({ value: p.id, label: `${p.nombre} ${p.apellido}` }));

  const filters = [
    { key: 'carrera',    label: 'Carrera',  options: carrerasOpts },
    { key: 'nivel',      label: 'Nivel',    options: nivelesOpts },
    { key: 'profesorId', label: 'Profesor', options: profOpts },
  ];

  const applyFilters = (rows, v) => rows.filter(r => {
    const c = cursoById[r.cursoId];
    if (v.carrera && c?.carrera !== v.carrera) return false;
    if (v.nivel   && c?.nivel   !== v.nivel)   return false;
    if (v.profesorId && r.profesorId !== v.profesorId) return false;
    return true;
  });

  return <CrudModule title="Materias" columns={columns} data={materias} formFields={formFields}
    emptyForm={{ nombre: '', codigo: '', creditos: '', profesorId: '', cursoId: '' }}
    filters={filters} applyFilters={applyFilters}
    onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} loading={loading} readonly={readonly} />;
}
