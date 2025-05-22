import { ConfigFormUser, ConfigUser, TableUser } from "@/types/User"

export const tableUser: TableUser = {
    name: "Usuarios",
    key: "users",
    isUser: true
}

export const configUser: ConfigUser[] = [
    { key: "id", value: "ID", filter: false },
    { key: "name", value: "Nombre", filter: true },
    { key: "email", value: "Correo", filter: true },
    { key: "roles", value: "Rol", filter: false },
]

export const configFormUser: ConfigFormUser = {
    name: {
        name: "Nombre",
        type: "text",
        required: true
    },
    email: {
        name: "Correo",
        type: "email",
        required: true
    },
    password: {
        name: "Contraseña",
        type: "password",
        required: true,
        noEdit: true
    },
    roles: {
        name: "Rol",
        type: "select",
        required: true,
        options: []
    }
}
