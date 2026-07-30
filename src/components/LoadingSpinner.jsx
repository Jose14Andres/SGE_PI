export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full animate-fade-in gap-4 h-full" role="status" aria-label="Cargando interfaz">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-[#111111]/50 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-transparent border-t-accent rounded-full animate-spin absolute inset-0"></div>
      </div>
      <p className="text-slate-500 text-xs font-medium animate-pulse uppercase tracking-widest">
        Cargando interfaz...
      </p>
    </div>
  );
}
