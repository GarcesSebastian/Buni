"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"

interface FilterDialogProps {
  column: string | null
  onFilter: (value: string) => void
  onClose: () => void
  open: boolean
}

export function FilterDialog({ column, onFilter, onClose, open }: FilterDialogProps) {
  const [filterValue, setFilterValue] = useState("")

  const handleApplyFilter = () => {
    if (column) {
      onFilter(filterValue)
    }
    setFilterValue("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrar por {column}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filterValue">Valor</Label>
            <Input
              id="filterValue"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder={`Buscar por ${column}`}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleApplyFilter}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

