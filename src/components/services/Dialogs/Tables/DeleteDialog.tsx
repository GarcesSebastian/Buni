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
import { GeneralStructureForm } from "@/types/Table"
import { User, useUserData } from "@/hooks/useUserData"
import { useWebSocket } from "@/hooks/server/useWebSocket"

interface Props {
  data: {
    table: {
      name: string,
      key: string,
      isQR?: boolean
    }
    structureForm: GeneralStructureForm;
  }
  open: boolean
  onOpenChange: (value: boolean) => void
  initialData: Record<string, string>
}

export function DeleteDialog({ open, onOpenChange, data, initialData }: Props) {
  const { user, setUser } = useUserData()
  const { sendMessage } = useWebSocket()

  const handleDelete = () => {
    const key = data.table.key as keyof User;
    if (Array.isArray(user[key])) {
      const updatedData = (user[key] as Array<{ id: number }>).filter((item) => item.id !== Number(initialData.id))

      const newData = {
        ...user,
        [data.table.key]: updatedData,
      }

      setUser(newData)
      onOpenChange(false)
      sendMessage("UPDATE_DATA", {users: newData})
    } 

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
          <Button className="bg-primary hover:bg-primary/90" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}