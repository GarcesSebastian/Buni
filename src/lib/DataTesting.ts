import { Form, FormField } from "@/types/Forms";

interface Registro {
    [key: string]: string | number | Record<string, string | string[]>;
}

export async function generateSampleData(count: number, form: Form | undefined, onProgress?: (progress: number) => void) {
    if (!form) return [];

    const data: Registro[] = [];
    const fields = form.fields;

    const getRandomValue = (field: FormField): string | number | Record<string, string | string[]> => {
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
                registro[key] = getRandomValue(field as FormField);
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