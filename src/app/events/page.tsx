"use client"
import React, { useState} from "react"
import Section from "@/components/ui/Section"
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

    console.log(optionsFacultades)

    const table = {
      name: "Eventos",
      key: "events",
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
        options: optionsFacultades
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

    const [events, setEvents] = useState<Event[]>([])

  return (
    <div className="min-h-screen flex flex-col">
        <Section structure={structure} structureForm={structureForm} data={events} setData={setEvents} table={table}/>
    </div>
  )
}

