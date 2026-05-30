import { useState, useCallback, useEffect } from 'react';

import { DEMO_USERS, INITIAL_CURSOS, INITIAL_PROFESORES, INITIAL_MATERIAS, INITIAL_ALUMNOS } from './data.js';
import { hashPassword } from './utils/crypto.js';
import Auth from './components/Auth.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Profile from './components/Profile.jsx';
import { Toast } from './components/UI.jsx';
import { Suspense, lazy } from 'react';
import LoadingSpinner from './components/LoadingSpinner.jsx';

const AdminDashboard = lazy(() => import('./components/Dashboards.jsx').then(m => ({ default: m.AdminDashboard })));
const SecretaryDashboard = lazy(() => import('./components/Dashboards.jsx').then(m => ({ default: m.SecretaryDashboard })));
const ProfesorDashboard = lazy(() => import('./components/Dashboards.jsx').then(m => ({ default: m.ProfesorDashboard })));
const AlumnoDashboard = lazy(() => import('./components/Dashboards.jsx').then(m => ({ default: m.AlumnoDashboard })));
const ProfesorMisMaterias = lazy(() => import('./components/Dashboards.jsx').then(m => ({ default: m.ProfesorMisMaterias })));
const ProfesorMisAlumnos = lazy(() => import('./components/Dashboards.jsx').then(m => ({ default: m.ProfesorMisAlumnos })));
const AlumnoMisMaterias = lazy(() => import('./components/Dashboards.jsx').then(m => ({ default: m.AlumnoMisMaterias })));
const AlumnoHorario = lazy(() => import('./components/Dashboards.jsx').then(m => ({ default: m.AlumnoHorario })));

const AlumnosModule = lazy(() => import('./components/Modules.jsx').then(m => ({ default: m.AlumnosModule })));
const ProfesoresModule = lazy(() => import('./components/Modules.jsx').then(m => ({ default: m.ProfesoresModule })));
const CursosModule = lazy(() => import('./components/Modules.jsx').then(m => ({ default: m.CursosModule })));
const MateriasModule = lazy(() => import('./components/Modules.jsx').then(m => ({ default: m.MateriasModule })));

let nextId = 100;
const uid = () => `id_${++nextId}`;

export default function App() {
  const [user, setUser] = useState(null);
  const TEST_USERS = [
    { id: 'u1', email: 'admin@sge.edu', role: 'Administrador', nombre: 'Carlos', apellido: 'Mendoza', avatar: null },
    { id: 'u2', email: 'secretaria@sge.edu', role: 'Secretaria', nombre: 'María', apellido: 'Paredes', avatar: null },
    { id: 'u3', email: 'profesor@sge.edu', role: 'Profesor', nombre: 'Eduardo', apellido: 'Salgado', avatar: null },
    { id: 'u4', email: 'alumno@sge.edu', role: 'Alumno', nombre: 'Lucía', apellido: 'Torres', avatar: null },
  ];
  const [users, setUsers] = useState(DEMO_USERS.length > 0 ? DEMO_USERS : TEST_USERS);
  const [alumnos, setAlumnos] = useState(INITIAL_ALUMNOS);
  const [profesores, setProfesores] = useState(INITIAL_PROFESORES);
  const [cursos, setCursos] = useState(INITIAL_CURSOS);
  const [materias, setMaterias] = useState(INITIAL_MATERIAS);
  const [currentView, setCurrentView] = useState('dashboard');
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const handleLogin = useCallback(async (email, password, role) => {
    if (typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string') return false;
    if (email.length > 100 || password.length > 100 || password.length === 0) return false;

    const ROLES = ['Administrador', 'Secretaria', 'Profesor', 'Alumno'];
    if (!ROLES.includes(role)) return false;

    const found = users.find(u => u.email === email);
    if (!found || found.role !== role) return false;

    const hashedPassword = await hashPassword(password);
    if (found.password !== undefined && hashedPassword !== found.password) return false;

    // Attach profesorId link
    const prof = profesores.find(p => p.email === found.email);
    setUser({ ...found, profesorId: prof?.id ?? null });
    setCurrentView('dashboard');
    return true;
  }, [users, profesores]);

  const handleLogout = () => { setUser(null); setCurrentView('dashboard'); };

  const handleUpdateAvatar = useCallback((avatar) => {
    setUser(prev => ({ ...prev, avatar }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, avatar } : u));
    addToast('Foto de perfil actualizada');
  }, [user, addToast]);

  const handleUpdateProfile = useCallback((fields) => {
    // SECURITY: Prevent Mass Assignment by explicitly extracting only permitted fields
    const allowedFields = {};
    if (fields.nombre !== undefined) allowedFields.nombre = fields.nombre;
    if (fields.apellido !== undefined) allowedFields.apellido = fields.apellido;
    if (fields.email !== undefined) allowedFields.email = fields.email;

    setUser(prev => ({ ...prev, ...allowedFields }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...allowedFields } : u));

    // Sync con alumnos/profesores si corresponde
    if (user.role === 'Alumno') {
      setAlumnos(prev => prev.map(a => a.email === user.email
        ? { ...a, ...allowedFields }
        : a));
    }
    if (user.role === 'Profesor') {
      setProfesores(prev => prev.map(p => p.email === user.email
        ? { ...p, ...allowedFields }
        : p));
    }
    addToast('Datos actualizados correctamente');
  }, [user, addToast]);

  const handleChangePassword = useCallback(async (currentPassword, newPassword) => {
    const hashedCurrent = await hashPassword(currentPassword);
    const found = users.find(u => u.id === user.id && u.password === hashedCurrent);
    if (!found) return false;
    const hashedNew = await hashPassword(newPassword);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, password: hashedNew } : u));
    addToast('Contraseña actualizada correctamente');
    return true;
  }, [user, users, addToast]);

  // ── CRUD helpers ──
  const crudAdd = (setter, entity) => (data) => {
    setter(prev => [...prev, { ...data, id: uid() }]);
    addToast(`${entity} agregado correctamente`);
  };
  const crudEdit = (setter, entity) => (updated) => {
    setter(prev => prev.map(x => x.id === updated.id ? updated : x));
    addToast(`${entity} actualizado`, 'success');
  };
  const crudDelete = (setter, entity) => (item) => {
    setter(prev => prev.filter(x => x.id !== item.id));
    addToast(`${entity} eliminado`, 'success');
  };

  // ── Agregar alumno + crear cuenta de acceso ──
  const handleAddAlumno = useCallback(async (data) => {
    const { password, ...alumnoData } = data;
    const newId = uid();
    setAlumnos(prev => [...prev, { ...alumnoData, id: newId }]);
    const hashedPassword = await hashPassword(password);
    setUsers(prev => [...prev, {
      id: `u_${newId}`,
      email: alumnoData.email,
      password: hashedPassword,
      role: 'Alumno',
      nombre: alumnoData.nombre,
      apellido: alumnoData.apellido,
      avatar: null,
    }]);
    addToast('Alumno registrado y cuenta de acceso creada');
  }, [addToast]);

  // ── View Renderer ──
  const renderView = () => {
    if (!user) return null;
    const role = user.role;

    const viewContent = (() => {
      switch (currentView) {
        case 'dashboard':
          if (role === 'Administrador') return <AdminDashboard alumnos={alumnos} profesores={profesores} cursos={cursos} materias={materias} />;
          if (role === 'Secretaria') return <SecretaryDashboard alumnos={alumnos} profesores={profesores} cursos={cursos} materias={materias} />;
          if (role === 'Profesor') return <ProfesorDashboard user={user} materias={materias} cursos={cursos} alumnos={alumnos} />;
          if (role === 'Alumno') return <AlumnoDashboard user={user} alumnos={alumnos} cursos={cursos} materias={materias} profesores={profesores} />;
          break;

        case 'alumnos':
          if (role === 'Administrador')
            return <AlumnosModule alumnos={alumnos} cursos={cursos} loading={loading}
              onAdd={handleAddAlumno} onEdit={crudEdit(setAlumnos, 'Alumno')} onDelete={crudDelete(setAlumnos, 'Alumno')} />;
          if (role === 'Secretaria')
            return <AlumnosModule alumnos={alumnos} cursos={cursos} loading={loading} noDelete
              onAdd={handleAddAlumno} onEdit={crudEdit(setAlumnos, 'Alumno')} />;
          break;

        case 'profesores':
          if (role === 'Administrador')
            return <ProfesoresModule profesores={profesores} loading={loading}
              onAdd={crudAdd(setProfesores, 'Profesor')} onEdit={crudEdit(setProfesores, 'Profesor')} onDelete={crudDelete(setProfesores, 'Profesor')} />;
          break;

        case 'cursos':
          if (role === 'Administrador')
            return <CursosModule cursos={cursos} loading={loading}
              onAdd={crudAdd(setCursos, 'Curso')} onEdit={crudEdit(setCursos, 'Curso')} onDelete={crudDelete(setCursos, 'Curso')} />;
          if (role === 'Secretaria')
            return <CursosModule cursos={cursos} loading={loading} readonly />;
          break;

        case 'materias':
          if (role === 'Administrador')
            return <MateriasModule materias={materias} profesores={profesores} cursos={cursos} loading={loading}
              onAdd={crudAdd(setMaterias, 'Materia')} onEdit={crudEdit(setMaterias, 'Materia')} onDelete={crudDelete(setMaterias, 'Materia')} />;
          if (role === 'Secretaria')
            return <MateriasModule materias={materias} profesores={profesores} cursos={cursos} loading={loading} readonly />;
          break;

        case 'mis-materias':
          if (role === 'Profesor') return <ProfesorMisMaterias user={user} materias={materias} cursos={cursos} />;
          if (role === 'Alumno') return <AlumnoMisMaterias user={user} alumnos={alumnos} materias={materias} profesores={profesores} cursos={cursos} />;
          break;

        case 'mis-alumnos':
          if (role === 'Profesor') return <ProfesorMisAlumnos user={user} materias={materias} alumnos={alumnos} cursos={cursos} />;
          break;

        case 'mi-horario':
          if (role === 'Alumno') return <AlumnoHorario user={user} alumnos={alumnos} materias={materias} profesores={profesores} cursos={cursos} />;
          break;

        case 'perfil':
          return <Profile user={user} onUpdateAvatar={handleUpdateAvatar} onUpdateProfile={handleUpdateProfile} onChangePassword={handleChangePassword} />;

        default:
          return <div className="text-slate-400">Vista no encontrada</div>;
      }
    })();

    return (
      <ProtectedRoute user={user} view={currentView}>
        <Suspense fallback={<LoadingSpinner />}>
          {viewContent}
        </Suspense>
      </ProtectedRoute>
    );
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <>
      <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
        {renderView()}
      </Layout>
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}
