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
      name: "Facultades",
      key: "faculties",
    }

    const structure = {
      nombre: "Nombre",
      organizador: "Organizador",
      aniversario: "Aniversario",
      state: "Estados"
    }

    const structureForm = {
      nombre: {
        name: "Nombre",
        type: "text"
      },
      organizador: {
        name: "Organizador",
        type: "text"
      },
      aniversario: {
        name: "Aniversario",
        type: "date"
      },
      facultad: {
        name: "Facultad",
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

