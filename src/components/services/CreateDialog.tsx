"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import type { Event } from "./Events"

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (event: Omit<Event, "id">) => void
}

export function CreateEventDialog({ open, onOpenChange, onSubmit }: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    organizador: "",
    fecha: "",
    facultad: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      active: true,
    })
    setFormData({
      nombre: "",
      organizador: "",
      fecha: "",
      facultad: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Evento</DialogTitle>
            <DialogDescription>Complete los datos del evento a crear</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="organizer">Organizador</Label>
              <Input
                id="organizer"
                value={formData.organizador}
                onChange={(e) => setFormData({ ...formData, organizador: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="faculty">Facultad</Label>
              <Select
                value={formData.facultad}
                onValueChange={(value) => setFormData({ ...formData, facultad: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una facultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingenieria">Ingeniería</SelectItem>
                  <SelectItem value="medicina">Medicina</SelectItem>
                  <SelectItem value="derecho">Derecho</SelectItem>
                  <SelectItem value="deportes">Deportes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#DC2626] hover:bg-[#DC2626]/90">
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

