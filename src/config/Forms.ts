export const configField = [
    { id: "texto", nombre: "Texto", key: "text" },
    { id: "numero", nombre: "Número", key: "number" },
    { id: "email", nombre: "Email", key: "email" },
    { id: "fecha", nombre: "Fecha", key: "date" },
    { id: "hora", nombre: "Hora", key: "time" },
    { id: "seleccion", nombre: "Selección", key: "selection" },
    { id: "checkbox", nombre: "Casilla de verificación", key: "checkbox" },
    { id: "qualification", nombre: "Calificación", key: "qualification" },
    { id: "checklist_unico", nombre: "Lista de selección única", key: "checklist_unique" },
    { id: "checklist_multiple", nombre: "Lista de selección múltiple", key: "checklist_multiple" },
    { id: "checklist_unico_grid", nombre: "Lista de selección única en cuadricula", key: "checklist_unique_grid" },
    { id: "checklist_multiple_grid", nombre: "Lista de selección múltiple en cuadricula", key: "checklist_multiple_grid" },
]

export const configFieldSection = [
    { id: "personal", nombre: "Personal", key: "personal" },
    { id: "academica", nombre: "Academica", key: "academy" },
    { id: "adicional", nombre: "Adicional", key: "additional" },
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