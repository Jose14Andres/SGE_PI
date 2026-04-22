import { useEffect, useRef } from 'react';

/**
 * Hook de monitoreo de desempeño (EDM - Performance Monitoring ISO 38500).
 * Registra tiempos de carga iniciales y cantidad de re-renderizados innecesarios.
 * @param {string} componentName Identificador del componente a monitorear.
 */
export function usePerformance(componentName) {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    // Al montar
    const loadTime = Date.now() - mountTime.current;
    if (import.meta.env.DEV) {
      console.info(`⏱️ [Perf] ${componentName} FCP estimado/montaje: ${loadTime}ms`);
    }
  }, [componentName]);

  useEffect(() => {
    renderCount.current++;
    if (import.meta.env.DEV && renderCount.current > 2) {
      console.warn(`🔄 [Perf Warning] ${componentName} re-renderizado excesivo: ${renderCount.current} veces.`);
    }
  });

  return renderCount.current;
}
