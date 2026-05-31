const fs = require('fs');

// Auth.jsx
let auth = fs.readFileSync('src/components/Auth.jsx', 'utf8');
auth = auth.replace(
  `  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(\`Demasiados intentos. Por favor espere \${remainingSeconds} segundos.\`);
      return;
    } else if (lockoutUntil && Date.now() >= lockoutUntil) {
      setLockoutUntil(null);
      setFailedAttempts(0);
    if (!email || (!password && !import.meta.env.DEV)) { setError('Por favor complete todos los campos.'); return; }

    // Security: Check if user is locked out due to too many failed attempts
    if (isLockedOut) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(\`Demasiados intentos. Intente nuevamente en \${remainingSeconds} segundos.\`);
      return;
    }

    if (!email || !password) { setError('Por favor complete todos los campos.'); return; }

    const result = await onLogin(email, password, role);
    if (!result) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        setLockoutUntil(Date.now() + 30000); // 30 segundos de bloqueo
        setError('Demasiados intentos fallidos. Cuenta bloqueada temporalmente.');
      } else {
        setError('Credenciales incorrectas o rol no coincide.');
      }
      setPassword(''); // Seguridad: limpiar input password en error
    } else {
      setFailedAttempts(0);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setLockoutUntil(Date.now() + 30000); // Lockout for 30 seconds
        setError('Demasiados intentos fallidos. Cuenta bloqueada por 30 segundos.');
      } else {
        setError(\`Credenciales incorrectas o rol no coincide. Intentos restantes: \${5 - newAttempts}\`);
      }

      setPassword(''); // Seguridad: limpiar input password en error
    } else {
      // Reset on success
      setAttempts(0);
      setLockoutUntil(null);
    }
  };`,
  `  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLockedOut) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(\`Demasiados intentos. Intente nuevamente en \${remainingSeconds} segundos.\`);
      return;
    }

    if (!email || (!password && !import.meta.env.DEV)) { setError('Por favor complete todos los campos.'); return; }

    const result = await onLogin(email, password, role);
    if (!result) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setLockoutUntil(Date.now() + 30000); // Lockout for 30 seconds
        setError('Demasiados intentos fallidos. Cuenta bloqueada temporalmente.');
      } else {
        setError(\`Credenciales incorrectas o rol no coincide. Intentos restantes: \${5 - newAttempts}\`);
      }
      setPassword(''); // Seguridad: limpiar input password en error
    } else {
      // Reset on success
      setAttempts(0);
      setLockoutUntil(null);
    }
  };`
);

auth = auth.replace(
  `  // Seguridad: Control de intentos fallidos para mitigar ataques de fuerza bruta`,
  ``
);

fs.writeFileSync('src/components/Auth.jsx', auth);

// Dashboards.jsx
let dash = fs.readFileSync('src/components/Dashboards.jsx', 'utf8');
dash = dash.replace(
  `  // Consolidar todos los usuarios
  const todosLosUsuarios = useMemo(() => {
    // ⚡ Bolt: O(1) Map Lookups for Related Entities
    const cursosById = Object.fromEntries(cursos.map(c => [c.id, c]));
    const arr = [];
    // ⚡ Bolt: O(1) Map Lookups for Related Entities
    const cursosById = Object.fromEntries(cursos.map(c => [c.id, c]));
    alumnos.forEach(a => {
      const c = cursosById[a.cursoId];
      arr.push({ ...a, rol: 'Alumno', carrera: c?.carrera || '—', nivel: c?.nivel || '—' });
    });
    profesores.forEach(p => {
      arr.push({ ...p, rol: 'Profesor', carrera: '—', nivel: '—' });
    });
    return arr;
  }, [alumnos, profesores, cursos]);`,
  `  // Consolidar todos los usuarios
  const todosLosUsuarios = useMemo(() => {
    // ⚡ Bolt: O(1) Map Lookups for Related Entities
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
  }, [alumnos, profesores, cursos]);`
);

dash = dash.replace(
  `  // ⚡ Performance optimization: Memoize O(N) lookup for static prop references.
  // Helps prevent expensive recalculation on every render (e.g. tab changes).
  const { misMaterias, todosMisAlumnos } = useMemo(() => {
    const mMaterias = materias.filter(m => m.profesorId === user.profesorId);
    const misCursoIds = [...new Set(mMaterias.map(m => m.cursoId))];
    const todosAlumnos = alumnos.filter(a => misCursoIds.includes(a.cursoId));
    return { misMaterias: mMaterias, todosMisAlumnos: todosAlumnos };
  }, [materias, alumnos, user.profesorId]);
  // Optimization: Memoize to avoid O(N*M) filters and re-evaluations on every render.
  const misMaterias = useMemo(() => materias.filter(m => m.profesorId === user.profesorId), [materias, user.profesorId]);

  const todosMisAlumnos = useMemo(() => {
    const cursoIdsSet = new Set(misMaterias.map(m => m.cursoId));
    return alumnos.filter(a => cursoIdsSet.has(a.cursoId));
  }, [alumnos, misMaterias]);
  // ⚡ Performance Optimization: Memoized O(N) filters and mappings to prevent expensive recalculations on every render (e.g. when switching tabs).
  const misMaterias = useMemo(() => materias.filter(m => m.profesorId === user.profesorId), [materias, user.profesorId]);
  const misCursoIds = useMemo(() => [...new Set(misMaterias.map(m => m.cursoId))], [misMaterias]);
  const todosMisAlumnos = useMemo(() => alumnos.filter(a => misCursoIds.includes(a.cursoId)), [alumnos, misCursoIds]);`,
  `  // ⚡ Performance optimization: Memoize O(N) lookup for static prop references.
  // Helps prevent expensive recalculation on every render (e.g. tab changes).
  const { misMaterias, todosMisAlumnos } = useMemo(() => {
    const mMaterias = materias.filter(m => m.profesorId === user.profesorId);
    const misCursoIdsSet = new Set(mMaterias.map(m => m.cursoId));
    const todosAlumnos = alumnos.filter(a => misCursoIdsSet.has(a.cursoId));
    return { misMaterias: mMaterias, todosMisAlumnos: todosAlumnos };
  }, [materias, alumnos, user.profesorId]);`
);

dash = dash.replace(
  `  // ⚡ Performance optimization: Memoize derived state from selected materia.
  const { materiaElegida, alumnosDelCurso } = useMemo(() => {
    const materia = misMaterias.find(m => m.id === selectedMateria);
    const delCurso = materia ? alumnos.filter(a => a.cursoId === materia.cursoId) : todosMisAlumnos;
    return { materiaElegida: materia, alumnosDelCurso: delCurso };
  }, [misMaterias, selectedMateria, alumnos, todosMisAlumnos]);
  // Optimization: O(1) map lookup instead of multiple .find() calls
  const materiasById = useMemo(() => Object.fromEntries(misMaterias.map(m => [m.id, m])), [misMaterias]);
  const materiaElegida = materiasById[selectedMateria];

  const alumnosDelCurso = useMemo(() => (
    materiaElegida ? alumnos.filter(a => a.cursoId === materiaElegida.cursoId) : todosMisAlumnos
  ), [alumnos, materiaElegida, todosMisAlumnos]);
  const materiaElegida = useMemo(() => misMaterias.find(m => m.id === selectedMateria), [misMaterias, selectedMateria]);
  const alumnosDelCurso = useMemo(() =>
    materiaElegida ? alumnos.filter(a => a.cursoId === materiaElegida.cursoId) : todosMisAlumnos,
  [materiaElegida, alumnos, todosMisAlumnos]);`,
  `  // ⚡ Performance optimization: Memoize derived state from selected materia.
  const { materiaElegida, alumnosDelCurso } = useMemo(() => {
    const materia = misMaterias.find(m => m.id === selectedMateria);
    const delCurso = materia ? alumnos.filter(a => a.cursoId === materia.cursoId) : todosMisAlumnos;
    return { materiaElegida: materia, alumnosDelCurso: delCurso };
  }, [misMaterias, selectedMateria, alumnos, todosMisAlumnos]);`
);

fs.writeFileSync('src/components/Dashboards.jsx', dash);
