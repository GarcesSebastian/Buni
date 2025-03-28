import type { Event } from "@/types/Events";
import { Form } from "@/types/Forms";

export const SAMPLE_DATA_COUNT = {
    INSCRIPTIONS: 100,
    ASSISTS: 60
};

export function generateSampleData(count: number, form: Form) {
    const data = [];
    const campos = form.data?.campos || form.campos;

    const getRandomValue = (campo: any) => {
        switch (campo.tipo) {
            case "seleccion":
                return campo.opciones[Math.floor(Math.random() * campo.opciones.length)];
            case "email":
                return `estudiante${Math.floor(Math.random() * 1000)}@universidad.edu.co`;
            case "numero":
                return Math.floor(Math.random() * 1000000).toString();
            case "texto":
                return `Estudiante ${Math.floor(Math.random() * 1000)}`;
            default:
                return "";
        }
    };

    for (let i = 0; i < count; i++) {
        const registro: Record<string, any> = {};
        campos.forEach((campo) => {
            const key = campo.id.split("_")[0];
            registro[key] = getRandomValue(campo);
        });
        data.push(registro);
    }

    return data;
}

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
        formAssists: {
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
                        opciones: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                    },
                    {
                        id: "facultad_1742294260490",
                        nombre: "Facultad",
                        tipo: "seleccion",
                        requerido: true,
                        seccion: "personal",
                        opciones: ["Ingenieria", "Gastronomia", "Psicologia"],
                    },
                    {
                        id: "estrato_1742294281482",
                        nombre: "Estrato",
                        tipo: "seleccion",
                        requerido: true,
                        seccion: "adicional",
                        opciones: ["Bajo", "Medio", "Alto"],
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
        formInscriptions: {
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
                        opciones: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                    },
                    {
                        id: "facultad_1742294260490",
                        nombre: "Facultad",
                        tipo: "seleccion",
                        requerido: true,
                        seccion: "personal",
                        opciones: ["Ingenieria", "Gastronomia", "Psicologia"],
                    },
                    {
                        id: "estrato_1742294281482",
                        nombre: "Estrato",
                        tipo: "seleccion",
                        requerido: true,
                        seccion: "adicional",
                        opciones: ["Bajo", "Medio", "Alto"],
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
        assists: generateSampleData(SAMPLE_DATA_COUNT.ASSISTS, {
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
                    opciones: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                },
                {
                    id: "facultad_1742294260490",
                    nombre: "Facultad",
                    tipo: "seleccion",
                    requerido: true,
                    seccion: "personal",
                    opciones: ["Ingenieria", "Gastronomia", "Psicologia"],
                },
                {
                    id: "estrato_1742294281482",
                    nombre: "Estrato",
                    tipo: "seleccion",
                    requerido: true,
                    seccion: "adicional",
                    opciones: ["Bajo", "Medio", "Alto"],
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
        }),
        inscriptions: generateSampleData(SAMPLE_DATA_COUNT.INSCRIPTIONS, {
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
                    opciones: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                },
                {
                    id: "facultad_1742294260490",
                    nombre: "Facultad",
                    tipo: "seleccion",
                    requerido: true,
                    seccion: "personal",
                    opciones: ["Ingenieria", "Gastronomia", "Psicologia"],
                },
                {
                    id: "estrato_1742294281482",
                    nombre: "Estrato",
                    tipo: "seleccion",
                    requerido: true,
                    seccion: "adicional",
                    opciones: ["Bajo", "Medio", "Alto"],
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
        }),
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
        formAssists: {
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
                        opciones: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                    },
                    {
                        id: "facultad_1742294260490",
                        nombre: "Facultad",
                        tipo: "seleccion",
                        requerido: true,
                        seccion: "personal",
                        opciones: ["Ingenieria", "Gastronomia", "Psicologia"],
                    },
                    {
                        id: "estrato_1742294281482",
                        nombre: "Estrato",
                        tipo: "seleccion",
                        requerido: true,
                        seccion: "adicional",
                        opciones: ["Bajo", "Medio", "Alto"],
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
        formInscriptions: {
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
                        opciones: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                    },
                    {
                        id: "facultad_1742294260490",
                        nombre: "Facultad",
                        tipo: "seleccion",
                        requerido: true,
                        seccion: "personal",
                        opciones: ["Ingenieria", "Gastronomia", "Psicologia"],
                    },
                    {
                        id: "estrato_1742294281482",
                        nombre: "Estrato",
                        tipo: "seleccion",
                        requerido: true,
                        seccion: "adicional",
                        opciones: ["Bajo", "Medio", "Alto"],
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
        assists: generateSampleData(SAMPLE_DATA_COUNT.ASSISTS, {
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
                    opciones: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                },
                {
                    id: "facultad_1742294260490",
                    nombre: "Facultad",
                    tipo: "seleccion",
                    requerido: true,
                    seccion: "personal",
                    opciones: ["Ingenieria", "Gastronomia", "Psicologia"],
                },
                {
                    id: "estrato_1742294281482",
                    nombre: "Estrato",
                    tipo: "seleccion",
                    requerido: true,
                    seccion: "adicional",
                    opciones: ["Bajo", "Medio", "Alto"],
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
        }),
        inscriptions: generateSampleData(SAMPLE_DATA_COUNT.INSCRIPTIONS, {
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
                    opciones: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                },
                {
                    id: "facultad_1742294260490",
                    nombre: "Facultad",
                    tipo: "seleccion",
                    requerido: true,
                    seccion: "personal",
                    opciones: ["Ingenieria", "Gastronomia", "Psicologia"],
                },
                {
                    id: "estrato_1742294281482",
                    nombre: "Estrato",
                    tipo: "seleccion",
                    requerido: true,
                    seccion: "adicional",
                    opciones: ["Bajo", "Medio", "Alto"],
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
        }),
    },
];
