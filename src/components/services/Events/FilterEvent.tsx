"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"
  import { Form } from "@/types/Forms"

interface FilterDialogProps {
  column: string | null
  onFilter: (value: string | string[]) => void
  onClose: () => void
  open: boolean
  form?: Form
}

export function FilterDialog({ column, onFilter, onClose, open, form }: FilterDialogProps) {
  const [filterValue, setFilterValue] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleApplyFilter = () => {
    if (column) {
      if (fieldInfo?.tipo === "seleccion") {
        onFilter(selectedOptions)
      } else {
        onFilter(filterValue)
      }
    }
    setFilterValue("")
    setSelectedOptions([])
    onClose()
  }

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(opt => opt !== option)
        : [...prev, option]
    )
  }

  const getFieldInfo = () => {
    if (!column || !form) return null

    const fieldKey = column.split("_")[0]
    return form.campos.find(campo => campo.id.split("_")[0] === fieldKey)
  }

  const fieldInfo = getFieldInfo()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-auto max-w-[90vw] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filtrar por {fieldInfo?.nombre || column}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fieldInfo?.tipo === "seleccion" ? (
            <div className="grid gap-2">
              <Label>Seleccionar opciones</Label>
              <div className="border rounded-md p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fieldInfo.opciones?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionToggle(option)}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-muted ${
                        selectedOptions.includes(option)
                          ? "bg-muted border-foreground/20"
                          : "bg-background border-input hover:border-foreground/20"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="filterValue">Valor</Label>
              <Input
                id="filterValue"
                type={fieldInfo?.tipo === "numero" ? "number" : "text"}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder={`Buscar por ${fieldInfo?.nombre || column}`}
                autoFocus
                className="focus-visible:ring-muted"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleApplyFilter}
            disabled={fieldInfo?.tipo === "seleccion" && selectedOptions.length === 0}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

