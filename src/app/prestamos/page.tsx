"use client"
import React, { useState} from "react"
import Section from "@/components/ui/Section"

export type Faculty = {
  id: number
  nombre: string
  organizador: string
  state: boolean
  fecha: string
  facultad: string
}

export default function FacultiesPage() {
    const table = {
      name: "Prestamos",
      key: "loans",
    }

    const structure = {
      id: "ID",
      nombre: "Nombre",
      codigo: "Codigo",
      ["fecha registro"]: "Fecha Registro",
      escenario: "Escenario",
      state: "Estados"
    }

    const structureForm = {
      nombre: {
        name: "Nombre",
        type: "text"
      },
      codigo: {
        name: "Codigo",
        type: "number"
      },
      ["fecha registro"]: {
        name: "Fecha Registro",
        type: "date"
      },
      escenario: {
        name: "Escenario",
        type: "selection"
      }
    }

    const [faculties, setFaculties] = useState<Faculty[]>([])

  return (
    <div className="min-h-screen flex flex-col">
        <Section structure={structure} structureForm={structureForm} data={faculties} setData={setFaculties} table={table}/>
    </div>
  )
}

