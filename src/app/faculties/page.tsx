"use client"
import React, { useState} from "react"
import Section from "@/components/ui/Section"

export type Faculty = {
  id: number
  nombre: string
  state: boolean
}

export default function FacultiesPage() {
    const table = {
      name: "Facultades",
      key: "faculties",
    }

    const structure = {
      id: "ID",
      nombre: "Nombre",
      state: "Estados"
    }

    const structureForm = {
      nombre: {
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

    const [faculties, setFaculties] = useState<Faculty[]>([])

  return (
    <div className="min-h-screen flex flex-col">
        <Section structure={structure} structureForm={structureForm} data={faculties} setData={setFaculties} table={table}/>
    </div>
  )
}

