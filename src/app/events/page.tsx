"use client"
import React, { useState} from "react"
import { TableGeneric } from "@/components/services/TableGeneric"
import { SideBar } from '@/components/ui/SideBar'

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
      <div className="flex flex-1 flex-row max-md:flex-col">
      <SideBar/>
        <main className="flex-1 p-4 sm:p-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Eventos</h1>
            <p className="text-muted-foreground">Listado de Eventos</p>
            <TableGeneric structure={structure} data={events} setData={setEvents} />
          </div>
        </main>
      </div>
    </div>
  )
}

