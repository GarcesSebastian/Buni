import { ConfigEvent, ConfigEventForm, ConfigFormScenery, ConfigScenery, TableEvent, TableScenery } from "@/types/Events"

export const tableEvent: TableEvent = {
    name: "Eventos",
    key: "events",
    isQR: true,
    isView: true,
}

export const configEvent: ConfigEvent[] = [
    { key: "id", value: "ID", filter: true },
    { key: "nombre", value: "Nombre", filter: true },
    { key: "organizador", value: "Organizador", filter: true },
    { key: "cupos", value: "Cupos", filter: true },
    { key: "horarioInicio", value: "Horario de Inicio", filter: true },
    { key: "horarioFin", value: "Horario de Fin", filter: true },
    { key: "programs", value: "Programas", filter: true },
    { key: "scenery", value: "Escenario", filter: true },
    { key: "formAssists", value: "Formulario de Asistencias", filter: true },
    { key: "formInscriptions", value: "Formulario de Inscripciones", filter: true },
    { key: "state", value: "Estados", filter: true },
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
    horarioInicio: {
        name: "Horario de Inicio",
        type: "datetime-local"
    },
    horarioFin: {
        name: "Horario de Fin",
        type: "datetime-local"
    },
    programs: {
        name: "Programa",
        type: "select",
        options: []
    },
    scenery: {
        name: "Escenario",
        type: "select",
        options: []
    },
    formAssists: {
        name: "Formulario de Asistencia",
        type: "select",
        options: []
    },
    formInscriptions: {
        name: "Formulario de Inscripcion",
        type: "select",
        options: []
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

export const tableScenery: TableScenery = {
    name: "Escenarios",
    key: "scenery",
}

export const configScenery: ConfigScenery[] = [
    { key: "id", value: "ID", filter: true },
    { key: "name", value: "Nombre", filter: true },
    { key: "state", value: "Estados", filter: true },
]

export const configFormScenery: ConfigFormScenery = {
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