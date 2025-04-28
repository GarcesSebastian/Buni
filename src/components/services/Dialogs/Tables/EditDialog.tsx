"use client"

import { useState, useEffect } from "react"
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
import { User, useUserData } from "@/hooks/auth/useUserData"
import { GeneralStructureForm } from "@/types/Table"
import { Form } from "@/types/Forms"
import { InputBasic } from "../../InputGeneric"
import { useNotification } from "@/hooks/client/useNotification"
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

interface HandleSubmitProps {
  preventDefault: () => void;
}

interface FormattedData {
  id: string;
  key: string;
}

type UpdatedFormData = Record<string, string | number | FormattedData>;

export function EditDialog({ data, open, onOpenChange, initialData }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser }: { user: User; setUser: (user: User) => void } = useUserData();
  const { showNotification } = useNotification()
  const { socket } = useSocket()

  const RestartFormData = () => {
    const rest: Record<string, string> = {};
    Object.keys(data.structureForm).forEach((key) => {
      rest[key] = "";
    });
    setFormData(rest);
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSubmit = async (e: HandleSubmitProps) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      formData.id = initialData.id;
      const updatedFormData: UpdatedFormData = { ...formData } as UpdatedFormData;
      
      Object.keys(updatedFormData).forEach((key: string) => {
        if (typeof updatedFormData[key] == "string"){
          const dataSplit = updatedFormData[key].split("_")
          if (dataSplit.length <= 1) return;

          const keyFormatted = key == "formAssists" || key == "formInscriptions" ? "forms" : key
          const dataId = dataSplit[dataSplit.length - 1]
          const findDataUser = (user[keyFormatted as keyof User] as (Form | { id: string; nombre: string })[]).find(d => d.id == dataId)
          if(findDataUser){
            updatedFormData[key] = {
              id: findDataUser.id,
              key: keyFormatted,
            }
          }
        }
      })

      const key = data.table.key as keyof User;
      const newData = {
        ...user,
        [data.table.key]: (user[key] as (Form | { id: string; nombre: string })[]).map((item: Form | { id: string; nombre: string }) =>
          item.id === initialData.id ? updatedFormData : item
        ),
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${data.table.key}/${initialData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedFormData)
      });

      const data_response = await response.json();

      if (!response.ok) {
        throw new Error(data_response.error || 'Error al editar el registro');
      }

      if (Array.isArray(user[key])) {  
        setUser(newData);
      }

      RestartFormData();
      onOpenChange(false);
      socket?.emit("UPDATE_DATA", newData);

      showNotification({
        title: "Registro editado",
        message: "El registro ha sido editado correctamente",
        type: "success"
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: error instanceof Error ? error.message : 'Error inesperado al editar el registro',
        type: "error"
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleChange = (value: string) => (e: string | React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [value]: typeof e === 'string' ? e : e.target.value })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar {data.table.name}</DialogTitle>
            <DialogDescription>Complete los datos para editar el {data.table.name}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 py-4">
            {Object.keys(data.structureForm).map((value, index) => (
              <div key={index} className="grid gap-2">
                <InputBasic
                  formData={formData}
                  data={{
                    form: data.structureForm[value],
                    onChange: handleChange(value),
                    key: value,
                    index: index
                  }}
                  user={user}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              loading={isEditing}
              loadingText="Editando..."
            >
              Editar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

