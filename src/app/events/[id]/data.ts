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
    opciones?: string[] | { row: string; data: string[] }[];
    maxQualification?: number;
    qualificationIcon?: string;
}

interface Registro {
    [key: string]: string | number | Record<string, string | string[]>;
}

export async function generateSampleData(count: number, form: Form | undefined, onProgress?: (progress: number) => void) {
    if (!form) return [];

    const data: Registro[] = [];
    const campos = form.campos;

    const getRandomValue = (campo: Campo): string | number | Record<string, string | string[]> => {
        switch (campo.tipo) {
            case "seleccion":
                return campo.opciones?.[Math.floor(Math.random() * (campo.opciones?.length || 0))] || ""
            case "checklist_unico":
                return campo.opciones?.[Math.floor(Math.random() * (campo.opciones?.length || 0))] || ""
            case "checklist_multiple":
                const numSelections = Math.min(3, Math.floor(Math.random() * (campo.opciones?.length || 0)) + 1)
                return (campo.opciones?.slice(0, numSelections) || []).join(", ")
            case "checklist_unico_grid":
            case "checklist_multiple_grid":
                if (!Array.isArray(campo.opciones)) return {}
                const gridValue: Record<string, string | string[]> = {}
                campo.opciones.forEach(opt => {
                    if (typeof opt === 'object' && 'row' in opt && 'data' in opt) {
                        const rowKey = `${campo.id}-${opt.row}`
                        if (campo.tipo === "checklist_unico_grid") {
                            gridValue[rowKey] = opt.data[Math.floor(Math.random() * opt.data.length)]
                        } else {
                            const numSelections = Math.min(3, Math.floor(Math.random() * opt.data.length) + 1)
                            gridValue[rowKey] = opt.data.slice(0, numSelections)
                        }
                    }
                })
                return gridValue
            case "email":
                return `estudiante${Math.floor(Math.random() * 1000)}@universidad.edu.co`;
            case "numero":
                return Math.floor(Math.random() * 1000000);
            case "texto":
                return `Estudiante ${Math.floor(Math.random() * 1000)}`;
            case "fecha":
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 365));
                return date.toISOString().split('T')[0];
            case "hora":
                return `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
            case "checkbox":
                return Math.random() > 0.5 ? 1 : 0;
            case "qualification":
                return Math.floor(Math.random() * (campo.maxQualification || 5) + 1);
            default:
                return "";
        }
    };

    const BATCH_SIZE = 100;
    const totalBatches = Math.ceil(count / BATCH_SIZE);

    for (let batch = 0; batch < totalBatches; batch++) {
        const batchSize = Math.min(BATCH_SIZE, count - (batch * BATCH_SIZE));
        const batchData: Registro[] = [];

        for (let i = 0; i < batchSize; i++) {
            const registro: Registro = {};
            campos.forEach((campo) => {
                const key = campo.id.split("_")[0];
                registro[key] = getRandomValue(campo as Campo);
            });
            batchData.push(registro);
        }

        data.push(...batchData);

        if (onProgress) {
            onProgress(Math.min(100, Math.round((batch + 1) / totalBatches * 100)));
        }

        await new Promise(resolve => setTimeout(resolve, 0));
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
        assists: await generateSampleData(SAMPLE_DATA_COUNT.ASSISTS, {
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
        inscriptions: await generateSampleData(SAMPLE_DATA_COUNT.INSCRIPTIONS, {
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
        assists: await generateSampleData(SAMPLE_DATA_COUNT.ASSISTS, {
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
        inscriptions: await generateSampleData(SAMPLE_DATA_COUNT.INSCRIPTIONS, {
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
