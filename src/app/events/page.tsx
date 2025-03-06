"use client"
import React from "react"
import Section from "@/components/ui/Section"
import { TableGeneric } from "@/components/services/TableGeneric"
import { useUserData } from "@/hooks/useUserData"

export type Event = {
  id: number
  nombre: string
  organizador: string
  state: boolean
  fecha: string
  facultad: string
  scenery: string
}

export default function EventosPage() {
  const { user } = useUserData()

  const optionsFacultades = user.faculties?.filter((faculty: { state: string }) => faculty.state === "true")
  .map((faculty: { id: number, nombre: string, state: string }) => {
    return {
      value: faculty.nombre,
      label: faculty.nombre.charAt(0).toUpperCase() + faculty.nombre.slice(1)
    }
  })

  const optionsScenerys = user.scenerys?.filter((scenery: { state: string }) => scenery.state === "true")
  .map((scenery: { id: number, nombre: string, state: string }) => {
    return {
      value: scenery.nombre,
      label: scenery.nombre.charAt(0).toUpperCase() + scenery.nombre.slice(1)
    }
  })

  const table = {
    name: "Eventos",
    key: "events",
    isQR: true
  }
  
  const structure = {
    id: "ID",
    nombre: "Nombre",
    organizador: "Organizador",
    fecha: "Fecha",
    facultad: "Facultad",
    scenery: "Escenario",
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
    fecha: {
      name: "Fecha",
      type: "date"
    },
    facultad: {
      name: "Facultad",
      type: "selection",
      options: optionsFacultades
    },
    scenery: {
      name: "Escenario",
      type: "selection",
      options: optionsScenerys
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

