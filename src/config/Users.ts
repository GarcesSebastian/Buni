import { ConfigFormUser, ConfigUser, TableUser } from "@/types/User"

export const tableUser: TableUser = {
    name: "Usuarios",
    key: "users",
}

export const configUser: ConfigUser[] = [
    { key: "id", value: "ID" },
    { key: "nombre", value: "Nombre" },
    { key: "email", value: "Correo" },
    { key: "password", value: "Contraseña" },
    { key: "role", value: "Rol" },
    { key: "state", value: "Estados" },
]

export const configFormUser: ConfigFormUser = {
    nombre: {
        name: "Nombre",
        type: "text"
    },
    email: {
        name: "Correo",
        type: "text"
    },
    password: {
        name: "Contraseña",
        type: "password"
    },
    role: {
        name: "Rol",
        type: "selection",
        options: [
            { value: "admin", label: "Administrador" },
            { value: "user", label: "Usuario" }
        ]
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
