"use client"
import React from "react"
import Section from "@/components/ui/Section"
import { TableGeneric } from "@/components/services/TableGeneric"
import { configFormScenery, configScenery, tableScenery } from "@/config/Events"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function Scenerys() {
  return (
    <Section>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col">
          <CardTitle>{tableScenery.name}</CardTitle>
          <p className="text-muted-foreground">Listado de {tableScenery.name}</p>
        </CardHeader>
        <CardContent>
          <TableGeneric structure={configScenery} structureForm={configFormScenery} table={tableScenery} />
        </CardContent>
      </Card>
    </Section>
  )
}

