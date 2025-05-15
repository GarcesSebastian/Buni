import { ConfigPrograms, ConfigFormPrograms, TablePrograms } from "@/types/Programs"

export const tablePrograms: TablePrograms = {
    name: "Programas",
    key: "programs",
}

export const configPrograms: ConfigPrograms[] = [
    { key: "id", value: "ID", filter: true },
    { key: "name", value: "Nombre", filter: true },
    { key: "state", value: "Estados", filter: true },
]

export const configFormPrograms: ConfigFormPrograms = {
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