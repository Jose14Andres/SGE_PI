import { useState, useCallback, useEffect } from 'react';

import { DEMO_USERS, INITIAL_CURSOS, INITIAL_PROFESORES, INITIAL_MATERIAS, INITIAL_ALUMNOS } from './data.js';
import { hashPassword, signSession, verifySession } from './utils/crypto.js';
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
    { id: 'u1', email: 'admin@sge.edu', password: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', role: 'Administrador', nombre: 'Carlos', apellido: 'Mendoza', avatar: null },
    { id: 'u2', email: 'secretaria@sge.edu', password: 'b78847eb7959618ed22e43389ff68944a55a6a26893f9c74be4e7216bab6f4d5', role: 'Secretaria', nombre: 'María', apellido: 'Paredes', avatar: null },
    { id: 'u3', email: 'profesor@sge.edu', password: 'cffa965d9faa1d453f2d336294b029a7f84f485f75ce2a2c723065453b12b03b', role: 'Profesor', nombre: 'Eduardo', apellido: 'Salgado', avatar: null },
    { id: 'u4', email: 'alumno@sge.edu', password: 'c1042ecc51482cef39f2e89e1273a35074db7f873f1ac6050efd546a9bceefc0', role: 'Alumno', nombre: 'Lucía', apellido: 'Torres', avatar: null },
  ];
  // Strictly isolate test user state variables
  const [users, setUsers] = useState(import.meta.env.DEV && DEMO_USERS.length > 0 ? DEMO_USERS : TEST_USERS);
  const [alumnos, setAlumnos] = useState(INITIAL_ALUMNOS);
  const [profesores, setProfesores] = useState(INITIAL_PROFESORES);
  const [cursos, setCursos] = useState(INITIAL_CURSOS);
  const [materias, setMaterias] = useState(INITIAL_MATERIAS);
  const [currentView, setCurrentView] = useState('dashboard');
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load session from sessionStorage securely
  useEffect(() => {
    const loadSession = async () => {
      const storedSession = sessionStorage.getItem('sge_session');
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          const { user: storedUser, signature } = parsed;

          // Integrity check using mock MAC
          const isValid = await verifySession(storedUser.id, storedUser.role, signature);
          if (isValid) {
            // Prevent Role Tampering by matching role to our data (or strictly validating)
            const trueUser = users.find(u => u.id === storedUser.id);
            if (trueUser && trueUser.role === storedUser.role) {
              setUser({ ...storedUser, profesorId: trueUser.role === 'Profesor' ? (profesores.find(p => p.email === trueUser.email)?.id ?? null) : null });
              setLoading(false);
              return;
            }
          }
          // Invalid signature or tampered role -> destroy session
          sessionStorage.removeItem('sge_session');
        } catch {
          sessionStorage.removeItem('sge_session');
        }
      }
      setLoading(false);
    };

    loadSession();
    // Simulate loading delay for demo only if no session
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [users, profesores]);

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

    const foundUser = users.find(u => u.email === email);
    if (!foundUser) return false;
    if (foundUser.role !== role) return false;

    // SECURITY: Prevent RBAC Bypass - Ensure requested role matches stored user role
    if (foundUser.role !== role) return false;

    const hashedPassword = await hashPassword(password);
    const authenticatedUser = users.find(u => u.email === email && u.password === hashedPassword && u.role === role);

    if (!authenticatedUser) return false;

    // Attach profesorId link
    let prof = profesores.find(p => p.email === authenticatedUser.email);
    setUser({ ...authenticatedUser, profesorId: prof?.id ?? null });
    if (foundUser.password !== hashedPassword) return false;

    // Attach profesorId link
    prof = profesores.find(p => p.email === foundUser.email);
    const sessionUser = { ...foundUser, profesorId: prof?.id ?? null };
    setUser(sessionUser);

    // Save session securely
    const signature = await signSession(sessionUser.id, sessionUser.role);
    sessionStorage.setItem('sge_session', JSON.stringify({ user: sessionUser, signature }));

    setCurrentView('dashboard');
    return true;
  }, [users, profesores]);

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('sge_session');
    setCurrentView('dashboard');
  };

  const handleUpdateAvatar = useCallback((avatar) => {
    setUser(prev => ({ ...prev, avatar }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, avatar } : u));
    addToast('Foto de perfil actualizada');
  }, [user, addToast]);

  const handleUpdateProfile = useCallback((fields) => {
    if (!fields || typeof fields !== 'object') {
      addToast('Datos inválidos.', 'error');
      return;
    }
    if ((fields.nombre && (typeof fields.nombre !== 'string' || fields.nombre.length > 100)) ||
        (fields.apellido && (typeof fields.apellido !== 'string' || fields.apellido.length > 100)) ||
        (fields.email && (typeof fields.email !== 'string' || fields.email.length > 100))) {
      addToast('Los campos deben ser texto y no exceder los 100 caracteres.', 'error');
      return;
    }
    // SECURITY: Prevent Mass Assignment by explicitly extracting only permitted fields
    const permittedFields = {
      ...(fields.nombre !== undefined && { nombre: fields.nombre }),
      ...(fields.apellido !== undefined && { apellido: fields.apellido }),
      ...(fields.email !== undefined && { email: fields.email })
    };

    setUser(prev => ({ ...prev, ...permittedFields }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...permittedFields } : u));
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
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || currentPassword.length > 100 || newPassword.length > 100) {
      addToast('Las contraseñas no son válidas o exceden el límite de longitud.', 'error');
      return false;
    }
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
    if (!data || typeof data !== 'object') {
      addToast('Datos de alumno inválidos.', 'error');
      return;
    }
    const { password, nombre, apellido, email, fechaNacimiento, cursoId } = data;
    if (typeof password !== 'string' || password.length > 100 || password.length < 6) {
      addToast('Contraseña inválida. Mínimo 6 caracteres, máximo 100.', 'error');
      return;
    }
    if ((nombre && (typeof nombre !== 'string' || nombre.length > 100)) ||
        (apellido && (typeof apellido !== 'string' || apellido.length > 100)) ||
        (email && (typeof email !== 'string' || email.length > 100))) {
      addToast('Los campos del alumno no deben exceder los 100 caracteres.', 'error');
      return;
    }
    const alumnoData = { nombre, apellido, email, fechaNacimiento, cursoId };
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
