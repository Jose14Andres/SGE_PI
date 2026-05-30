const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

app = app.replace(
  `  const handleLogin = useCallback(async (email, password, role) => {
    let found;
    if (import.meta.env.DEV) {
      // En modo DEV, los usuarios de prueba no tienen contraseña
      found = users.find(u => u.email === email && u.role === role);
    } else {
      const hashedPassword = await hashPassword(password);
      found = users.find(u => u.email === email && u.password === hashedPassword && u.role === role);
    }
    const hashedPassword = await hashPassword(password || '');
    const isDevBypass = import.meta.env.DEV && !password && DEMO_USERS.some(d => d.email === email && d.role === role);
    const found = users.find(u => u.email === email && (u.password === hashedPassword || isDevBypass) && u.role === role);
    if (typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string') return false;
    if (email.length > 100 || password.length > 100 || password.length === 0) return false;
    const ROLES = ['Administrador', 'Secretaria', 'Profesor', 'Alumno'];
    if (!ROLES.includes(role)) return false;

    const hashedPassword = await hashPassword(password);
    const found = users.find(u => u.email === email && u.password === hashedPassword && u.role === role);
    if (!found) return false;`,
  `  const handleLogin = useCallback(async (email, password, role) => {
    if (typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string') return false;
    if (email.length > 100 || password.length > 100 || password.length === 0) return false;
    const ROLES = ['Administrador', 'Secretaria', 'Profesor', 'Alumno'];
    if (!ROLES.includes(role)) return false;

    let found;
    const isDevBypass = import.meta.env.DEV && !password && DEMO_USERS.some(d => d.email === email && d.role === role);
    if (isDevBypass) {
      found = users.find(u => u.email === email && u.role === role);
    } else {
      const hashedPassword = await hashPassword(password || '');
      found = users.find(u => u.email === email && u.password === hashedPassword && u.role === role);
    }

    if (!found) return false;`
);

app = app.replace(
  `  const handleUpdateProfile = useCallback((fields) => {
    // SECURITY: Prevent Mass Assignment by explicitly extracting only permitted fields
    const allowedFields = {};
    if (fields.nombre !== undefined) allowedFields.nombre = fields.nombre;
    if (fields.apellido !== undefined) allowedFields.apellido = fields.apellido;
    if (fields.email !== undefined) allowedFields.email = fields.email;

    setUser(prev => ({ ...prev, ...allowedFields }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...allowedFields } : u));
    const { nombre, apellido, email } = fields;
    const safeFields = {
    // SECURITY: Prevenir mass assignment vulnerabilidad extrayendo solo campos permitidos
    const { nombre, apellido, email } = fields;
    const permittedFields = {
      ...(nombre !== undefined && { nombre }),
      ...(apellido !== undefined && { apellido }),
      ...(email !== undefined && { email })
    };
    setUser(prev => ({ ...prev, ...safeFields }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...safeFields } : u));

    setUser(prev => ({ ...prev, ...permittedFields }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...permittedFields } : u));
    // 🛡️ Sentinel: Prevent mass assignment vulnerability by extracting only allowed fields
    const safeFields = {};
    if (fields.nombre !== undefined) safeFields.nombre = fields.nombre;
    if (fields.apellido !== undefined) safeFields.apellido = fields.apellido;
    if (fields.email !== undefined) safeFields.email = fields.email;

    setUser(prev => ({ ...prev, ...safeFields }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...safeFields } : u));
    const permittedFields = {
      nombre: fields.nombre,
      apellido: fields.apellido,
      email: fields.email
    };

    // Filter out undefined values to not overwrite existing values with undefined if they were not provided
    const updatePayload = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(permittedFields).filter(([_, v]) => v !== undefined)
    );

    setUser(prev => ({ ...prev, ...updatePayload }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...updatePayload } : u));
    // Sync con alumnos/profesores si corresponde
    if (user.role === 'Alumno') {
      setAlumnos(prev => prev.map(a => a.email === user.email
        ? { ...a, ...permittedFields }
        : a));
    }
    if (user.role === 'Profesor') {
      setProfesores(prev => prev.map(p => p.email === user.email
        ? { ...p, ...permittedFields }
        : p));
    }`,
  `  const handleUpdateProfile = useCallback((fields) => {
    // SECURITY: Prevent Mass Assignment by explicitly extracting only permitted fields
    const permittedFields = {
      ...(fields.nombre !== undefined && { nombre: fields.nombre }),
      ...(fields.apellido !== undefined && { apellido: fields.apellido }),
      ...(fields.email !== undefined && { email: fields.email })
    };

    setUser(prev => ({ ...prev, ...permittedFields }));
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...permittedFields } : u));

    // Sync con alumnos/profesores si corresponde
    if (user.role === 'Alumno') {
      setAlumnos(prev => prev.map(a => a.email === user.email
        ? { ...a, ...permittedFields }
        : a));
    }
    if (user.role === 'Profesor') {
      setProfesores(prev => prev.map(p => p.email === user.email
        ? { ...p, ...permittedFields }
        : p));
    }`
);

fs.writeFileSync('src/App.jsx', app);
