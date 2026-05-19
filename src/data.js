export const DEMO_USERS = [
  { id: 'u1', email: 'admin@sge.edu', password: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', role: 'Administrador', nombre: 'Carlos', apellido: 'Mendoza', avatar: null },
  { id: 'u2', email: 'secretaria@sge.edu', password: 'ee63c6506c68d4613b9553820393f22db66a1dbc9ba6dc5640df9fce741e6258', role: 'Secretaria', nombre: 'María', apellido: 'Paredes', avatar: null },
  { id: 'u3', email: 'profesor@sge.edu', password: '00624b02e1f9b996a3278f559d5d55313552ad2c0bafc82adfd975c12df61eaf', role: 'Profesor', nombre: 'Eduardo', apellido: 'Salgado', avatar: null },
  { id: 'u4', email: 'alumno@sge.edu', password: 'c1042ecc51482cef39f2e89e1273a35074db7f873f1ac6050efd546a9bceefc0', role: 'Alumno', nombre: 'Lucía', apellido: 'Torres', avatar: null },
];

// ── Helpers internos ─────────────────────────────────────────────────────────
const NIVEL_LABELS = ['1er','2do','3er','4to','5to','6to','7mo','8vo','9no','10mo','11vo','12vo'];
const nl = (n) => `${NIVEL_LABELS[n - 1]} Nivel`;

// ── Profesores ────────────────────────────────────────────────────────────────
export const INITIAL_PROFESORES = [
  { id: 'p1',  nombre: 'Eduardo',   apellido: 'Salgado',   email: 'e.salgado@sge.edu',   especialidad: 'Matemáticas y Cálculo' },
  { id: 'p2',  nombre: 'Rosa',      apellido: 'Villacís',  email: 'r.villacis@sge.edu',  especialidad: 'Física y Termodinámica' },
  { id: 'p3',  nombre: 'James',     apellido: 'Cooper',    email: 'j.cooper@sge.edu',    especialidad: 'Programación e Inteligencia Artificial' },
  { id: 'p4',  nombre: 'Andrés',    apellido: 'Ríos',      email: 'a.rios@sge.edu',      especialidad: 'Redes y Sistemas Operativos' },
  { id: 'p5',  nombre: 'Sofía',     apellido: 'Lozano',    email: 's.lozano@sge.edu',    especialidad: 'Psicología Clínica' },
  { id: 'p6',  nombre: 'Marco',     apellido: 'Aguirre',   email: 'm.aguirre@sge.edu',   especialidad: 'Neurociencias y Psicobiología' },
  { id: 'p7',  nombre: 'Elena',     apellido: 'Pinto',     email: 'e.pinto@sge.edu',     especialidad: 'Derecho Civil y Procesal' },
  { id: 'p8',  nombre: 'Roberto',   apellido: 'Álvarez',   email: 'r.alvarez@sge.edu',   especialidad: 'Derecho Penal y Constitucional' },
  { id: 'p9',  nombre: 'Patricia',  apellido: 'Guzmán',    email: 'p.guzman@sge.edu',    especialidad: 'Anatomía y Fisiología Humana' },
  { id: 'p10', nombre: 'Carlos',    apellido: 'Vásquez',   email: 'c.vasquez@sge.edu',   especialidad: 'Medicina Interna y Clínica' },
  { id: 'p11', nombre: 'Diana',     apellido: 'Morales',   email: 'd.morales@sge.edu',   especialidad: 'Marketing Digital y E-commerce' },
  { id: 'p12', nombre: 'Luis',      apellido: 'Bermúdez',  email: 'l.bermudez@sge.edu',  especialidad: 'Investigación de Mercados' },
  { id: 'p13', nombre: 'Natalia',   apellido: 'Espinoza',  email: 'n.espinoza@sge.edu',  especialidad: 'Estadística y Probabilidades' },
  { id: 'p14', nombre: 'Fernando',  apellido: 'Cárdenas',  email: 'f.cardenas@sge.edu',  especialidad: 'Química y Bioquímica' },
  { id: 'p15', nombre: 'Verónica',  apellido: 'Tapia',     email: 'v.tapia@sge.edu',     especialidad: 'Cirugía y Medicina de Urgencias' },
  { id: 'p16', nombre: 'Héctor',    apellido: 'Naranjo',   email: 'h.naranjo@sge.edu',   especialidad: 'Álgebra Lineal e Ingeniería de Software' },
  { id: 'p17', nombre: 'Carmen',    apellido: 'Suárez',    email: 'c.suarez@sge.edu',    especialidad: 'Psicología Educativa y Vocacional' },
  { id: 'p18', nombre: 'Rodrigo',   apellido: 'Méndez',    email: 'r.mendez@sge.edu',    especialidad: 'Derecho Laboral e Internacional' },
  { id: 'p19', nombre: 'Andrea',    apellido: 'Flores',    email: 'a.flores@sge.edu',    especialidad: 'Farmacología y Microbiología' },
  { id: 'p20', nombre: 'Gabriel',   apellido: 'Ortiz',     email: 'g.ortiz@sge.edu',     especialidad: 'Gestión Empresarial y Emprendimiento' },
];

// ── Secciones (Cursos) ────────────────────────────────────────────────────────
// Ingeniería:  8 niveles × secciones A, B, C
// Psicología:  8 niveles × secciones A, B
// Derecho:     8 niveles × secciones A, B
// Medicina:   12 niveles × secciones A, B
// Marketing:   8 niveles × secciones A, B

function generarCursos() {
  const carreras = [
    { codigo: 'ING', nombre: 'Ingeniería',  niveles: 8,  secciones: ['A','B','C'] },
    { codigo: 'PSI', nombre: 'Psicología',  niveles: 8,  secciones: ['A','B'] },
    { codigo: 'DER', nombre: 'Derecho',     niveles: 8,  secciones: ['A','B'] },
    { codigo: 'MED', nombre: 'Medicina',    niveles: 12, secciones: ['A','B'] },
    { codigo: 'MKT', nombre: 'Marketing',   niveles: 8,  secciones: ['A','B'] },
  ];
  const cursos = [];
  for (const c of carreras) {
    for (let n = 1; n <= c.niveles; n++) {
      for (const s of c.secciones) {
        cursos.push({
          id: `${c.codigo}-N${n}-${s}`,
          nombre: `${c.nombre} – ${nl(n)} ${s}`,
          carrera: c.nombre,
          nivel: nl(n),
          paralelo: s,
          anioLectivo: '2024-2025',
        });
      }
    }
  }
  return cursos;
}

export const INITIAL_CURSOS = generarCursos();

// ── Materias ──────────────────────────────────────────────────────────────────
// Las materias se asignan a la sección A de cada nivel (representativa).
// Cada materia incluye carrera, nivel y sección de referencia en su id.

const MATERIAS_ING = [
  // N1
  { nombre: 'Cálculo Diferencial',          codigo: 'ING-CAL1', creditos: 4, profId: 'p1'  },
  { nombre: 'Álgebra Lineal',               codigo: 'ING-ALG',  creditos: 4, profId: 'p16' },
  { nombre: 'Física I',                     codigo: 'ING-FIS1', creditos: 4, profId: 'p2'  },
  { nombre: 'Programación I',               codigo: 'ING-PRG1', creditos: 3, profId: 'p3'  },
  { nombre: 'Química General',              codigo: 'ING-QUI',  creditos: 3, profId: 'p14' },
  // N2
  { nombre: 'Cálculo Integral',             codigo: 'ING-CAL2', creditos: 4, profId: 'p1'  },
  { nombre: 'Física II',                    codigo: 'ING-FIS2', creditos: 4, profId: 'p2'  },
  { nombre: 'Programación II',              codigo: 'ING-PRG2', creditos: 3, profId: 'p3'  },
  { nombre: 'Estadística',                  codigo: 'ING-EST',  creditos: 3, profId: 'p13' },
  { nombre: 'Ingeniería de Software',       codigo: 'ING-SW',   creditos: 3, profId: 'p16' },
  // N3
  { nombre: 'Cálculo Multivariable',        codigo: 'ING-CAL3', creditos: 4, profId: 'p1'  },
  { nombre: 'Física III',                   codigo: 'ING-FIS3', creditos: 4, profId: 'p2'  },
  { nombre: 'Estructuras de Datos',         codigo: 'ING-ED',   creditos: 4, profId: 'p3'  },
  { nombre: 'Circuitos Eléctricos',         codigo: 'ING-CE',   creditos: 3, profId: 'p2'  },
  { nombre: 'Probabilidades',               codigo: 'ING-PRB',  creditos: 3, profId: 'p13' },
  // N4
  { nombre: 'Ecuaciones Diferenciales',     codigo: 'ING-ED2',  creditos: 4, profId: 'p1'  },
  { nombre: 'Sistemas Digitales',           codigo: 'ING-SD',   creditos: 4, profId: 'p4'  },
  { nombre: 'Base de Datos',                codigo: 'ING-BD',   creditos: 4, profId: 'p3'  },
  { nombre: 'Resistencia de Materiales',    codigo: 'ING-RM',   creditos: 3, profId: 'p2'  },
  { nombre: 'Redes de Computadoras',        codigo: 'ING-RED',  creditos: 3, profId: 'p4'  },
  // N5
  { nombre: 'Análisis Numérico',            codigo: 'ING-AN',   creditos: 4, profId: 'p1'  },
  { nombre: 'Microprocesadores',            codigo: 'ING-MIC',  creditos: 4, profId: 'p4'  },
  { nombre: 'Ingeniería de Requisitos',     codigo: 'ING-REQ',  creditos: 3, profId: 'p16' },
  { nombre: 'Termodinámica',                codigo: 'ING-TER',  creditos: 3, profId: 'p2'  },
  { nombre: 'Sistemas Operativos',          codigo: 'ING-SO',   creditos: 4, profId: 'p4'  },
  // N6
  { nombre: 'Inteligencia Artificial',      codigo: 'ING-IA',   creditos: 4, profId: 'p3'  },
  { nombre: 'Diseño de Software',           codigo: 'ING-DS',   creditos: 4, profId: 'p16' },
  { nombre: 'Control Automático',           codigo: 'ING-CA',   creditos: 3, profId: 'p2'  },
  { nombre: 'Gestión de Proyectos TI',      codigo: 'ING-GP',   creditos: 3, profId: 'p20' },
  { nombre: 'Comunicaciones Digitales',     codigo: 'ING-COM',  creditos: 3, profId: 'p4'  },
  // N7
  { nombre: 'Aprendizaje de Máquina',       codigo: 'ING-ML',   creditos: 4, profId: 'p3'  },
  { nombre: 'Seguridad Informática',        codigo: 'ING-SEG',  creditos: 4, profId: 'p4'  },
  { nombre: 'Administración de Redes',      codigo: 'ING-AR',   creditos: 3, profId: 'p4'  },
  { nombre: 'Robótica',                     codigo: 'ING-ROB',  creditos: 3, profId: 'p2'  },
  { nombre: 'Ética Profesional',            codigo: 'ING-ETI',  creditos: 2, profId: 'p20' },
  // N8
  { nombre: 'Proyecto de Titulación I',     codigo: 'ING-TIT1', creditos: 6, profId: 'p16' },
  { nombre: 'Emprendimiento Tecnológico',   codigo: 'ING-EMP',  creditos: 3, profId: 'p20' },
  { nombre: 'Sistemas Embebidos',           codigo: 'ING-SE',   creditos: 4, profId: 'p4'  },
  { nombre: 'Auditoría de TI',              codigo: 'ING-AUD',  creditos: 3, profId: 'p3'  },
  { nombre: 'Legislación Informática',      codigo: 'ING-LEG',  creditos: 2, profId: 'p8'  },
];

const MATERIAS_PSI = [
  // N1
  { nombre: 'Introducción a la Psicología', codigo: 'PSI-INT',  creditos: 4, profId: 'p5'  },
  { nombre: 'Biología General',             codigo: 'PSI-BIO',  creditos: 3, profId: 'p14' },
  { nombre: 'Estadística Básica',           codigo: 'PSI-EST',  creditos: 3, profId: 'p13' },
  { nombre: 'Sociología',                   codigo: 'PSI-SOC',  creditos: 3, profId: 'p20' },
  { nombre: 'Historia de la Psicología',    codigo: 'PSI-HIS',  creditos: 3, profId: 'p5'  },
  // N2
  { nombre: 'Psicología General',           codigo: 'PSI-GEN',  creditos: 4, profId: 'p5'  },
  { nombre: 'Neurociencias',                codigo: 'PSI-NEU',  creditos: 4, profId: 'p6'  },
  { nombre: 'Estadística Inferencial',      codigo: 'PSI-EST2', creditos: 3, profId: 'p13' },
  { nombre: 'Metodología de Investigación', codigo: 'PSI-MET',  creditos: 3, profId: 'p6'  },
  { nombre: 'Teorías de la Personalidad',   codigo: 'PSI-PER',  creditos: 4, profId: 'p5'  },
  // N3
  { nombre: 'Psicología del Desarrollo I',  codigo: 'PSI-DES1', creditos: 4, profId: 'p5'  },
  { nombre: 'Psicología Social',            codigo: 'PSI-SOC2', creditos: 4, profId: 'p6'  },
  { nombre: 'Psicobiología',                codigo: 'PSI-BIO2', creditos: 3, profId: 'p6'  },
  { nombre: 'Evaluación Psicológica I',     codigo: 'PSI-EVA1', creditos: 4, profId: 'p5'  },
  { nombre: 'Ética Profesional',            codigo: 'PSI-ETI',  creditos: 2, profId: 'p20' },
  // N4
  { nombre: 'Psicología del Desarrollo II', codigo: 'PSI-DES2', creditos: 4, profId: 'p5'  },
  { nombre: 'Psicopatología I',             codigo: 'PSI-PAT1', creditos: 4, profId: 'p5'  },
  { nombre: 'Evaluación Psicológica II',    codigo: 'PSI-EVA2', creditos: 4, profId: 'p6'  },
  { nombre: 'Psicología Cognitiva',         codigo: 'PSI-COG',  creditos: 4, profId: 'p6'  },
  { nombre: 'Orientación Vocacional',       codigo: 'PSI-VOC',  creditos: 3, profId: 'p17' },
  // N5
  { nombre: 'Psicología Clínica I',         codigo: 'PSI-CLI1', creditos: 4, profId: 'p5'  },
  { nombre: 'Psicopatología II',            codigo: 'PSI-PAT2', creditos: 4, profId: 'p5'  },
  { nombre: 'Neuropsicología',              codigo: 'PSI-NPS',  creditos: 4, profId: 'p6'  },
  { nombre: 'Psicología Educativa',         codigo: 'PSI-EDU',  creditos: 3, profId: 'p17' },
  { nombre: 'Psicodiagnóstico',             codigo: 'PSI-DIG',  creditos: 4, profId: 'p5'  },
  // N6
  { nombre: 'Psicología Clínica II',        codigo: 'PSI-CLI2', creditos: 4, profId: 'p5'  },
  { nombre: 'Psicoterapias',                codigo: 'PSI-TER',  creditos: 4, profId: 'p5'  },
  { nombre: 'Rehabilitación Psicológica',   codigo: 'PSI-REH',  creditos: 4, profId: 'p6'  },
  { nombre: 'Psicología Organizacional',    codigo: 'PSI-ORG',  creditos: 3, profId: 'p17' },
  { nombre: 'Investigación Psicológica',    codigo: 'PSI-INV',  creditos: 3, profId: 'p13' },
  // N7
  { nombre: 'Práctica Clínica I',           codigo: 'PSI-PRC1', creditos: 6, profId: 'p5'  },
  { nombre: 'Psicología Comunitaria',       codigo: 'PSI-COM',  creditos: 3, profId: 'p17' },
  { nombre: 'Salud Mental',                 codigo: 'PSI-SM',   creditos: 4, profId: 'p6'  },
  { nombre: 'Intervención en Crisis',       codigo: 'PSI-CRI',  creditos: 3, profId: 'p5'  },
  { nombre: 'Psicología Forense',           codigo: 'PSI-FOR',  creditos: 3, profId: 'p8'  },
  // N8
  { nombre: 'Práctica Clínica II',          codigo: 'PSI-PRC2', creditos: 6, profId: 'p5'  },
  { nombre: 'Proyecto de Titulación',       codigo: 'PSI-TIT',  creditos: 6, profId: 'p6'  },
  { nombre: 'Psicofarmacología',            codigo: 'PSI-FAR',  creditos: 3, profId: 'p19' },
  { nombre: 'Deontología Psicológica',      codigo: 'PSI-DEO',  creditos: 2, profId: 'p20' },
  { nombre: 'Psicología de la Salud',       codigo: 'PSI-SAL',  creditos: 3, profId: 'p5'  },
];

const MATERIAS_DER = [
  // N1
  { nombre: 'Introducción al Derecho',      codigo: 'DER-INT',  creditos: 4, profId: 'p7'  },
  { nombre: 'Historia del Derecho',         codigo: 'DER-HIS',  creditos: 3, profId: 'p7'  },
  { nombre: 'Teoría del Estado',            codigo: 'DER-EST',  creditos: 3, profId: 'p8'  },
  { nombre: 'Sociología Jurídica',          codigo: 'DER-SOC',  creditos: 3, profId: 'p20' },
  { nombre: 'Lógica Jurídica',              codigo: 'DER-LOG',  creditos: 3, profId: 'p7'  },
  // N2
  { nombre: 'Derecho Civil I',              codigo: 'DER-CV1',  creditos: 4, profId: 'p7'  },
  { nombre: 'Derecho Constitucional',       codigo: 'DER-CON',  creditos: 4, profId: 'p8'  },
  { nombre: 'Derecho Romano',               codigo: 'DER-ROM',  creditos: 3, profId: 'p7'  },
  { nombre: 'Filosofía del Derecho',        codigo: 'DER-FIL',  creditos: 3, profId: 'p8'  },
  { nombre: 'Metodología Jurídica',         codigo: 'DER-MET',  creditos: 3, profId: 'p13' },
  // N3
  { nombre: 'Derecho Civil II',             codigo: 'DER-CV2',  creditos: 4, profId: 'p7'  },
  { nombre: 'Derecho Penal I',              codigo: 'DER-PE1',  creditos: 4, profId: 'p8'  },
  { nombre: 'Derecho Administrativo I',     codigo: 'DER-AD1',  creditos: 4, profId: 'p7'  },
  { nombre: 'Derecho Procesal Civil I',     codigo: 'DER-PC1',  creditos: 4, profId: 'p7'  },
  { nombre: 'Bienes y Propiedad',           codigo: 'DER-BP',   creditos: 3, profId: 'p7'  },
  // N4
  { nombre: 'Derecho Civil III',            codigo: 'DER-CV3',  creditos: 4, profId: 'p7'  },
  { nombre: 'Derecho Penal II',             codigo: 'DER-PE2',  creditos: 4, profId: 'p8'  },
  { nombre: 'Derecho Laboral I',            codigo: 'DER-LA1',  creditos: 4, profId: 'p18' },
  { nombre: 'Derecho Procesal Penal',       codigo: 'DER-PP',   creditos: 4, profId: 'p8'  },
  { nombre: 'Obligaciones y Contratos',     codigo: 'DER-OC',   creditos: 3, profId: 'p7'  },
  // N5
  { nombre: 'Derecho de Familia',           codigo: 'DER-FAM',  creditos: 3, profId: 'p7'  },
  { nombre: 'Derecho Laboral II',           codigo: 'DER-LA2',  creditos: 4, profId: 'p18' },
  { nombre: 'Derecho Internacional Público',codigo: 'DER-IP',   creditos: 3, profId: 'p18' },
  { nombre: 'Derecho Procesal Adm.',        codigo: 'DER-PA',   creditos: 4, profId: 'p7'  },
  { nombre: 'Criminalística',               codigo: 'DER-CRI',  creditos: 3, profId: 'p8'  },
  // N6
  { nombre: 'Derecho Mercantil I',          codigo: 'DER-ME1',  creditos: 4, profId: 'p18' },
  { nombre: 'Derecho Internacional Privado',codigo: 'DER-IPI',  creditos: 3, profId: 'p18' },
  { nombre: 'Derecho Tributario',           codigo: 'DER-TRI',  creditos: 4, profId: 'p7'  },
  { nombre: 'Derecho Ambiental',            codigo: 'DER-AMB',  creditos: 3, profId: 'p8'  },
  { nombre: 'Litigación Oral',              codigo: 'DER-LIT',  creditos: 4, profId: 'p8'  },
  // N7
  { nombre: 'Derecho Mercantil II',         codigo: 'DER-ME2',  creditos: 4, profId: 'p18' },
  { nombre: 'Derecho Financiero',           codigo: 'DER-FIN',  creditos: 3, profId: 'p18' },
  { nombre: 'Derecho Penal Especial',       codigo: 'DER-PE3',  creditos: 4, profId: 'p8'  },
  { nombre: 'Mediación y Arbitraje',        codigo: 'DER-MED',  creditos: 3, profId: 'p7'  },
  { nombre: 'Práctica Jurídica I',          codigo: 'DER-PJ1',  creditos: 6, profId: 'p7'  },
  // N8
  { nombre: 'Proyecto de Titulación',       codigo: 'DER-TIT',  creditos: 6, profId: 'p7'  },
  { nombre: 'Práctica Jurídica II',         codigo: 'DER-PJ2',  creditos: 6, profId: 'p8'  },
  { nombre: 'Derecho Informático',          codigo: 'DER-INF',  creditos: 3, profId: 'p3'  },
  { nombre: 'Deontología Jurídica',         codigo: 'DER-DEO',  creditos: 2, profId: 'p20' },
  { nombre: 'Propiedad Intelectual',        codigo: 'DER-PI',   creditos: 3, profId: 'p18' },
];

const MATERIAS_MED = [
  // N1
  { nombre: 'Anatomía I',                   codigo: 'MED-AN1',  creditos: 5, profId: 'p9'  },
  { nombre: 'Biología Celular',             codigo: 'MED-BIO',  creditos: 4, profId: 'p14' },
  { nombre: 'Histología I',                 codigo: 'MED-HIS1', creditos: 4, profId: 'p9'  },
  { nombre: 'Bioquímica I',                 codigo: 'MED-BQ1',  creditos: 4, profId: 'p14' },
  { nombre: 'Embriología',                  codigo: 'MED-EMB',  creditos: 3, profId: 'p9'  },
  // N2
  { nombre: 'Anatomía II',                  codigo: 'MED-AN2',  creditos: 5, profId: 'p9'  },
  { nombre: 'Histología II',                codigo: 'MED-HIS2', creditos: 4, profId: 'p9'  },
  { nombre: 'Bioquímica II',                codigo: 'MED-BQ2',  creditos: 4, profId: 'p14' },
  { nombre: 'Fisiología I',                 codigo: 'MED-FIS1', creditos: 5, profId: 'p9'  },
  { nombre: 'Genética Médica',              codigo: 'MED-GEN',  creditos: 4, profId: 'p14' },
  // N3
  { nombre: 'Fisiología II',                codigo: 'MED-FIS2', creditos: 5, profId: 'p9'  },
  { nombre: 'Microbiología',                codigo: 'MED-MIC',  creditos: 4, profId: 'p19' },
  { nombre: 'Parasitología',                codigo: 'MED-PAR',  creditos: 3, profId: 'p19' },
  { nombre: 'Patología General',            codigo: 'MED-PAT',  creditos: 4, profId: 'p10' },
  { nombre: 'Farmacología I',               codigo: 'MED-FAR1', creditos: 4, profId: 'p19' },
  // N4
  { nombre: 'Patología Especial I',         codigo: 'MED-PE1',  creditos: 4, profId: 'p10' },
  { nombre: 'Farmacología II',              codigo: 'MED-FAR2', creditos: 4, profId: 'p19' },
  { nombre: 'Inmunología',                  codigo: 'MED-INM',  creditos: 4, profId: 'p14' },
  { nombre: 'Semiología Médica',            codigo: 'MED-SEM',  creditos: 5, profId: 'p10' },
  { nombre: 'Medicina Interna I',           codigo: 'MED-MI1',  creditos: 5, profId: 'p10' },
  // N5
  { nombre: 'Medicina Interna II',          codigo: 'MED-MI2',  creditos: 5, profId: 'p10' },
  { nombre: 'Cirugía I',                    codigo: 'MED-CIR1', creditos: 5, profId: 'p15' },
  { nombre: 'Pediatría I',                  codigo: 'MED-PED1', creditos: 4, profId: 'p10' },
  { nombre: 'Salud Pública I',              codigo: 'MED-SP1',  creditos: 3, profId: 'p13' },
  { nombre: 'Ginecología I',                codigo: 'MED-GIN1', creditos: 4, profId: 'p9'  },
  // N6
  { nombre: 'Medicina Interna III',         codigo: 'MED-MI3',  creditos: 5, profId: 'p10' },
  { nombre: 'Cirugía II',                   codigo: 'MED-CIR2', creditos: 5, profId: 'p15' },
  { nombre: 'Pediatría II',                 codigo: 'MED-PED2', creditos: 4, profId: 'p10' },
  { nombre: 'Ginecología II',               codigo: 'MED-GIN2', creditos: 4, profId: 'p9'  },
  { nombre: 'Traumatología',                codigo: 'MED-TRA',  creditos: 4, profId: 'p15' },
  // N7
  { nombre: 'Medicina de Urgencias I',      codigo: 'MED-UR1',  creditos: 5, profId: 'p15' },
  { nombre: 'Neurología',                   codigo: 'MED-NEU',  creditos: 4, profId: 'p6'  },
  { nombre: 'Psiquiatría',                  codigo: 'MED-PSI',  creditos: 4, profId: 'p5'  },
  { nombre: 'Medicina Familiar',            codigo: 'MED-MF',   creditos: 3, profId: 'p10' },
  { nombre: 'Oncología Básica',             codigo: 'MED-ONC',  creditos: 3, profId: 'p10' },
  // N8
  { nombre: 'Medicina de Urgencias II',     codigo: 'MED-UR2',  creditos: 5, profId: 'p15' },
  { nombre: 'Cardiología',                  codigo: 'MED-CAR',  creditos: 4, profId: 'p10' },
  { nombre: 'Neumología',                   codigo: 'MED-NEU2', creditos: 4, profId: 'p10' },
  { nombre: 'Endocrinología',               codigo: 'MED-END',  creditos: 4, profId: 'p10' },
  { nombre: 'Salud Pública II',             codigo: 'MED-SP2',  creditos: 3, profId: 'p13' },
  // N9
  { nombre: 'Medicina Legal',               codigo: 'MED-ML',   creditos: 3, profId: 'p8'  },
  { nombre: 'Bioética Médica',              codigo: 'MED-BET',  creditos: 2, profId: 'p20' },
  { nombre: 'Gastroenterología',            codigo: 'MED-GAS',  creditos: 4, profId: 'p10' },
  { nombre: 'Nefrología',                   codigo: 'MED-NEF',  creditos: 4, profId: 'p10' },
  { nombre: 'Dermatología',                 codigo: 'MED-DER',  creditos: 3, profId: 'p9'  },
  // N10
  { nombre: 'Internado Rotativo I',         codigo: 'MED-IR1',  creditos: 8, profId: 'p10' },
  { nombre: 'Geriatría',                    codigo: 'MED-GER',  creditos: 3, profId: 'p10' },
  { nombre: 'Reumatología',                 codigo: 'MED-REU',  creditos: 3, profId: 'p10' },
  { nombre: 'Infectología',                 codigo: 'MED-INF',  creditos: 4, profId: 'p19' },
  { nombre: 'Urología',                     codigo: 'MED-URO',  creditos: 3, profId: 'p15' },
  // N11
  { nombre: 'Internado Rotativo II',        codigo: 'MED-IR2',  creditos: 8, profId: 'p15' },
  { nombre: 'Oftalmología',                 codigo: 'MED-OFT',  creditos: 3, profId: 'p10' },
  { nombre: 'Otorrinolaringología',         codigo: 'MED-ORL',  creditos: 3, profId: 'p10' },
  { nombre: 'Hematología',                  codigo: 'MED-HEM',  creditos: 4, profId: 'p10' },
  { nombre: 'Rehabilitación Física',        codigo: 'MED-REH',  creditos: 3, profId: 'p15' },
  // N12
  { nombre: 'Examen Complexivo',            codigo: 'MED-EXC',  creditos: 6, profId: 'p10' },
  { nombre: 'Proyecto de Titulación',       codigo: 'MED-TIT',  creditos: 6, profId: 'p9'  },
  { nombre: 'Epidemiología Clínica',        codigo: 'MED-EPI',  creditos: 4, profId: 'p13' },
  { nombre: 'Administración Hospitalaria',  codigo: 'MED-ADM',  creditos: 3, profId: 'p20' },
  { nombre: 'Medicina Alternativa',         codigo: 'MED-ALT',  creditos: 2, profId: 'p9'  },
];

const MATERIAS_MKT = [
  // N1
  { nombre: 'Introducción al Marketing',    codigo: 'MKT-INT',  creditos: 4, profId: 'p11' },
  { nombre: 'Matemáticas para Negocios',    codigo: 'MKT-MAT',  creditos: 3, profId: 'p1'  },
  { nombre: 'Economía I',                   codigo: 'MKT-ECO1', creditos: 3, profId: 'p20' },
  { nombre: 'Comunicación Empresarial',     codigo: 'MKT-COM',  creditos: 3, profId: 'p11' },
  { nombre: 'Fundamentos de Contabilidad',  codigo: 'MKT-CON',  creditos: 3, profId: 'p20' },
  // N2
  { nombre: 'Marketing Estratégico',        codigo: 'MKT-EST',  creditos: 4, profId: 'p11' },
  { nombre: 'Economía II',                  codigo: 'MKT-ECO2', creditos: 3, profId: 'p20' },
  { nombre: 'Estadística Aplicada',         codigo: 'MKT-ESTA', creditos: 3, profId: 'p13' },
  { nombre: 'Finanzas Básicas',             codigo: 'MKT-FIN',  creditos: 3, profId: 'p20' },
  { nombre: 'Comportamiento del Consumidor',codigo: 'MKT-CON2', creditos: 4, profId: 'p12' },
  // N3
  { nombre: 'Investigación de Mercados',    codigo: 'MKT-INV',  creditos: 4, profId: 'p12' },
  { nombre: 'Gestión de Marca',             codigo: 'MKT-MAR',  creditos: 4, profId: 'p11' },
  { nombre: 'Publicidad I',                 codigo: 'MKT-PUB1', creditos: 4, profId: 'p11' },
  { nombre: 'Análisis Estadístico',         codigo: 'MKT-AE',   creditos: 3, profId: 'p13' },
  { nombre: 'Negocios Internacionales',     codigo: 'MKT-NI',   creditos: 3, profId: 'p18' },
  // N4
  { nombre: 'Marketing Digital I',          codigo: 'MKT-DIG1', creditos: 4, profId: 'p11' },
  { nombre: 'Publicidad II',                codigo: 'MKT-PUB2', creditos: 4, profId: 'p11' },
  { nombre: 'Relaciones Públicas',          codigo: 'MKT-RP',   creditos: 3, profId: 'p11' },
  { nombre: 'Diseño Gráfico Publicitario',  codigo: 'MKT-DIS',  creditos: 3, profId: 'p12' },
  { nombre: 'E-commerce',                   codigo: 'MKT-EC',   creditos: 4, profId: 'p11' },
  // N5
  { nombre: 'Marketing Digital II',         codigo: 'MKT-DIG2', creditos: 4, profId: 'p11' },
  { nombre: 'Ventas y Negociación',         codigo: 'MKT-VEN',  creditos: 4, profId: 'p12' },
  { nombre: 'Gestión de Redes Sociales',    codigo: 'MKT-RRSS', creditos: 4, profId: 'p11' },
  { nombre: 'Derecho Mercantil',            codigo: 'MKT-DM',   creditos: 3, profId: 'p18' },
  { nombre: 'Análisis de Datos',            codigo: 'MKT-AD',   creditos: 3, profId: 'p13' },
  // N6
  { nombre: 'Estrategia de Contenidos',     codigo: 'MKT-SC',   creditos: 4, profId: 'p11' },
  { nombre: 'CRM y Fidelización',           codigo: 'MKT-CRM',  creditos: 3, profId: 'p12' },
  { nombre: 'Marketing de Servicios',       codigo: 'MKT-MS',   creditos: 3, profId: 'p12' },
  { nombre: 'Emprendimiento',               codigo: 'MKT-EMP',  creditos: 3, profId: 'p20' },
  { nombre: 'Ética Publicitaria',           codigo: 'MKT-ETI',  creditos: 2, profId: 'p20' },
  // N7
  { nombre: 'Plan de Marketing',            codigo: 'MKT-PLA',  creditos: 4, profId: 'p11' },
  { nombre: 'SEO / SEM',                   codigo: 'MKT-SEO',  creditos: 4, profId: 'p11' },
  { nombre: 'Marketing de Influencers',     codigo: 'MKT-INF',  creditos: 3, profId: 'p12' },
  { nombre: 'Práctica Empresarial I',       codigo: 'MKT-PE1',  creditos: 4, profId: 'p20' },
  { nombre: 'Marketing Internacional',      codigo: 'MKT-MI',   creditos: 3, profId: 'p18' },
  // N8
  { nombre: 'Proyecto de Titulación',       codigo: 'MKT-TIT',  creditos: 6, profId: 'p12' },
  { nombre: 'Práctica Empresarial II',      codigo: 'MKT-PE2',  creditos: 4, profId: 'p20' },
  { nombre: 'Innovación y Tendencias',      codigo: 'MKT-INN',  creditos: 3, profId: 'p11' },
  { nombre: 'Gestión de Crisis de Marca',   codigo: 'MKT-CRI',  creditos: 3, profId: 'p12' },
  { nombre: 'Neuromarketing',               codigo: 'MKT-NMK',  creditos: 3, profId: 'p6'  },
];

function generarMaterias() {
  const grupos = [
    { codigo: 'ING', materias: MATERIAS_ING, niveles: 8  },
    { codigo: 'PSI', materias: MATERIAS_PSI, niveles: 8  },
    { codigo: 'DER', materias: MATERIAS_DER, niveles: 8  },
    { codigo: 'MED', materias: MATERIAS_MED, niveles: 12 },
    { codigo: 'MKT', materias: MATERIAS_MKT, niveles: 8  },
  ];

  const materias = [];
  for (const g of grupos) {
    const porNivel = 5;
    for (let n = 1; n <= g.niveles; n++) {
      const slice = g.materias.slice((n - 1) * porNivel, n * porNivel);
      slice.forEach((m, i) => {
        materias.push({
          id: `${g.codigo}-M-N${n}-${i + 1}`,
          nombre: m.nombre,
          codigo: m.codigo,
          creditos: m.creditos,
          profesorId: m.profId,
          cursoId: `${g.codigo}-N${n}-A`,
        });
      });
    }
  }
  return materias;
}

export const INITIAL_MATERIAS = generarMaterias();

// ── Alumnos ───────────────────────────────────────────────────────────────────
export const INITIAL_ALUMNOS = [
  { id: 'a1',  nombre: 'Lucía',      apellido: 'Torres',    email: 'alumno@sge.edu',       fechaNacimiento: '2003-03-15', cursoId: 'ING-N1-A' },
  { id: 'a2',  nombre: 'Miguel',     apellido: 'Herrera',   email: 'miguel.h@sge.edu',     fechaNacimiento: '2002-07-22', cursoId: 'ING-N1-A' },
  { id: 'a3',  nombre: 'Valentina',  apellido: 'Castro',    email: 'valeria.c@sge.edu',    fechaNacimiento: '2002-11-10', cursoId: 'PSI-N2-A' },
  { id: 'a4',  nombre: 'Sebastián',  apellido: 'Mora',      email: 'sebastian.m@sge.edu',  fechaNacimiento: '2001-02-28', cursoId: 'DER-N3-B' },
  { id: 'a5',  nombre: 'Camila',     apellido: 'Ortega',    email: 'camila.o@sge.edu',     fechaNacimiento: '2000-09-05', cursoId: 'MED-N4-A' },
  { id: 'a6',  nombre: 'Diego',      apellido: 'Fuentes',   email: 'diego.f@sge.edu',      fechaNacimiento: '2001-12-18', cursoId: 'MKT-N1-B' },
  { id: 'a7',  nombre: 'Isabela',    apellido: 'Nieto',     email: 'isabela.n@sge.edu',    fechaNacimiento: '2003-01-30', cursoId: 'ING-N1-B' },
  { id: 'a8',  nombre: 'Mateo',      apellido: 'Vega',      email: 'mateo.v@sge.edu',      fechaNacimiento: '2002-06-14', cursoId: 'ING-N2-A' },
  { id: 'a9',  nombre: 'Gabriela',   apellido: 'Romero',    email: 'gabi.r@sge.edu',       fechaNacimiento: '2001-04-20', cursoId: 'MED-N1-A' },
  { id: 'a10', nombre: 'Andrés',     apellido: 'Cóndor',    email: 'andres.c@sge.edu',     fechaNacimiento: '2000-08-11', cursoId: 'DER-N5-A' },
  { id: 'a11', nombre: 'Paola',      apellido: 'Jiménez',   email: 'paola.j@sge.edu',      fechaNacimiento: '2001-05-03', cursoId: 'MKT-N3-A' },
  { id: 'a12', nombre: 'Carlos',     apellido: 'Delgado',   email: 'carlos.d@sge.edu',     fechaNacimiento: '1999-10-25', cursoId: 'MED-N6-B' },
];

// ── Horario de referencia (alumno demo – Ingeniería 1er Nivel) ────────────────
export const SCHEDULE = {
  Lunes:     ['Cálculo Diferencial (07:00-09:00)', 'Álgebra Lineal (09:15-11:15)', 'Física I (11:30-13:00)'],
  Martes:    ['Programación I (07:00-09:00)',      'Química General (09:15-11:15)', 'Cálculo Diferencial (11:30-13:00)'],
  Miércoles: ['Álgebra Lineal (07:00-09:00)',      'Física I (09:15-11:15)',        'Programación I (11:30-13:00)'],
  Jueves:    ['Química General (07:00-09:00)',     'Cálculo Diferencial (09:15-11:15)', 'Álgebra Lineal (11:30-13:00)'],
  Viernes:   ['Física I (07:00-09:00)',            'Química General (09:15-11:15)', 'Programación I (11:30-13:00)'],
};
