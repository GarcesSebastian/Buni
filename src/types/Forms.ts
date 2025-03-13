export interface CampoFormulario {
  id: string
  nombre: string
  tipo: string
  requerido: boolean
  opciones?: string[]
}

export interface Form {
  id: number
  nombre: string
  descripcion: string
  campos: CampoFormulario[]
  state: boolean
}