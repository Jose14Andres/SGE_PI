const { performance } = require('perf_hooks');

const N_ALUMNOS = 10000;
const M_CURSOS = 500;
const P_PROFESORES = 1000;

const cursos = Array.from({ length: M_CURSOS }, (_, i) => ({ id: `c${i}`, carrera: `Carrera ${i}`, nivel: `Nivel ${i}` }));
const alumnos = Array.from({ length: N_ALUMNOS }, (_, i) => ({ id: `a${i}`, cursoId: `c${i % M_CURSOS}` }));
const profesores = Array.from({ length: P_PROFESORES }, (_, i) => ({ id: `p${i}` }));

function original() {
    const arr = [];
    alumnos.forEach(a => {
      const c = cursos.find(x => x.id === a.cursoId);
      arr.push({ ...a, rol: 'Alumno', carrera: c?.carrera || '—', nivel: c?.nivel || '—' });
    });
    profesores.forEach(p => {
      arr.push({ ...p, rol: 'Profesor', carrera: '—', nivel: '—' });
    });
    return arr;
}

function optimized() {
    // ⚡ Bolt: O(1) Map Lookups for Related Entities
    const cursosById = Object.fromEntries(cursos.map(c => [c.id, c]));
    const arr = [];
    alumnos.forEach(a => {
      const c = cursosById[a.cursoId];
      arr.push({ ...a, rol: 'Alumno', carrera: c?.carrera || '—', nivel: c?.nivel || '—' });
    });
    profesores.forEach(p => {
      arr.push({ ...p, rol: 'Profesor', carrera: '—', nivel: '—' });
    });
    return arr;
}

const t0 = performance.now();
for(let i = 0; i < 100; i++) original();
const t1 = performance.now();
console.log(`Original: ${(t1 - t0) / 100} ms per run`);

const t2 = performance.now();
for(let i = 0; i < 100; i++) optimized();
const t3 = performance.now();
console.log(`Optimized: ${(t3 - t2) / 100} ms per run`);
