import { performance } from 'perf_hooks';

const generarMockData = () => {
  const user = { nombre: 'Test', apellido: 'Prof', profesorId: 'prof-1' };
  const materias = [];
  const alumnos = [];

  for (let i = 0; i < 500; i++) {
    materias.push({
      id: `mat-${i}`,
      nombre: `Materia ${i}`,
      profesorId: 'prof-1',
      cursoId: `cur-${i % 50}`
    });
  }

  for (let i = 0; i < 100000; i++) {
    alumnos.push({
      id: `alu-${i}`,
      nombre: `Alumno ${i}`,
      cursoId: `cur-${i % 100}`
    });
  }

  return { user, materias, alumnos };
};

// Simulando el comportamiento CON useMemo a nivel de React
class ComponentSimulator {
  constructor(data) {
    this.data = data;
    this.memoCache = {};
  }

  useMemo(factory, deps, key) {
    const cached = this.memoCache[key];
    if (cached) {
      // Very naive dependency check for simulation
      const depsChanged = deps.some((dep, i) => dep !== cached.deps[i]);
      if (!depsChanged) {
        return cached.value;
      }
    }

    const value = factory();
    this.memoCache[key] = { value, deps };
    return value;
  }

  render(selectedMateria) {
    const { user, materias, alumnos } = this.data;

    const misMaterias = this.useMemo(
      () => materias.filter(m => m.profesorId === user.profesorId),
      [materias, user.profesorId],
      'misMaterias'
    );

    const misCursoIdsSet = this.useMemo(
      () => new Set(misMaterias.map(m => m.cursoId)),
      [misMaterias],
      'misCursoIdsSet'
    );

    const todosMisAlumnos = this.useMemo(
      () => alumnos.filter(a => misCursoIdsSet.has(a.cursoId)),
      [alumnos, misCursoIdsSet],
      'todosMisAlumnos'
    );

    const materiaById = this.useMemo(
      () => Object.fromEntries(misMaterias.map(m => [m.id, m])),
      [misMaterias],
      'materiaById'
    );

    const materiaElegida = materiaById[selectedMateria];

    const alumnosDelCurso = this.useMemo(
      () => materiaElegida ? alumnos.filter(a => a.cursoId === materiaElegida.cursoId) : todosMisAlumnos,
      [alumnos, materiaElegida, todosMisAlumnos],
      'alumnosDelCurso'
    );

    return { misMaterias, todosMisAlumnos, alumnosDelCurso };
  }
}

const runBenchmark = () => {
  const data = generarMockData();
  const simulator = new ComponentSimulator(data);
  let selectedMateria = 'mat-10';

  // Render inicial (calcula todo)
  simulator.render(selectedMateria);

  const start = performance.now();
  // Simulamos 100 renders donde selectedMateria cambia
  for(let i = 0; i < 100; i++) {
    selectedMateria = `mat-${i % 50}`;
    simulator.render(selectedMateria);
  }
  const end = performance.now();

  console.log(`Tiempo para 100 renders con useMemo simulado (y cambiando selectedMateria): ${end - start} ms`);
};

runBenchmark();
