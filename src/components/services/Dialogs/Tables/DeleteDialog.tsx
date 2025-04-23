"use client"

import Cookies from "js-cookie"
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
import { User, useUserData } from "@/hooks/auth/useUserData"
import { useNotification } from "@/hooks/client/useNotification"
import { useState } from "react"
import { useSocket } from "@/hooks/server/useSocket"

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
  const { showNotification } = useNotification()
  const [isDeleting, setIsDeleting] = useState(false)
  const { socket } = useSocket()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const key = data.table.key as keyof User;
      if (!Array.isArray(user[key])) {
        throw new Error("Error al eliminar el registro: estructura de datos inválida")
      }

      const updatedData = (user[key] as Array<{ id: number }>).filter((item) => item.id !== Number(initialData.id))

      const newData = {
        ...user,
        [data.table.key]: updatedData,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${data.table.key}/${initialData.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        }
      })

      const data_response = await response.json()

      if (!response.ok) {
        throw new Error(data_response.error || "Error al eliminar el registro")
      }

      setUser(newData)
      onOpenChange(false)
      socket?.emit("UPDATE_DATA", newData)

      showNotification({
        title: "Registro eliminado",
        message: "El registro ha sido eliminado correctamente",
        type: "success"
      })
    } catch (error) {
      showNotification({
        title: "Error",
        message: error instanceof Error ? error.message : "Error inesperado al eliminar el registro",
        type: "error"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar {data.table.name}</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar este {data.table.name}? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
            onClick={handleDelete}
            loading={isDeleting}
            loadingText="Eliminando..."
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}