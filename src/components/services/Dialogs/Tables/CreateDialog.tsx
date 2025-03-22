"use client"

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
import { InputPassword } from "@/components/ui/InputPassword"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Form } from "@/types/Forms"
import { type User, useUserData } from "@/hooks/useUserData"
import { useWebSocket } from "@/hooks/server/useWebSocket";
import { GeneralStructureForm } from "@/types/Table"

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

interface PropsInputBasic {
  data: {
    form: {
      name: string;
      options: { value: string; label: string; id?: number }[];
      type: "text" | "number" | "date" | "time" | "selection" | "password";
    };
    key: string;
    index: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  };
  formData: Record<string, string>;
}

interface UpdatedFormData {
  [key: string]: string | number | { value: string; data: Form | { id: number; nombre: string } };
}

const InputBasic = ({ formData, data }: PropsInputBasic) => {
  if (["text", "number", "date", "time"].includes(data.form.type)) {
    return (
      <>
        <Label>{data.form.name}</Label>
        <Input
          key={data.index}
          type={data.form.type}
          value={formData[data.key.toLowerCase()] || ""}
          onChange={data.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          required
        />
      </>
    );
  } else if (data.form.type === "password") {
    return (
      <InputPassword
        data={{
          key: data.key,
          value: formData[data.key.toLowerCase()] || "",
          label: data.form.name,
          onChange: data.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
        }}
      />
    )
  } else if (data.form.type === "selection") {
    return (
      <>
        <Label>{data.form.name}</Label>
        <Select
          key={data.index}
          value={formData[data.key.toLowerCase()] || ""}
          onValueChange={data.onChange}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder={`Seleccionar ${data.form.name.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {data.form.options.length > 0 ? (
              data.form.options.map((option, index) => (
                <SelectItem key={index} value={`${option.value}${option.id ? "_" + option.id : ""}`}>
                  {option.label}
                </SelectItem>
              ))
            ) : (
              <p className="text-gray-500 text-sm p-2">No se encontraron opciones</p>
            )}
          </SelectContent>
        </Select>
      </>
    );
  }
  return null;
};

export function CreateEventDialog({ data, open, onOpenChange }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { user, setUser }: { user: User; setUser: (user: User) => void } = useUserData();
  const { sendMessage } = useWebSocket()

  const RestartFormData = () => {
    const rest: Record<string, string> = {};
    Object.keys(data.structureForm).forEach((key) => {
      rest[key.toLowerCase()] = "";
    });
    setFormData(rest);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyData = user[data.table.key as keyof typeof user];
    const id = (Array.isArray(keyData) ? keyData.length : 0) + 1;
    const updatedFormData: UpdatedFormData = { ...formData, id };
    
    Object.keys(updatedFormData).forEach((key: string) => {
      if (typeof updatedFormData[key] == "string"){
        const dataSplit = updatedFormData[key].split("_")
        if (dataSplit.length <= 1) return;

        const dataId = dataSplit[dataSplit.length - 1]
        const findDataUser = (user[key as keyof User] as (Form | { id: number; nombre: string })[]).find(d => d.id == Number(dataId))
        if(findDataUser){
          updatedFormData[key] = {
            value: updatedFormData[key],
            data: findDataUser
          }
        }
      }
    })

    const key = data.table.key as keyof User;
    const newData = {
      ...user,
      [key]: [...user[key], updatedFormData],
    }

    if (Array.isArray(user[key])) {
      setUser(newData);
    }      

    RestartFormData();
    onOpenChange(false);
    sendMessage("UPDATE_DATA", {users: newData})
  };

  useEffect(RestartFormData, [data.structureForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear dato para {data.table.name}</DialogTitle>
            <DialogDescription>Complete los datos para {data.table.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.keys(data.structureForm).map((value, index) => (
              <div key={index} className="grid gap-2">
                <InputBasic
                  formData={formData}
                  data={{
                    form: data.structureForm[value],
                    onChange: (e: React.ChangeEvent<HTMLInputElement> | string) =>
                      setFormData({
                        ...formData,
                        [value.toLowerCase()]: typeof e === "string" ? e : e.target.value,
                      }),
                    key: value,
                    index,
                  }}
                />
              </div>
            ))}
          </div>
          <DialogFooter className="flex flex-row">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
