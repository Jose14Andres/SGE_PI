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

const simulateProfesorDashboardRender = (data, selectedMateria) => {
  const { user, materias, alumnos } = data;

  const misMaterias = materias.filter(m => m.profesorId === user.profesorId);
  const misCursoIds = [...new Set(misMaterias.map(m => m.cursoId))];
  const todosMisAlumnos = alumnos.filter(a => misCursoIds.includes(a.cursoId));

  const materiaElegida = misMaterias.find(m => m.id === selectedMateria);
  const alumnosDelCurso = materiaElegida ? alumnos.filter(a => a.cursoId === materiaElegida.cursoId) : todosMisAlumnos;

  return { misMaterias, todosMisAlumnos, alumnosDelCurso };
};

const runBenchmark = () => {
  const data = generarMockData();
  const selectedMateria = 'mat-10';

  // Warmup
  for(let i = 0; i < 10; i++) {
    simulateProfesorDashboardRender(data, selectedMateria);
  }

  const start = performance.now();
  for(let i = 0; i < 100; i++) {
    simulateProfesorDashboardRender(data, selectedMateria);
  }
  const end = performance.now();

  console.log(`Tiempo para 100 renders simulados: ${end - start} ms`);
};

runBenchmark();
