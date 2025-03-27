import type { Event } from "@/types/Events";

// Función para generar datos de ejemplo
function generateSampleData(count: number) {
  const data = [];
  const facultades = [
    "Ingeniería",
    "Medicina",
    "Derecho",
    "Psicología",
    "Economía",
  ];
  const semestres = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];
  const estratos = ["Bajo", "Medio", "Alto"];
  const carreras = [
    "Ingeniería de Sistemas",
    "Medicina",
    "Derecho",
    "Psicología",
    "Economía",
    "Ingeniería Civil",
    "Gastronomía",
    "Administración",
  ];

  for (let i = 1; i <= count; i++) {
    const facultadIndex = Math.floor(Math.random() * facultades.length);
    const semestreIndex = Math.floor(Math.random() * semestres.length);
    const estratoIndex = Math.floor(Math.random() * estratos.length);
    const carreraIndex = Math.floor(Math.random() * carreras.length);

    data.push({
      id: i,
      nombre: `Estudiante ${i}`,
      codigo: `EST${1000 + i}`,
      correo: `estudiante${i}@universidad.edu.co`,
      telefono: `300${Math.floor(1000000 + Math.random() * 9000000)}`,
      facultad: facultades[facultadIndex],
      carrera: carreras[carreraIndex],
      semestre: semestres[semestreIndex],
      estrato: estratos[estratoIndex],
      direccion: `Calle ${i}, Ciudad`,
      fecha: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      hora: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(
        Math.random() * 60
      )
        .toString()
        .padStart(2, "0")}`,
    });
  }

  return data;
}

// Datos de ejemplo para eventos
export const eventosEjemplo: Event[] = [
  {
    id: 1,
    nombre: "Induccion de Ingenieria, Gastronomia y Psicologia",
    organizador: "Universidad del Sinu Seccional Cartagena",
    state: "activo",
    fecha: "2025-03-18",
    hora: "05:39",
    cupos: -1,
    faculty: {
      value: "Ingenieria_1",
      data: {
        nombre: "Ingenieria",
        state: "true",
        id: 1,
      },
    },
    scenery: {
      value: "Auditorio Santillana_1",
      data: {
        nombre: "Auditorio Santillana",
        state: "true",
        id: 1,
      },
    },
    form: {
      value: "Formulario de Inscripcion_1742291990002",
      data: {
        id: 1742291990002,
        nombre: "Formulario de Inscripcion",
        descripcion: "Por favor ingrese los datos correctamente",
        campos: [
          {
            id: "nombre_1742294172313",
            nombre: "Nombre",
            tipo: "texto",
            requerido: true,
            seccion: "personal",
          },
          {
            id: "correo_electronico_1742294180033",
            nombre: "Correo Electronico",
            tipo: "email",
            requerido: true,
            seccion: "personal",
          },
          {
            id: "numero_telefonico_1742294190390",
            nombre: "Numero Telefonico",
            tipo: "numero",
            requerido: false,
            seccion: "personal",
          },
          {
            id: "semestre_1742294209768",
            nombre: "Semestre",
            tipo: "seleccion",
            requerido: true,
            seccion: "personal",
            opciones: [
              "I",
              "II",
              "III",
              "IV",
              "V",
              "VI",
              "VII",
              "VIII",
              "IX",
              "X",
            ],
          },
          {
            id: "facultad_1742294260490",
            nombre: "Facultad",
            tipo: "seleccion",
            requerido: true,
            seccion: "personal",
            opciones: ["Ingenieria", " Gastronomia", " Psicologia"],
          },
          {
            id: "estrato_1742294281482",
            nombre: "Estrato",
            tipo: "seleccion",
            requerido: true,
            seccion: "adicional",
            opciones: ["Bajo", " Medio", " Alto"],
          },
          {
            id: "direccion_1742294297671",
            nombre: "Direccion",
            tipo: "texto",
            requerido: false,
            seccion: "adicional",
          },
        ],
        state: true,
      },
    },
    assists: [],
    inscriptions: [],
  },
  {
    id: 2,
    nombre: "Conferencia de Ingeniería",
    organizador: "Facultad de Ingeniería",
    state: "inactivo",
    fecha: "2024-03-15",
    hora: "14:00",
    cupos: 100,
    faculty: {
      value: "Ingenieria_1",
      data: {
        nombre: "Ingenieria",
        state: "true",
        id: 1,
      },
    },
    scenery: {
      value: "Sala de Conferencias A_2",
      data: {
        nombre: "Sala de Conferencias A",
        state: "true",
        id: 2,
      },
    },
    form: {
      value: "Registro de Estudiantes_1742291990003",
      data: {
        id: 1742291990003,
        nombre: "Registro de Estudiantes",
        descripcion: "Formulario para registrar estudiantes en eventos",
        campos: [
          {
            id: "nombre_1742294172314",
            nombre: "Nombre",
            tipo: "texto",
            requerido: true,
            seccion: "personal",
          },
          {
            id: "codigo_1742294180034",
            nombre: "Código Estudiantil",
            tipo: "numero",
            requerido: true,
            seccion: "personal",
          },
          {
            id: "escuela_1742294190391",
            nombre: "Escuela",
            tipo: "seleccion",
            requerido: true,
            seccion: "personal",
            opciones: ["Sistemas", "Psicología", "Medicina", "Derecho"],
          },
          {
            id: "email_1742294209769",
            nombre: "Correo Electrónico",
            tipo: "email",
            requerido: true,
            seccion: "personal",
          },
          {
            id: "profesor_1742294260491",
            nombre: "Profesor",
            tipo: "texto",
            requerido: false,
            seccion: "adicional",
          },
        ],
        state: true,
      },
    },
    assists: generateSampleData(10),
    inscriptions: generateSampleData(10),
  },
];
