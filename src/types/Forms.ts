import { configQualificationIcons } from "@/config/Forms"

export type sectionFieldForm = "personal" | "academica" | "adicional";
export type typeFieldForm = "texto" | "numero" | "email" | "fecha" | "hora" | "checkbox" | "qualification" | "seleccion" | "checklist_unico" | "checklist_multiple" | "checklist_unico_grid" | "checklist_multiple_grid";

export interface Form {
  id: number
  name: string
  descripcion: string
  campos: FormField[]
  state: boolean
}

export interface FormField {
  id: string
  nombre: string
  tipo: typeFieldForm
  requerido: boolean
  seccion: sectionFieldForm
  opciones?: (string | { row: string; data: string[]; })[]
  valor?: string
  maxQualification?: number
  qualificationIcon?: typeof configQualificationIcons[number]["id"]
}

export interface Qualification {
  id: number
  nombre: string
  descripcion: string
  opciones: string[]
}
