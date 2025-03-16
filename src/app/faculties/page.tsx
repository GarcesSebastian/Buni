"use client"
import React from "react"
import Section from "@/components/ui/Section"
import { TableGeneric } from "@/components/services/TableGeneric"
import { configFaculty, tableFaculty, configFormFaculty } from "@/config/Faculties"

export default function FacultiesPage() {
  return (
    <div className="flex h-full flex-col">
        <Section>
          <div className="space-y-4 p-4 shadow-lg shadow-black/5 rounded-lg bg-white">
              <h1 className="text-2xl font-bold">{tableFaculty.name}</h1>
              <p className="text-muted-foreground">Listado de {tableFaculty.name}</p>
              <TableGeneric structure={configFaculty} structureForm={configFormFaculty} table={tableFaculty} />
          </div>
        </Section>
    </div>
  )
}

