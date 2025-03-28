export type sectionFieldForm = "personal" | "academica" | "adicional";
export type typeFieldForm = "texto" | "numero" | "email" | "fecha" | "seleccion" | "checkbox";

export interface Form {
  id: number
  nombre: string
  descripcion: string
  campos: FormField[]
  state: boolean
  value?: string
  data?: {
    id: number
    nombre: string
    descripcion: string
    campos: FormField[]
    state: boolean
  }
}

export interface FormField {
  id: string
  nombre: string
  tipo: typeFieldForm
  requerido: boolean
  opciones?: string[]
  valor?: string
  seccion?: string
}