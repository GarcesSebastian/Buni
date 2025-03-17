"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { User, useUserData } from "@/hooks/useUserData"
import { GeneralStructureForm, GeneralTable } from "@/config/Table"
import { Form } from "@/types/Forms"

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

interface PropsInputBasic {
  data: {
    form: {
      name: string;
      options: { value: string; label: string; id?: number }[];
      type: "text" | "number" | "date" | "time" | "selection";
    };
    key: string;
    index: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  };
  formData: Record<string, string>;
}

interface HandleSubmitProps {
  preventDefault: () => void;
}

const InputBasic = ({formData, data}: PropsInputBasic) => {
  if(data.form.type == "text" || data.form.type == "number" || data.form.type == "date"){
    return(
      <>
        <Label>{data.form.name}</Label>
        <Input
          key={data.index}
          type={data.form.type}
          value={formData[data.key.toLowerCase()]}
          onChange={data.onChange}
          required
        />
      </>
    )
  }else if(data.form.type == "selection"){
    return(
      <>
      <Label htmlFor="faculty">{data.form.name}</Label>
      <Select
        key={data.index}
        value={formData[data.key.toLowerCase()]}
        onValueChange={data.onChange}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder={`Seleccione una ${data.form.name.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {data.form.options.length > 0 ? (
            data.form.options.map((option, index) => (
              <SelectItem key={index} value={`${option.value}${option.id ? '_' + option.id : ''}`}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <p className="text-gray-500 text-sm p-2">No se encontraron opciones</p>
          )}
        </SelectContent>
      </Select>
      </>
    )
  }
}

export function EditDialog({ data, open, onOpenChange, initialData }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { user, setUser }: { user: User; setUser: (user: User) => void } = useUserData();
  
  const RestartFormData = () => {
    const rest: Record<string, string> = {};
    Object.keys(data.structureForm).forEach((key) => {
      rest[key.toLowerCase()] = "";
    });
    setFormData(rest);
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSubmit = (e: HandleSubmitProps) => {
    e.preventDefault();
    const keyData = user[data.table.key as keyof typeof user];
    const id = (Array.isArray(keyData) ? keyData.length : 0) + 1;
    const updatedFormData: { id: number; form?: string | { value: string; data: Form } } = { ...formData, id };

    if (typeof updatedFormData.form === 'string') {
      const formSplit = updatedFormData.form.split("_");
      const formId = formSplit[formSplit.length - 1];
      const findFormUser = user.form.find((f: Form) => f.id === Number(formId));
      if (findFormUser) {
        updatedFormData.form = {
          value: updatedFormData.form,
          data: findFormUser,
        };
      }
    }
    
    const key = data.table.key as keyof User;
    if (Array.isArray(user[key])) {  
      setUser({
        ...user,
        [data.table.key]: user[key].map((item) =>
          item.id === Number(initialData.id) ? { ...item, ...{
            ...updatedFormData,
            active: true,
          } } : item
        ),
      });
    }

    RestartFormData();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar dato para {data.table.name}</DialogTitle>
            <DialogDescription>Complete los datos para {data.table.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.keys(data.structureForm).map((value, index) => (
              <div key={index} className="grid gap-2">
                <InputBasic
                  formData={formData}
                  data={{
                    form: data.structureForm[value],
                    onChange: (e) => setFormData({ ...formData, [value.toLowerCase()]: typeof e === 'string' ? e : e.target.value }),
                    key: value,
                    index: index
                  }}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#DC2626] hover:bg-[#DC2626]/90">
              Editar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

