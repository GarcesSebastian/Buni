"use client"
import React, { useState} from "react"
import { TableGeneric } from "@/components/services/TableGeneric"
import { SideBar } from '@/components/ui/SideBar'

export type Event = {
  id: number
  nombre: string
  organizador: string
  active: boolean
  fecha: string
  facultad: string
}

export default function Scenerys() {
    const structure = {
      nombre: "Nombre",
      organizador: "Organizador",
      active: "Estados"
    }

    const [events, setEvents] = useState<Event[]>([
    ])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 flex-row max-md:flex-col">
      <SideBar/>
        <main className="flex-1 p-4 sm:p-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Escenarios</h1>
            <p className="text-muted-foreground">Listado de Escenarios</p>
            <TableGeneric structure={structure} data={events} setData={setEvents} />
          </div>
        </main>
      </div>
    </div>
  )
}

