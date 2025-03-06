"use client"
import React from "react"
import Section from "@/components/ui/Section"
import { TableGeneric } from "@/components/services/TableGeneric"

export type Event = {
  id: number
  nombre: string
  state: boolean
}

export default function Scenerys() {
    const table = {
      name: "Escenarios",
      key: "scenerys",
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

