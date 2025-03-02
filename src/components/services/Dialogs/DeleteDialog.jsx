"use client"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { useUserData } from "@/hooks/useUserData"

export function DeleteDialog({ open, onOpenChange, data, initialData }) {
  const { user, setUser } = useUserData()

  const handleDelete = () => {
    const updatedData = user[data.table.key].filter((item) => item.id !== initialData.id)

    setUser({
      ...user,
      [data.table.key]: updatedData,
    })

    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Evento</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-[#DC2626] hover:bg-[#DC2626]/90" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}