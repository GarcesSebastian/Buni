export type sectionFieldForm = "personal" | "academica" | "adicional";
export type typeFieldForm = "texto" | "numero" | "email" | "fecha" | "seleccion" | "checkbox" | "checklist_unico" | "checklist_multiple" | "qualification";

export interface Form {
  id: number
  nombre: string
  descripcion: string
  campos: FormField[]
  state: boolean
}

export interface FormField {
  id: string
  nombre: string
  tipo: typeFieldForm
  requerido: boolean
  opciones?: string[]
  valor?: string
  seccion?: string
  maxQualification?: number
  qualificationIcon?: "star" | "heart" | "thumbs-up"
}

export interface Qualification {
  id: number
  nombre: string
  descripcion: string
  opciones: string[]
}
