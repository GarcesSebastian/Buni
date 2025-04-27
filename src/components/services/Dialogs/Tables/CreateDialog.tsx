"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Form } from "@/types/Forms"
import { GeneralStructureForm } from "@/types/Table"
import { InputBasic } from "../../InputGeneric"
import { type User, useUserData } from "@/hooks/auth/useUserData"
import { useNotification } from "@/hooks/client/useNotification"
import { dataExtra } from "@/config/Data"
import { useSocket } from "@/hooks/server/useSocket"

type DataExtraValue = string | number | boolean | null | DataExtraValue[] | { [key: string]: DataExtraValue }

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
}

interface UpdatedFormData {
  [key: string]: string | number | { value: string; data: Form | { id: number; nombre: string } } | DataExtraValue;
}

export function CreateEventDialog({ data, open, onOpenChange }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser }: { user: User; setUser: (user: User) => void } = useUserData();
  const { showNotification } = useNotification();
  const { socket } = useSocket();

  const RestartFormData = () => {
    const rest: Record<string, string> = {};
    Object.keys(data.structureForm).forEach((key) => {
      rest[key] = "";
    });
    setFormData(rest);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const keyData = user[data.table.key as keyof typeof user];
      const id = (Array.isArray(keyData) ? keyData.length : 0) + 1;
      const updatedFormData: UpdatedFormData = { ...formData, id };
      
      Object.keys(updatedFormData).forEach((key: string) => {
        if (typeof updatedFormData[key] == "string"){
          const dataSplit = updatedFormData[key].split("_")
          if (dataSplit.length <= 1) return;

          const keyFormatted = key == "formAssists" || key == "formInscriptions" ? "forms" : key
          const dataId = dataSplit[dataSplit.length - 1]
          const findDataUser = (user[keyFormatted as keyof User] as (Form | { id: number; nombre: string })[]).find(d => d.id == Number(dataId))
          if(findDataUser){
            updatedFormData[key] = {
              id: findDataUser.id,
              key: keyFormatted,
            }
          }
        }
      })
      
      const tableKey = data.table.key as keyof typeof dataExtra;
      const extraData = dataExtra[tableKey];
      if (extraData) {
        Object.entries(extraData).forEach(([key, value]) => {
          updatedFormData[key] = value as DataExtraValue;
        });
      }

      const key = data.table.key as keyof User;
      const newData = {
        ...user,
        [key]: [...user[key], updatedFormData],
      }

      const body_response = JSON.parse(JSON.stringify(updatedFormData))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${data.table.key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body_response)
      })

      const data_response = await response.json();

      if (!response.ok) {
        throw new Error(data_response.error || 'Error al crear el registro'); 
      }

      setUser(newData);
      RestartFormData();
      onOpenChange(false);
      socket?.emit("UPDATE_DATA", newData);

      showNotification({
        title: "Registro creado",
        message: "El registro ha sido creado correctamente",
        type: "success"
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: error instanceof Error ? error.message : 'Error inesperado',
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(RestartFormData, [data.structureForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] overflow-hidden">
        <form className="grid grid-rows-[auto_1fr] max-h-[90vh] overflow-hidden" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear {data.table.name}</DialogTitle>
            <DialogDescription>Complete los datos para crear un nuevo {data.table.name}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 py-4 px-2 max-h-[100vh] overflow-y-auto">
            {Object.keys(data.structureForm).map((value, index) => (
              <div key={index}>
                <InputBasic
                  formData={formData}
                  data={{
                    form: data.structureForm[value],
                    onChange: (e: React.ChangeEvent<HTMLInputElement> | string) =>
                      setFormData({
                        ...formData,
                        [value]: typeof e === "string" ? e : e.target.value,
                      }),
                    key: value,
                    index,
                  }}
                  user={user}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="flex flex-row mt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              loading={isSubmitting}
              loadingText="Creando..."
            >
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}