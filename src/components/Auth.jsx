import { useState, useEffect } from 'react';

const ROLES = ['Administrador', 'Secretaria', 'Profesor', 'Alumno'];

/**
 * Componente de Autenticación y Autorización principal.
 * Accesible para: Usuarios no autenticados en el sistema (Capa pública).
 * Proporciona acceso a roles: Administrador, Secretaria, Profesor, Alumno.
 */
export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Administrador');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [isLockedOut, setIsLockedOut] = useState(false);

  useEffect(() => {
    if (lockoutUntil) {
      const checkLockout = () => {
        setIsLockedOut(Date.now() < lockoutUntil);
      };
      checkLockout();
      const interval = setInterval(checkLockout, 1000);
      return () => clearInterval(interval);
    } else {
      const immediate = setTimeout(() => {
        setIsLockedOut(false);
      }, 0);
      return () => clearTimeout(immediate);
    }
  }, [lockoutUntil]);

  useEffect(() => {
    if (lockoutUntil) {
      const now = Date.now();
      if (now < lockoutUntil) {
        const timeout = setTimeout(() => {
          setLockoutUntil(null);
          setFailedAttempts(0);
          setError('');
        }, lockoutUntil - now);
        return () => clearTimeout(timeout);
      } else {
        // Schedule state updates asynchronously to avoid cascading renders
        const immediate = setTimeout(() => {
          setLockoutUntil(null);
          setFailedAttempts(0);
        }, 0);
        return () => clearTimeout(immediate);
      }
    }
  }, [lockoutUntil]);

  // Seguridad: Control de intentos fallidos para mitigar ataques de fuerza bruta

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || (!password && !import.meta.env.DEV)) { setError('Por favor complete todos los campos.'); return; }

    // Security: Check if user is locked out due to too many failed attempts
    if (isLockedOut) {
      // Check if the lockout time has expired before checking isLockedOut
      let actuallyLockedOut = isLockedOut;
      if (lockoutUntil !== null && Date.now() >= lockoutUntil) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        actuallyLockedOut = false;
      }

      if (actuallyLockedOut) {
        const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
        setError(`Demasiados intentos. Intente nuevamente en ${remainingSeconds} segundos.`);
        return;
      }
    }

    if (!email || !password) { setError('Por favor complete todos los campos.'); return; }
    if (email.length > 100 || password.length > 100) { setError('Entrada demasiado larga.'); return; }

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
      // Reset on success
      setLockoutUntil(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0052CC]/20 border border-[#00E5FF]/30 mb-4">
            <svg className="w-8 h-8 text-[#00E5FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5v-7l9 5 9-5v7l-9 5z" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#F4F6F9] mb-1">SGE</h1>
          <p className="text-slate-400 text-sm">Sistema de Gestión Estudiantil</p>
        </div>

        {/* Card */}
        <div className="bg-[#1C2541]/80 backdrop-blur-md border border-[#E2E8F0]/20 rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(0,229,255,0.05)]">
          <h2 className="font-serif text-xl font-semibold text-[#F4F6F9] mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
              <input
                id="login-email"
                type="email"
                aria-label="Correo Electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                maxLength={100}
                placeholder="usuario@sge.edu"
                className="w-full bg-[#0B132B] border border-[#E2E8F0]/20 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <input
                id="login-password"
                type="password"
                aria-label="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                maxLength={100}
                placeholder="••••••••"
                className="w-full bg-[#0B132B] border border-[#E2E8F0]/20 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Rol</label>
              <select
                id="login-role"
                aria-label="Rol"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-[#0B132B] border border-[#E2E8F0]/20 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all text-sm"
              >
                {ROLES.map(r => <option key={r} value={r} className="bg-[#0B132B]">{r}</option>)}
              </select>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm animate-slide-in">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={isLockedOut}
              className={`w-full transition-colors py-3 rounded-lg font-medium text-[#F4F6F9] shadow-lg shadow-[#00E5FF]/20 text-sm ${
                isLockedOut
                  ? 'bg-gray-600 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-[#0052CC] to-[#00E5FF] hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#00E5FF] active:scale-[0.98]'
              }`}
            >
              {isLockedOut ? 'Bloqueado' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
