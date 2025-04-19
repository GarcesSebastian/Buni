import { configQualificationIcons } from "@/config/Forms"

export type sectionFieldForm = "personal" | "academic" | "additional";
export type typeFieldForm = "text" | "number" | "email" | "date" | "time" | "checkbox" | "qualification" | "select" | "checklist_single" | "checklist_multiple" | "checklist_single_grid" | "checklist_multiple_grid";

export interface Form {
  id: number
  name: string
  description: string
  fields: FormField[]
  state: boolean
}

export interface FormField {
  id: string
  name: string
  type: typeFieldForm
  required: boolean
  section: sectionFieldForm
  options?: (string | { row: string; data: string[]; })[]
  value?: string
  maxQualification?: number
  qualificationIcon?: typeof configQualificationIcons[number]["id"]
}

export interface Qualification {
  id: number
  name: string
  description: string
  options: string[]
}
