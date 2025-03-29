import { ConfigFormUser, ConfigUser, TableUser } from "@/types/User"

export const tableUser: TableUser = {
    name: "Usuarios",
    key: "users",
}

export const configUser: ConfigUser[] = [
    { key: "id", value: "ID" },
    { key: "nombre", value: "Nombre" },
    { key: "email", value: "Correo" },
    { key: "role", value: "Rol" },
    { key: "created_at", value: "Fecha de Creación" },
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
