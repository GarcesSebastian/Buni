"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  column: string | null
  onFilter: (value: string) => void
  onSort: (direction: "asc" | "desc" | null) => void
}

export function FilterDialog({ open, onOpenChange, column, onFilter, onSort }: FilterDialogProps) {
  const [filterValue, setFilterValue] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")

  const handleFilter = () => {
    if (column === "fecha") {
      onFilter(`${year}` || `${month}` || `${day}`)
    } else {
      onFilter(filterValue)
    }
    onSort(sortDirection)
    setFilterValue("")
    setYear("")
    setMonth("")
    setDay("")
    setSortDirection(null)
    onOpenChange(false)
  }

  console.log(column)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Filtrar y ordenar por {column}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {column === "estado" ? (
            <Select onValueChange={setFilterValue}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          ) : column === "fecha" ? (
            <div className="flex gap-2">
              <Label htmlFor="year"></Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Año"
                />
              <Label htmlFor="month"></Label>
              <Input
                id="month"
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Mes"
              />
              <Label htmlFor="day"></Label>
              <Input
                id="day"
                type="number"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="Día"
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="filterValue">Valor de filtro</Label>
              <Input
                id="filterValue"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder={`Buscar por ${column}`}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label>Ordenar</Label>
            <div className="flex space-x-2">
              <Button
                variant={sortDirection === "asc" ? "default" : "outline"}
                onClick={() => setSortDirection("asc")}
                className="flex-1"
              >
                Ascendente
              </Button>
              <Button
                variant={sortDirection === "desc" ? "default" : "outline"}
                onClick={() => setSortDirection("desc")}
                className="flex-1"
              >
                Descendente
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleFilter}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

