"use client"
import React from "react"
import Section from "@/components/ui/Section"
import { TableGeneric } from "@/components/services/TableGeneric"
import { configUser, configFormUser, tableUser } from "@/config/Users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function UsersPage() {
  return (
      <Section>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col">
            <CardTitle>{tableUser.name}</CardTitle>
            <p className="text-muted-foreground">Listado de {tableUser.name}</p>
          </CardHeader>
          <CardContent>
            <TableGeneric structure={configUser} structureForm={configFormUser} table={tableUser} />
          </CardContent>
        </Card>
      </Section>
  )
}