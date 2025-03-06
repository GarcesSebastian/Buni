"use client"
import React from "react"
import Section from "@/components/ui/Section"
import { TableGeneric } from "@/components/services/TableGeneric"

export type Faculty = {
  id: number
  nombre: string
  organizador: string
  state: boolean
  fecha: string
  escenario: string
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
        type: "selection",
        options: [
          { value: "true", label: "Activo" },
          { value: "false", label: "Inactivo" }
        ]
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

  return (
    <div className="flex h-full flex-col">
        <Section>
          <div className="space-y-4 p-4 shadow-lg shadow-black/5 rounded-lg bg-white">
              <h1 className="text-2xl font-bold">{table.name}</h1>
              <p className="text-muted-foreground">Listado de {table.name}</p>
              <TableGeneric structure={structure} structureForm={structureForm} table={table} />
          </div>
        </Section>
    </div>
  )
}

