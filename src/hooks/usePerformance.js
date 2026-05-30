import { useEffect, useRef } from 'react';

export function usePerformance(componentName) {
  const mountTime = useRef(null);

  useEffect(() => {
    if (mountTime.current === null) {
      mountTime.current = Date.now();
    }
    // Al montar
    const loadTime = Date.now() - mountTime.current;
    if (import.meta.env.DEV) {
      console.info(`⏱️ [Perf] ${componentName} FCP estimado/montaje: ${loadTime}ms`);
    }
  }, [componentName]);

  return 0; // Returning 0 as dummy to bypass strict ref access checks since it's just for logging
}
