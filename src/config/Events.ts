import { ConfigEvent, ConfigEventForm, ConfigFormScenery, ConfigScenery, TableEvent, TableScenery } from "@/types/Events"

export const tableEvent: TableEvent = {
    name: "Eventos",
    key: "events",
    isQR: true,
    isView: true,
}

export const configEvent: ConfigEvent[] = [
    { key: "id", value: "ID" },
    { key: "nombre", value: "Nombre" },
    { key: "organizador", value: "Organizador" },
    { key: "cupos", value: "Cupos" },
    { key: "hora", value: "Hora" },
    { key: "fecha", value: "Fecha" },
    { key: "faculty", value: "Programas" },
    { key: "scenery", value: "Escenario" },
    { key: "formAssists", value: "Formulario de Asistencias" },
    { key: "formInscriptions", value: "Formulario de Inscripciones" },
    { key: "state", value: "Estados" },
]

export const configFormEvent: ConfigEventForm = {
    nombre: {
        name: "Nombre",
        type: "text"
    },
    organizador: {
        name: "Organizador",
        type: "text"
    },
    cupos: {
        name: "Cupos",
        type: "number"
    },
    hora: {
        name: "Hora",
        type: "time"
    },
    fecha: {
        name: "Fecha",
        type: "date"
    },
    faculty: {
        name: "Programa",
        type: "selection",
        options: []
    },
    scenery: {
        name: "Escenario",
        type: "selection",
        options: []
    },
    formAssists: {
        name: "Formulario de Asistencia",
        type: "selection",
        options: []
    },
    formInscriptions: {
        name: "Formulario de Inscripcion",
        type: "selection",
        options: []
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

export const tableScenery: TableScenery = {
    name: "Escenarios",
    key: "scenery",
}

export const configScenery: ConfigScenery[] = [
    { key: "id", value: "ID" },
    { key: "name", value: "Nombre" },
    { key: "state", value: "Estados" },
]

export const configFormScenery: ConfigFormScenery = {
    name: {
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