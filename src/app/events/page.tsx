"use client";
import React from "react";
import Section from "@/components/ui/Section";
import { TableGeneric } from "@/components/services/TableGeneric";
import { configEvent, configFormEvent, tableEvent } from "@/config/Events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function EventosPage() {
  return (
    <Section>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col">
          <CardTitle>{tableEvent.name}</CardTitle>
          <p className="text-muted-foreground">Listado de {tableEvent.name}</p>
        </CardHeader>
        <CardContent>
          <TableGeneric structure={configEvent} structureForm={configFormEvent} table={tableEvent} />
        </CardContent>
      </Card>
    </Section>
  );
}
