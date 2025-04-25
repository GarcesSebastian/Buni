import type { Event } from "@/types/Events";
import { Form } from "@/types/Forms";
import type { typeFieldForm } from "@/types/Forms";

export const SAMPLE_DATA_COUNT = {
    INSCRIPTIONS: 100,
    ASSISTS: 60
};

interface Field {
    id: string;
    name: string;
    type: typeFieldForm;
    required: boolean;
    section?: string;
    options?: string[] | { row: string; data: string[] }[];
    maxQualification?: number;
    qualificationIcon?: string;
}

interface Registro {
    [key: string]: string | number | Record<string, string | string[]>;
}

export async function generateSampleData(count: number, form: Form | undefined, onProgress?: (progress: number) => void) {
    if (!form) return [];

    const data: Registro[] = [];
    const fields = form.fields;

    const getRandomValue = (field: Field): string | number | Record<string, string | string[]> => {
        switch (field.type) {
            case "select":
                return field.options?.[Math.floor(Math.random() * (field.options?.length || 0))] || ""
            case "checklist_single":
                return field.options?.[Math.floor(Math.random() * (field.options?.length || 0))] || ""
            case "checklist_multiple":
                const numSelections = Math.min(3, Math.floor(Math.random() * (field.options?.length || 0)) + 1)
                return (field.options?.slice(0, numSelections) || []).join(", ")
            case "checklist_single_grid":
            case "checklist_multiple_grid":
                if (!Array.isArray(field.options)) return {}
                const gridValue: Record<string, string | string[]> = {}
                field.options.forEach(opt => {
                    if (typeof opt === 'object' && 'row' in opt && 'data' in opt) {
                        const rowKey = `${field.id}-${opt.row}`
                        if (field.type === "checklist_single_grid") {
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
            case "number":
                return Math.floor(Math.random() * 1000000);
            case "text":
                return `Estudiante ${Math.floor(Math.random() * 1000)}`;
            case "date":
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 365));
                return date.toISOString().split('T')[0];
            case "time":
                return `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
            case "checkbox":
                return Math.random() > 0.5 ? 1 : 0;
            case "qualification":
                return Math.floor(Math.random() * (field.maxQualification || 5) + 1);
            default:
                return "";
        }
    };

    const BATCH_SIZE = 10000;
    const totalBatches = Math.ceil(count / BATCH_SIZE);

    for (let batch = 0; batch < totalBatches; batch++) {
        const batchSize = Math.min(BATCH_SIZE, count - (batch * BATCH_SIZE));
        const batchData: Registro[] = [];

        for (let i = 0; i < batchSize; i++) {
            const registro: Registro = {};
            fields.forEach((field) => {
                const key = field.id.split("_")[0];
                registro[key] = getRandomValue(field as Field);
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
        cupos: "-1",
        programs: {
            id: 1,
            key: "program"
        },
        scenery: {
            id: 1,
            key: "scenery"
        },
        formAssists: {
            id: 1,
            key: "forms"
        },
        formInscriptions: {
            id: 1,
            key: "forms"
        },
        assists: await generateSampleData(SAMPLE_DATA_COUNT.ASSISTS, {
            id: 1742291990002,
            name: "Formulario de Inscripcion",
            description: "Por favor ingrese los datos correctamente",
            fields: [
                {
                    id: "nombre_1742294172313",
                    name: "Nombre",
                    type: "text",
                    required: true,
                    section: "personal",
                },
                {
                    id: "correo_electronico_1742294180033",
                    name: "Correo Electronico",
                    type: "email",
                    required: true,
                    section: "personal",
                },
                {
                    id: "numero_telefonico_1742294190390",
                    name: "Numero Telefonico",
                    type: "number",
                    required: false,
                    section: "personal",
                },
                {
                    id: "semestre_1742294209768",
                    name: "Semestre",
                    type: "select",
                    required: true,
                    section: "personal",
                    options: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                },
                {
                    id: "programs_1742294260490",
                    name: "Programa",
                    type: "select",
                    required: true,
                    section: "personal",
                    options: ["Ingenieria", "Gastronomia", "Psicologia"],
                },
                {
                    id: "estrato_1742294281482",
                    name: "Estrato",
                    type: "select",
                    required: true,
                    section: "additional",
                    options: ["Bajo", "Medio", "Alto"],
                },
                {
                    id: "direccion_1742294297671",
                    name: "Direccion",
                    type: "text",
                    required: false,
                    section: "additional",
                },
            ],
            state: true,
        }),
        inscriptions: await generateSampleData(SAMPLE_DATA_COUNT.INSCRIPTIONS, {
            id: 1742291990002,
            name: "Formulario de Inscripcion",
            description: "Por favor ingrese los datos correctamente",
            fields: [
                {
                    id: "nombre_1742294172313",
                    name: "Nombre",
                    type: "text",
                    required: true,
                    section: "personal",
                },
                {
                    id: "correo_electronico_1742294180033",
                    name: "Correo Electronico",
                    type: "email",
                    required: true,
                    section: "personal",
                },
                {
                    id: "numero_telefonico_1742294190390",
                    name: "Numero Telefonico",
                    type: "number",
                    required: false,
                    section: "personal",
                },
                {
                    id: "semestre_1742294209768",
                    name: "Semestre",
                    type: "select",
                    required: true,
                    section: "personal",
                    options: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                },
                {
                    id: "programs_1742294260490",
                    name: "Programa",
                    type: "select",
                    required: true,
                    section: "personal",
                    options: ["Ingenieria", "Gastronomia", "Psicologia"],
                },
                {
                    id: "estrato_1742294281482",
                    name: "Estrato",
                    type: "select",
                    required: true,
                    section: "additional",
                    options: ["Bajo", "Medio", "Alto"],
                },
                {
                    id: "direccion_1742294297671",
                    name: "Direccion",
                    type: "text",
                    required: false,
                    section: "additional",
                },
            ],
            state: true,
        }),
    },
    {
        id: 2,
        nombre: "Conferencia de Ingeniería",
        organizador: "Programa de Ingeniería",
        state: "inactivo",
        fecha: "2024-03-15",
        hora: "14:00",
        cupos: "100",
        programs: {
            id: 1,
            key: "program"
        },
        scenery: {
            id: 2,
            key: "scenery"
        },
        formAssists: {
            id: 1742291990002,
            key: "forms",
        },
        formInscriptions: {
            id: 1742291990002,
            key: "forms"
        },
        assists: await generateSampleData(SAMPLE_DATA_COUNT.ASSISTS, {
            id: 1742291990002,
            name: "Formulario de Inscripcion",
            description: "Por favor ingrese los datos correctamente",
            fields: [
                {
                    id: "nombre_1742294172313",
                    name: "Nombre",
                    type: "text",
                    required: true,
                    section: "personal",
                },
                {
                    id: "correo_electronico_1742294180033",
                    name: "Correo Electronico",
                    type: "email",
                    required: true,
                    section: "personal",
                },
                {
                    id: "numero_telefonico_1742294190390",
                    name: "Numero Telefonico",
                    type: "number",
                    required: false,
                    section: "personal",
                },
                {
                    id: "semestre_1742294209768",
                    name: "Semestre",
                    type: "select",
                    required: true,
                    section: "personal",
                    options: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                },
                {
                    id: "programs_1742294260490",
                    name: "Programa",
                    type: "select",
                    required: true,
                    section: "personal",
                    options: ["Ingenieria", "Gastronomia", "Psicologia"],
                },
                {
                    id: "estrato_1742294281482",
                    name: "Estrato",
                    type: "select",
                    required: true,
                    section: "additional",
                    options: ["Bajo", "Medio", "Alto"],
                },
                {
                    id: "direccion_1742294297671",
                    name: "Direccion",
                    type: "text",
                    required: false,
                    section: "additional",
                },
            ],
            state: true,
        }),
        inscriptions: await generateSampleData(SAMPLE_DATA_COUNT.INSCRIPTIONS, {
            id: 1742291990002,
            name: "Formulario de Inscripcion",
            description: "Por favor ingrese los datos correctamente",
            fields: [
                {
                    id: "nombre_1742294172313",
                    name: "Nombre",
                    type: "text",
                    required: true,
                    section: "personal",
                },
                {
                    id: "correo_electronico_1742294180033",
                    name: "Correo Electronico",
                    type: "email",
                    required: true,
                    section: "personal",
                },
                {
                    id: "numero_telefonico_1742294190390",
                    name: "Numero Telefonico",
                    type: "number",
                    required: false,
                    section: "personal",
                },
                {
                    id: "semestre_1742294209768",
                    name: "Semestre",
                    type: "select",
                    required: true,
                    section: "personal",
                    options: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
                },
                {
                    id: "programs_1742294260490",
                    name: "Programa",
                    type: "select",
                    required: true,
                    section: "personal",
                    options: ["Ingenieria", "Gastronomia", "Psicologia"],
                },
                {
                    id: "estrato_1742294281482",
                    name: "Estrato",
                    type: "select",
                    required: true,
                    section: "additional",
                    options: ["Bajo", "Medio", "Alto"],
                },
                {
                    id: "direccion_1742294297671",
                    name: "Direccion",
                    type: "text",
                    required: false,
                    section: "additional",
                },
            ],
            state: true,
        }),
    },
];
