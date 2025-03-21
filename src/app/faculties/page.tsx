"use client"
import React from "react"
import Section from "@/components/ui/Section"
import { TableGeneric } from "@/components/services/TableGeneric"
import { configFaculty, tableFaculty, configFormFaculty } from "@/config/Faculties"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function FacultiesPage() {
  return (
    <Section>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col">
          <CardTitle>{tableFaculty.name}</CardTitle>
          <p className="text-muted-foreground">Listado de {tableFaculty.name}</p>
        </CardHeader>
        <CardContent>
          <TableGeneric structure={configFaculty} structureForm={configFormFaculty} table={tableFaculty} />
        </CardContent>
      </Card>
    </Section>
  )
}

