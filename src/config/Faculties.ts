import { ConfigFaculty, ConfigFormFaculty, TableFaculty } from "@/types/Faculty"

export const tableFaculty: TableFaculty = {
    name: "Programas",
    key: "faculty",
}

export const configFaculty: ConfigFaculty[] = [
    { key: "id", value: "ID", filter: true },
    { key: "name", value: "Nombre", filter: true },
    { key: "state", value: "Estados", filter: true },
]

export const configFormFaculty: ConfigFormFaculty = {
    name: {
        name: "Nombre",
        type: "text"
    },
    state: {
        name: "Estado",
        type: "select",
        options: [
            { value: "true", label: "Activo" },
            { value: "false", label: "Inactivo" }
        ]
    }
}