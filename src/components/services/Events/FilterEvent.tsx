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
      if (fieldInfo?.type === "select" || 
          fieldInfo?.type === "checklist_single" || 
          fieldInfo?.type === "checklist_multiple") {
        onFilter(selectedOptions)
      } else if (fieldInfo?.type === "qualification") {
        onFilter(selectedOptions.length > 0 ? selectedOptions : ["0"])
      } else if (fieldInfo?.type === "checkbox") {
        onFilter(filterValue)
      } else {
        onFilter(filterValue)
      }
    }
    setFilterValue("")
    setSelectedOptions([])
    onClose()
  }

  const handleOptionToggle = (option: string) => {
    if (fieldInfo?.type === "checklist_multiple" || 
        fieldInfo?.type === "select" || 
        fieldInfo?.type === "checklist_single" ||
        fieldInfo?.type === "qualification") {
      setSelectedOptions(prev => 
        prev.includes(option) 
          ? prev.filter(opt => opt !== option)
          : [...prev, option]
      )
    } else {
      setSelectedOptions([option])
    }
  }

  const getFieldInfo = () => {
    if (!column || !form) return null

    const fieldKey = column.split("_")[0]
    return form.fields.find(field => field.id.split("_")[0] === fieldKey)
  }

  const fieldInfo = getFieldInfo()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-auto max-w-[90vw] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filtrar por {fieldInfo?.name || column}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fieldInfo?.type === "select" || 
           fieldInfo?.type === "checklist_single" || 
           fieldInfo?.type === "checklist_multiple" || 
           fieldInfo?.type === "qualification" ? (
            <div className="grid gap-2">
              <Label>Seleccionar opciones</Label>
              <div className="border rounded-md p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fieldInfo.type === "qualification" ? (
                    <>
                      {Array.from({ length: fieldInfo.maxQualification || 5 }).map((_, index) => {
                        const value = (index + 1).toString()
                        return (
                          <button
                            key={value}
                            onClick={() => handleOptionToggle(value)}
                            className={`px-3 py-1.5 text-sm rounded-md border transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-muted ${
                              selectedOptions.includes(value)
                                ? "bg-muted border-foreground/20"
                                : "bg-background border-input hover:border-foreground/20"
                            }`}
                          >
                            {value}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => handleOptionToggle("0")}
                        className={`px-3 py-1.5 text-sm rounded-md border transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-muted ${
                          selectedOptions.includes("0")
                            ? "bg-muted border-foreground/20"
                            : "bg-background border-input hover:border-foreground/20"
                        }`}
                      >
                        Ninguna
                      </button>
                    </>
                  ) : (
                    fieldInfo.options?.map((option) => (
                      <button
                        key={typeof option === 'string' ? option : option.row}
                        onClick={() => handleOptionToggle(typeof option === 'string' ? option : option.row)}
                        className={`px-3 py-1.5 text-sm rounded-md border transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-muted ${
                          selectedOptions.includes(typeof option === 'string' ? option : option.row)
                            ? "bg-muted border-foreground/20"
                            : "bg-background border-input hover:border-foreground/20"
                        }`}
                      >
                        {typeof option === 'string' ? option : option.row}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : fieldInfo?.type === "checkbox" ? (
            <div className="grid gap-2">
              <Label>Estado</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterValue("true")}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    filterValue === "true" ? "bg-muted border-foreground/20" : "bg-background border-input"
                  }`}
                >
                  Sí
                </button>
                <button
                  onClick={() => setFilterValue("false")}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    filterValue === "false" ? "bg-muted border-foreground/20" : "bg-background border-input"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="filterValue">Valor</Label>
              <Input
                id="filterValue"
                type={fieldInfo?.type === "number" ? "number" : "text"}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder={`Buscar por ${fieldInfo?.name || column}`}
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
            disabled={
              (fieldInfo?.type === "select" || 
               fieldInfo?.type === "checklist_single" || 
               fieldInfo?.type === "checklist_multiple" ||
               fieldInfo?.type === "qualification") && 
              selectedOptions.length === 0
            }
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

