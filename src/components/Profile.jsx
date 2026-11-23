import { useState, useRef } from 'react';

export default function Profile({ user, onUpdateAvatar, onUpdateProfile, onChangePassword }) {
  const [preview, setPreview] = useState(user.avatar || null);
  const [avatarSaved, setAvatarSaved] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileRef = useRef();

  // Edit profile state
  const [editMode, setEditMode] = useState(false);
  const [profileFields, setProfileFields] = useState({ nombre: user.nombre, apellido: user.apellido, email: user.email });
  const [profileError, setProfileError] = useState('');

  // Change password state
  const [pwMode, setPwMode] = useState(false);
  const [pwFields, setPwFields] = useState({ current: '', nuevo: '', confirmar: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      setAvatarError('Por favor selecciona una imagen válida.');
      return;
    }
    // SECURITY: Limit file size to 5MB to prevent Client-Side DoS and excessive memory usage
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('El archivo es demasiado grande. El límite es de 5MB.');
      return;
    }
    setAvatarError('');
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); setAvatarSaved(false); };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = () => { onUpdateAvatar(preview); setAvatarSaved(true); };

  const handleSaveProfile = () => {
    const { nombre, apellido, email } = profileFields;
    if (!nombre.trim() || !apellido.trim() || !email.trim()) {
      setProfileError('Todos los campos son obligatorios.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setProfileError('El email no tiene un formato válido.'); return;
    }
    setProfileError('');
    onUpdateProfile({ nombre: nombre.trim(), apellido: apellido.trim(), email: email.trim() });
    setEditMode(false);
  };

  const handleSavePassword = async () => {
    setPwSuccess(false);
    const { current, nuevo, confirmar } = pwFields;
    if (!current || !nuevo || !confirmar) { setPwError('Completa todos los campos.'); return; }
    if (nuevo.length < 6) { setPwError('La nueva contraseña debe tener al menos 6 caracteres.'); return; }
    if (nuevo !== confirmar) { setPwError('Las contraseñas nuevas no coinciden.'); return; }
    try {
      const ok = await onChangePassword(current, nuevo);
      if (!ok) { setPwError('Credenciales incorrectas o rol no válido.'); return; }
      setPwError('');
      setPwSuccess(true);
      setPwFields({ current: '', nuevo: '', confirmar: '' });
      setPwMode(false);
    } catch {
      setPwError('Credenciales incorrectas o rol no válido.');
    }
  };

  const ROLE_BADGE = {
    Administrador: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    Secretaria: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Profesor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Alumno: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };

  const inputCls = "w-full bg-netflix-bg border border-netflix-border rounded-lg px-3 py-2 text-sm text-netflix-primary placeholder-netflix-muted focus:outline-none focus:border-netflix-secondary focus:ring-1 focus:ring-netflix-secondary";

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-netflix-primary">Mi Perfil</h1>
        <p className="text-netflix-secondary text-sm mt-1">Gestiona tu información personal</p>
      </div>

      {/* Avatar */}
      <div className="bg-netflix-surface backdrop-blur-sm border border-netflix-border rounded-2xl p-6 space-y-5">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {preview
              ? <img src={preview} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-netflix-border shadow-lg shadow-black/50" />
              : <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-netflix-border flex items-center justify-center text-2xl font-bold text-netflix-primary font-serif">
                  {user.nombre?.[0]}{user.apellido?.[0]}
                </div>
            }
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-netflix-red border-2 border-netflix-border flex items-center justify-center text-netflix-primary hover:bg-netflix-red-dark transition-colors shadow-lg"
              title="Cambiar foto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button onClick={() => fileRef.current?.click()} className="text-sm text-netflix-primary hover:text-netflix-primary border border-netflix-border hover:border-white/30 px-4 py-1.5 rounded-lg transition-all">
            Subir foto de perfil
          </button>
        </div>

        {preview && preview !== user.avatar && (
          <button onClick={handleSaveAvatar} className="w-full py-2.5 bg-netflix-red hover:bg-netflix-red-dark active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white text-netflix-primary rounded-xl text-sm font-medium transition-colors shadow-lg shadow-black/50">
            Guardar foto de perfil
          </button>
        )}
        {avatarError && <p className="text-center text-red-400 text-sm">{avatarError}</p>}
        {avatarSaved && <p className="text-center text-emerald-400 text-sm">✓ Foto actualizada</p>}
      </div>

      {/* Datos personales */}
      <div className="bg-netflix-surface backdrop-blur-sm border border-netflix-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-netflix-primary font-semibold text-sm">Datos personales</h2>
          {!editMode && (
            <button onClick={() => { setEditMode(true); setProfileError(''); setProfileFields({ nombre: user.nombre, apellido: user.apellido, email: user.email }); }}
              className="text-xs text-netflix-primary hover:text-netflix-primary border border-netflix-border hover:border-white/30 px-3 py-1 rounded-lg transition-all">
              Editar
            </button>
          )}
        </div>

        {editMode ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-netflix-secondary mb-1 block">Nombre</label>
              <input className={inputCls} value={profileFields.nombre} onChange={e => setProfileFields(p => ({ ...p, nombre: e.target.value }))} maxLength={100} />
            </div>
            <div>
              <label className="text-xs text-netflix-secondary mb-1 block">Apellido</label>
              <input className={inputCls} value={profileFields.apellido} onChange={e => setProfileFields(p => ({ ...p, apellido: e.target.value }))} maxLength={100} />
            </div>
            <div>
              <label className="text-xs text-netflix-secondary mb-1 block">Email</label>
              <input className={inputCls} type="email" value={profileFields.email} onChange={e => setProfileFields(p => ({ ...p, email: e.target.value }))} maxLength={100} />
            </div>
            {profileError && <p className="text-red-400 text-xs">{profileError}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={handleSaveProfile} className="flex-1 py-2 bg-netflix-red hover:bg-netflix-red-dark active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white text-netflix-primary rounded-lg text-sm font-medium transition-colors">
                Guardar cambios
              </button>
              <button onClick={() => { setEditMode(false); setProfileError(''); }} className="flex-1 py-2 border border-netflix-border hover:border-white/20 text-netflix-secondary rounded-lg text-sm transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <dt className="text-netflix-muted w-24 shrink-0">Nombre:</dt>
              <dd className="text-netflix-primary font-medium">{user.nombre} {user.apellido}</dd>
            </div>
            <div className="flex items-center gap-3">
              <dt className="text-netflix-muted w-24 shrink-0">Email:</dt>
              <dd className="text-netflix-primary">{user.email}</dd>
            </div>
            <div className="flex items-center gap-3">
              <dt className="text-netflix-muted w-24 shrink-0">Rol:</dt>
              <dd>
                <span className={`inline-block text-xs px-3 py-1 rounded-full border font-medium ${ROLE_BADGE[user.role]}`}>
                  {user.role}
                </span>
              </dd>
            </div>
          </dl>
        )}
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-netflix-surface backdrop-blur-sm border border-netflix-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-netflix-primary font-semibold text-sm">Contraseña</h2>
          {!pwMode && (
            <button onClick={() => { setPwMode(true); setPwError(''); setPwSuccess(false); setPwFields({ current: '', nuevo: '', confirmar: '' }); }}
              className="text-xs text-netflix-primary hover:text-netflix-primary border border-netflix-border hover:border-white/30 px-3 py-1 rounded-lg transition-all">
              Cambiar
            </button>
          )}
        </div>

        {pwMode ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-netflix-secondary mb-1 block">Contraseña actual</label>
              <input className={inputCls} type="password" placeholder="••••••••" value={pwFields.current} onChange={e => setPwFields(p => ({ ...p, current: e.target.value }))} maxLength={100} />
            </div>
            <div>
              <label className="text-xs text-netflix-secondary mb-1 block">Nueva contraseña</label>
              <input className={inputCls} type="password" placeholder="Mínimo 6 caracteres" value={pwFields.nuevo} onChange={e => setPwFields(p => ({ ...p, nuevo: e.target.value }))} maxLength={100} />
            </div>
            <div>
              <label className="text-xs text-netflix-secondary mb-1 block">Confirmar nueva contraseña</label>
              <input className={inputCls} type="password" placeholder="Repite la nueva contraseña" value={pwFields.confirmar} onChange={e => setPwFields(p => ({ ...p, confirmar: e.target.value }))} maxLength={100} />
            </div>
            {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={handleSavePassword} className="flex-1 py-2 bg-netflix-red hover:bg-netflix-red-dark active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white text-netflix-primary rounded-lg text-sm font-medium transition-colors">
                Actualizar contraseña
              </button>
              <button onClick={() => { setPwMode(false); setPwError(''); }} className="flex-1 py-2 border border-netflix-border hover:border-white/20 text-netflix-secondary rounded-lg text-sm transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-netflix-secondary text-sm">••••••••</p>
        )}
        {pwSuccess && <p className="text-emerald-400 text-sm">✓ Contraseña actualizada correctamente</p>}
      </div>
    </div>
  );
}
