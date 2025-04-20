export const fieldsDistribution = [
    "select",
    "checklist_single",
    "checklist_multiple",
    "checklist_single_grid",
    "checklist_multiple_grid",
]

export const configField = [
    { id: "text", name: "Texto", key: "text" },
    { id: "number", name: "Número", key: "number" },
    { id: "email", name: "Email", key: "email" },
    { id: "date", name: "Fecha", key: "date" },
    { id: "time", name: "Hora", key: "time" },
    { id: "select", name: "Selección", key: "select" },
    { id: "checkbox", name: "Casilla de verificación", key: "checkbox" },
    { id: "qualification", name: "Calificación", key: "qualification" },
    { id: "checklist_single", name: "Lista de selección única", key: "checklist_single" },
    { id: "checklist_multiple", name: "Lista de selección múltiple", key: "checklist_multiple" },
    { id: "checklist_single_grid", name: "Lista de selección única en cuadricula", key: "checklist_single_grid" },
    { id: "checklist_multiple_grid", name: "Lista de selección múltiple en cuadricula", key: "checklist_multiple_grid" },
]

export const configFieldSection = [
    { id: "personal", name: "Personal", key: "personal" },
    { id: "academic", name: "Academica", key: "academy" },
    { id: "additional", name: "Adicional", key: "additional" },
]

export const configQualification = {
    min: 1,
    max: 10,
    default: 5,
    step: 1
}

export const configQualificationIcons = [
    {
        id: "star",
        name: "Estrella",
        icon: "Star",
        selectedColor: "text-yellow-400 fill-yellow-400",
        unselectedColor: "text-gray-300 fill-none"
    },
    {
        id: "heart",
        name: "Corazón",
        icon: "Heart",
        selectedColor: "text-red-500 fill-red-500",
        unselectedColor: "text-gray-300 fill-none"
    },
    {
        id: "thumbs-up",
        name: "Pulgar arriba",
        icon: "ThumbsUp",
        selectedColor: "text-blue-500 fill-blue-500",
        unselectedColor: "text-gray-300 fill-none"
    }
] as const