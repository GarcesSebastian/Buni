"use client"

import { useState, useEffect } from "react"
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

const InputBasic = ({formData, data}) => {
  if(data.type == "text" || data.type == "number" || data.type == "date"){
    return(
      <>
        <Label>{data.name}</Label>
        <Input
          key={data.key}
          type={data.type}
          value={formData[data.name.toLowerCase()]}
          onChange={data.onChange}
          required
        />
      </>
    )
  }else if(data.type == "selection"){
    return(
      <>
      <Label htmlFor="faculty">{data.name}</Label>
      <Select
        key={data.key}
        value={formData.facultad}
        onValueChange={data.onChange}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder={`Seleccione una ${data.name.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ingenieria">Ingeniería</SelectItem>
          <SelectItem value="medicina">Medicina</SelectItem>
          <SelectItem value="derecho">Derecho</SelectItem>
          <SelectItem value="deportes">Deportes</SelectItem>
        </SelectContent>
      </Select>
      </>
    )
  }
}

export function EditDialog({ data, open, onOpenChange, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    nombre: "",
    organizador: "",
    fecha: "",
    facultad: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSubmit = (e) => {
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
            <DialogTitle>Editar dato para {data.name}</DialogTitle>
            <DialogDescription>Complete los datos para {data.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.keys(data.structureForm).map((value, index) => (
              <div key={index} className="grid gap-2">
                <InputBasic
                  formData={formData}
                  data={{
                    name: data.structureForm[value].name,
                    type: data.structureForm[value].type,
                    onChange: (e) => setFormData({ ...formData, [data.structureForm[value].name.toLowerCase()]: e.target?.value == undefined ? e : e.target.value }),
                    key: index
                  }}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#DC2626] hover:bg-[#DC2626]/90">
              Editar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

