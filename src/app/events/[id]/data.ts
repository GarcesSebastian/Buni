import type { Event } from "@/types/Events";
import { Form } from "@/types/Forms";
import type { typeFieldForm } from "@/types/Forms";

export const SAMPLE_DATA_COUNT = {
    INSCRIPTIONS: 100,
    ASSISTS: 60
};

interface Campo {
    id: string;
    nombre: string;
    tipo: typeFieldForm;
    requerido: boolean;
    seccion?: string;
    opciones?: string[];
}

interface Registro {
    [key: string]: string;
}

export function generateSampleData(count: number, form: Form | undefined) {
    if (!form) return [];

    const data: Registro[] = [];
    const campos = form.campos;

    const getRandomValue = (campo: Campo): string => {
        switch (campo.tipo) {
            case "seleccion":
                return campo.opciones?.[Math.floor(Math.random() * (campo.opciones?.length || 0))] || "";
            case "checklist_unico":
                return campo.opciones?.[Math.floor(Math.random() * (campo.opciones?.length || 0))] || "";
            case "checklist_multiple":
                return campo.opciones?.[Math.floor(Math.random() * (campo.opciones?.length || 0))] || "";
            case "email":
                return `estudiante${Math.floor(Math.random() * 1000)}@universidad.edu.co`;
            case "numero":
                return Math.floor(Math.random() * 1000000).toString();
            case "texto":
            case "fecha":
                return `Estudiante ${Math.floor(Math.random() * 1000)}`;
            default:
                return "";
        }
    };

    for (let i = 0; i < count; i++) {
        const registro: Registro = {};
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
            id: 1,
            key: "faculty"
        },
        scenery: {
            id: 1,
            key: "scenery"
        },
        formAssists: {
            id: 1,
            key: "form"
        },
        formInscriptions: {
            id: 1,
            key: "form"
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
                    nombre: "Programa",
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
                    nombre: "Programa",
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
            id: 1,
            key: "faculty"
        },
        scenery: {
            id: 2,
            key: "scenery"
        },
        formAssists: {
            id: 1742291990002,
            key: "form",
        },
        formInscriptions: {
            id: 1742291990002,
            key: "form"
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
                    nombre: "Programa",
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
                    nombre: "Programa",
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
