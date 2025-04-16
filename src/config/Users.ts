import { ConfigFormUser, ConfigUser, TableUser } from "@/types/User"

export const tableUser: TableUser = {
    name: "Usuarios",
    key: "users",
}

export const configUser: ConfigUser[] = [
    { key: "id", value: "ID", filter: false },
    { key: "nombre", value: "Nombre", filter: true },
    { key: "email", value: "Correo", filter: true },
    { key: "password", value: "Contraseña", filter: false },
    { key: "roles", value: "Rol", filter: false },
]

export const configFormUser: ConfigFormUser = {
    nombre: {
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
        required: true
    },
    roles: {
        name: "Rol",
        type: "selection",
        required: true,
        options: []
    }
}
