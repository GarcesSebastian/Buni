import { ConfigFaculty, ConfigFormFaculty, TableFaculty } from "@/types/Faculty"

export const tableFaculty: TableFaculty = {
    name: "Programas",
    key: "faculty",
}

export const configFaculty: ConfigFaculty[] = [
    { key: "id", value: "ID" },
    { key: "nombre", value: "Nombre" },
    { key: "state", value: "Estados" },
]

export const configFormFaculty: ConfigFormFaculty = {
    nombre: {
        name: "Nombre",
        type: "text"
    },
    state: {
        name: "Estado",
        type: "selection",
        options: [
            { value: "true", label: "Activo" },
            { value: "false", label: "Inactivo" }
        ]
    }
}