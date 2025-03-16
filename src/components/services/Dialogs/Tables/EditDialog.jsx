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
import { useUserData } from "@/hooks/useUserData"

const InputBasic = ({formData, data}) => {
  if(data.form.type == "text" || data.form.type == "number" || data.form.type == "date"){
    return(
      <>
        <Label>{data.form.name}</Label>
        <Input
          key={data.index}
          type={data.form.type}
          value={formData[data.key.toLowerCase()]}
          onChange={data.onChange}
          required
        />
      </>
    )
  }else if(data.form.type == "selection"){
    return(
      <>
      <Label htmlFor="faculty">{data.form.name}</Label>
      <Select
        key={data.index}
        value={formData[data.key.toLowerCase()]}
        onValueChange={data.onChange}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder={`Seleccione una ${data.form.name.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {data.form.options.length > 0 ? (
            data.form.options.map((option, index) => (
              <SelectItem key={index} value={`${option.value}${option.id ? '_' + option.id : ''}`}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <p className="text-gray-500 text-sm p-2">No se encontraron opciones</p>
          )}
        </SelectContent>
      </Select>
      </>
    )
  }
}

export function EditDialog({ data, open, onOpenChange, initialData }) {
  const { user, setUser } = useUserData()
  const [formData, setFormData] = useState()
  
  const RestartFormData = () => {
    setFormData(() => {
      let obj = {}
      Object.keys(data.structureForm).map((value) => {
        obj[value.toLowerCase()] = ""
      })
  
      return obj
    })
  }

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    setUser({
      ...user,
      [data.table.key]: user[data.table.key].map((item) =>
        item.id === initialData.id ? { ...item, ...{
          ...formData,
          active: true,
        } } : item
      ),
    })

    RestartFormData()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar dato para {data.table.name}</DialogTitle>
            <DialogDescription>Complete los datos para {data.table.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.keys(data.structureForm).map((value, index) => (
              <div key={index} className="grid gap-2">
                <InputBasic
                  formData={formData}
                  data={{
                    form: data.structureForm[value],
                    onChange: (e) => setFormData({ ...formData, [value.toLowerCase()]: e.target?.value == undefined ? e : e.target.value }),
                    key: value,
                    index: index
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

