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
    const table = {
      name: "Eventos",
      key: "events",
    }
    
    const structure = {
      id: "ID",
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

    const [events, setEvents] = useState<Event[]>([])

  return (
    <div className="min-h-screen flex flex-col">
        <Section structure={structure} structureForm={structureForm} data={events} setData={setEvents} table={table}/>
    </div>
  )
}

