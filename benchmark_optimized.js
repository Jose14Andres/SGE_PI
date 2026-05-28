import { performance } from 'perf_hooks';

const generarMockData = () => {
  const user = { nombre: 'Test', apellido: 'Prof', profesorId: 'prof-1' };
  const materias = [];
  const alumnos = [];

  // 500 materias
  for (let i = 0; i < 500; i++) {
    materias.push({
      id: `mat-${i}`,
      nombre: `Materia ${i}`,
      profesorId: 'prof-1',
      cursoId: `cur-${i % 50}`
    });
  }

  // 100,000 alumnos
  for (let i = 0; i < 100000; i++) {
    alumnos.push({
      id: `alu-${i}`,
      nombre: `Alumno ${i}`,
      cursoId: `cur-${i % 100}`
    });
  }

  return { user, materias, alumnos };
};

const simulateProfesorDashboardRenderOptimized = (data, selectedMateria) => {
  const { user, materias, alumnos } = data;

  // Optimizando con map / memoization - O(N) map lookup (simulando useMemo)
  // En React usaremos useMemo

  // Para el benchmark, calcularemos esto cada vez porque es lo que pasa si no hay useMemo.
  // Pero lo optimizaremos para usar useMemo en el componente real.

  // En un render real, useMemo(..., [materias, user.profesorId]) cachearía esto
  const misMaterias = materias.filter(m => m.profesorId === user.profesorId);

  // useMemo(..., [misMaterias])
  const misMateriaIds = new Set(misMaterias.map(m => m.cursoId));

  // useMemo(..., [alumnos, misMateriaIds])
  const todosMisAlumnos = alumnos.filter(a => misMateriaIds.has(a.cursoId));

  // O(1) lookup
  // useMemo(..., [misMaterias])
  const materiasById = Object.fromEntries(misMaterias.map(m => [m.id, m]));

  const materiaElegida = materiasById[selectedMateria];

  // useMemo(..., [alumnos, materiaElegida, todosMisAlumnos])
  const alumnosDelCurso = materiaElegida ? alumnos.filter(a => a.cursoId === materiaElegida.cursoId) : todosMisAlumnos;

  return { misMaterias, todosMisAlumnos, alumnosDelCurso };
};

const runBenchmark = () => {
  const data = generarMockData();
  const selectedMateria = 'mat-10';

  // Warmup
  for(let i = 0; i < 10; i++) {
    simulateProfesorDashboardRenderOptimized(data, selectedMateria);
  }

  const start = performance.now();
  for(let i = 0; i < 100; i++) {
    simulateProfesorDashboardRenderOptimized(data, selectedMateria);
  }
  const end = performance.now();

  console.log(`Tiempo para 100 renders optimizados (sin memo, solo Set y Object.fromEntries): ${end - start} ms`);
};

runBenchmark();
