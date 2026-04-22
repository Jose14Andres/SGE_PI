import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary atrapó un error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-navy-950 text-slate-200 p-6" role="alert" aria-live="assertive">
          <div className="bg-navy-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white mb-2">Algo salió mal</h1>
            <p className="text-slate-400 text-sm mb-6">Hemos encontrado un error procesando la interfaz. Por favor recarga el sitio de forma segura.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-accent hover:bg-accent-light text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg"
            >
              Recargar Sitio
            </button>
            {import.meta.env.DEV && (
              <pre className="mt-6 text-left bg-navy-950 p-4 rounded-lg text-xs text-red-400 overflow-x-auto whitespace-pre-wrap">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
