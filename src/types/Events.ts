import { Form } from "./Forms"

export interface Event {
  id: number
  nombre: string
  organizador: string
  scenerys: string
  faculties: string
  cupos: number
  fecha: string
  hora: string
  state: boolean
  forms: {
    value: string,
    data: Form
  }
}

export interface ConfigEvent {
    id: number
    nombre: string
    organizador: string
    scenery: string
    faculty: string
    cupos: number
    fecha: string
    hora: string
    state: boolean
    form: string
}

export interface ConfigEventForm {
  nombre: {
    name: string
    type: string
  }
  organizador: {
    name: string
    type: string
  }
  cupos: {
    name: string
    type: string
  }
  hora: {
    name: string
    type: string
  }
  fecha: {
    name: string
    type: string
  }
  faculties: {
    name: string
    type: string
    options: { value: string, label: string, id: number }[]
  }
  scenerys: {
    name: string
    type: string
    options: { value: string, label: string, id: number }[]
  }
  forms: {
    name: string
    type: string
    options: { value: string, label: string, id: number }[]
  }
  state: {
    name: string
    type: string
    options: { value: string, label: string }[]
  }
}