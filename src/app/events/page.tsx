"use client"
import React, { useState} from "react"
import Section from "@/components/ui/Section"

export type Event = {
  id: number
  nombre: string
  organizador: string
  state: boolean
  fecha: string
  facultad: string
}

export default function EventosPage() {
    const structure = {
      nombre: "Nombre",
      organizador: "Organizador",
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
        type: "selection"
      }
    }

    const [events, setEvents] = useState<Event[]>([
      {
        id: 1,
        nombre: "Campeonato Futsal",
        organizador: "Balon de Oro",
        state: true,
        fecha: "2024-02-20",
        facultad: "Deportes",
      },
      {
        id: 2,
        nombre: "Conferencia de Ingeniería",
        organizador: "Facultad de Ingeniería",
        state: false,
        fecha: "2024-03-15",
        facultad: "Ingeniería",
      },
    ])

  return (
    <div className="min-h-screen flex flex-col">
        <Section structure={structure} structureForm={structureForm} data={events} setData={setEvents} name={"Eventos"}/>
    </div>
  )
}

