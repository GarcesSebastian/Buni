"use client"
import React from "react"
import Section from "@/components/ui/Section"
import { TableGeneric } from "@/components/services/TableGeneric"
import { configPrograms, tablePrograms, configFormPrograms } from "@/config/Programs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function ProgramsPage() {
  return (
    <Section>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col">
          <CardTitle>{tablePrograms.name}</CardTitle>
          <p className="text-muted-foreground">Listado de {tablePrograms.name}</p>
        </CardHeader>
        <CardContent>
          <TableGeneric structure={configPrograms} structureForm={configFormPrograms} table={tablePrograms} />
        </CardContent>
      </Card>
    </Section>
  )
}

