"use client"
import React, { useState} from "react"
import Section from "@/components/ui/Section"

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

    const [events, setEvents] = useState<Event[]>([
    ])

  return (
    <div className="min-h-screen flex flex-col">
      <Section structure={structure} structureForm={structureForm} data={events} setData={setEvents} table={table}/>
    </div>
  )
}

