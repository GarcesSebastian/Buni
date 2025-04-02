"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useState } from "react"
import { Form, FormField, sectionFieldForm, typeFieldForm } from "@/types/Forms"
import { configField, configFieldSection } from "@/config/Forms"
import CheckList from "@/components/ui/CheckList"

interface Props{
    currentForm: Form | null
    setCurrentForm: (currentForm: Form) => void
    dialogAddField: boolean 
    setDialogAddField: (dialogAddField: boolean) => void
}

export type ItemList = {id: number, value: string}

const DialogDefault: FormField = {
    id: "",
    nombre: "",
    tipo: "texto",
    requerido: false,
    seccion: "personal"
}

const CreateDialog = ({currentForm, setCurrentForm, dialogAddField, setDialogAddField}: Props) => {
    const [itemsList, setItemsList] = useState<ItemList[]>([])
    const [newField, setNewField] = useState<FormField>(DialogDefault)
    const [optionsField, setOptionsField] = useState<string>("")
    const [showOptionsField, setShowOptionsField] = useState<boolean>(false)

    const addField = () => {
        if (!currentForm || !newField.nombre) return

        const campoId = newField.nombre.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now()

        const campo: FormField = {
            ...newField,
            id: campoId,
        }

        if (campo.tipo === "seleccion" && optionsField) {
            campo.opciones = optionsField.split(",")
        }

        if (campo.tipo === "checklist_unico" || campo.tipo === "checklist_multiple") {
            campo.opciones = itemsList.map((item) => item.value)
        }

        setCurrentForm({
            ...currentForm,
            campos: [...currentForm.campos, campo],
        })

        setNewField(DialogDefault)
        setOptionsField("")
        setShowOptionsField(false)
        setDialogAddField(false)
    }

    return(
        <Dialog open={dialogAddField} onOpenChange={setDialogAddField}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Agregar Nuevo Campo</DialogTitle>
                <DialogDescription>Defina las propiedades del nuevo campo para el formulario</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 max-h-full">
                <div className="grid gap-2">
                    <Label htmlFor="nombre-campo">Nombre del Campo</Label>
                    <Input
                        id="nombre-campo"
                        value={newField.nombre}
                        onChange={(e) => setNewField({ ...newField, nombre: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="tipo-campo">Tipo de Campo</Label>
                    <Select
                        value={newField.tipo}
                        onValueChange={(valor: typeFieldForm) => {
                            setNewField({ ...newField, tipo: valor })
                            setShowOptionsField(valor === "seleccion" || valor === "checklist_unico" || valor === "checklist_multiple")
                        }}
                    >
                        <SelectTrigger id="tipo-campo">
                        <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                        {configField.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="tipo-campo">Seccion del campo</Label>
                    <Select
                        value={newField.seccion}
                        onValueChange={(valor: sectionFieldForm) => {
                            setNewField({ ...newField, seccion: valor })
                        }}
                    >
                        <SelectTrigger id="seccion-campo">
                        <SelectValue placeholder="Seleccione una seccion" />
                        </SelectTrigger>
                        <SelectContent>
                        {configFieldSection.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                {showOptionsField && (
                    <div className="grid gap-2">
                        <Label htmlFor="opciones-campo">Opciones</Label>
                        <CheckList itemsList={itemsList} setItemsList={setItemsList}/>
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="campo-requerido"
                        checked={newField.requerido}
                        onChange={(e) => setNewField({ ...newField, requerido: e.target.checked })}
                        className="rounded border-gray-300"
                    />
                    <Label htmlFor="campo-requerido">Campo requerido</Label>
                </div>
            </div>

            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => {
                        setNewField(DialogDefault)
                        setOptionsField("")
                        setShowOptionsField(false)
                        setDialogAddField(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button onClick={addField} className="bg-primary hover:bg-primary/90">
                    Agregar
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDialog;