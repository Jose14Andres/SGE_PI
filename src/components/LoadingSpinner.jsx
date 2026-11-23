export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full animate-fade-in gap-4 h-full" role="status" aria-label="Cargando interfaz">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-netflix-border rounded-full"></div>
        <div className="w-12 h-12 border-4 border-transparent border-t-netflix-red rounded-full animate-spin absolute inset-0"></div>
      </div>
      <p className="text-netflix-muted text-xs font-medium animate-pulse uppercase tracking-widest">
        Cargando interfaz...
      </p>
    </div>
  );
}
