export const configField = [
    { id: "texto", nombre: "Texto" },
    { id: "numero", nombre: "Número" },
    { id: "email", nombre: "Email" },
    { id: "fecha", nombre: "Fecha" },
    { id: "seleccion", nombre: "Selección" },
    { id: "checkbox", nombre: "Casilla de verificación" },
    { id: "checklist_unico", nombre: "Lista de selección única" },
    { id: "checklist_multiple", nombre: "Lista de selección múltiple" },
    { id: "qualification", nombre: "Calificación" },
]

export const configFieldSection = [
    { id: "personal", nombre: "Personal" },
    { id: "academica", nombre: "Academica" },
    { id: "adicional", nombre: "Adicional" },
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