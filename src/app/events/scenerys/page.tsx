"use client"
import React, { useState} from "react"
import Section from "@/components/ui/Section"

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
      <Section structure={structure} data={events} setData={setEvents} name={"Escenarios"}/>
    </div>
  )
}

