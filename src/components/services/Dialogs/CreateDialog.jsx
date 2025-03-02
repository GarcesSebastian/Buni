"use client"

import { use, useEffect, useState } from "react"
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
import { useUserData } from "@/hooks/useUserData"

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

export function CreateEventDialog({ data, open, onOpenChange }) {
  const [formData, setFormData] = useState()
  const { user, setUser } = useUserData()
  
  const RestartFormData = () => {
    setFormData(() => {
      let obj = {}
      Object.keys(data.structureForm).map((value) => {
        obj[data.structureForm[value].name.toLowerCase()] = ""
      })
  
      return obj
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setUser({
      ...user,
      [data.table.key]: [...(user[data.table.key] || []), {
        ...formData,
        state: true,
      }],
    })

    RestartFormData()
    onOpenChange(false)
  }

  useEffect(() => {
    console.log(user)
  }, [user])

  useEffect(RestartFormData, [])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear dato para {data.table.name}</DialogTitle>
            <DialogDescription>Complete los datos para {data.table.name}</DialogDescription>
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
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

