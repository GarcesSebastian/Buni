"use client"
import React from "react"
import Section from "@/components/ui/Section"
import { TableGeneric } from "@/components/services/TableGeneric"
import { configFormScenery, configScenery, tableScenery } from "@/config/Events"

export default function Scenerys() {
  return (
      <div className="flex h-full flex-col">
          <Section>
            <div className="space-y-4 p-4 shadow-lg shadow-black/5 rounded-lg bg-white">
                <h1 className="text-2xl font-bold">{tableScenery.name}</h1>
                <p className="text-muted-foreground">Listado de {tableScenery.name}</p>
                <TableGeneric structure={configScenery} structureForm={configFormScenery} table={tableScenery} />
            </div>
          </Section>
      </div>
  )
}

