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
import { useState, useEffect } from "react"
import { Form, FormField, sectionFieldForm, typeFieldForm } from "@/types/Forms"
import { configField, configFieldSection } from "@/config/Forms"
import CheckList from "@/components/ui/CheckList"
import { Star, Heart, ThumbsUp } from "lucide-react"
import { configQualification, configQualificationIcons } from "@/config/Forms"

interface Props{
    currentForm: Form | null
    setCurrentForm: (currentForm: Form) => void
    dialogAddField: boolean 
    setDialogAddField: (dialogAddField: boolean) => void
    editingField?: FormField
}

export type ItemList = {id: number, value: string}

const DialogDefault: FormField = {
    id: "",
    nombre: "",
    tipo: "texto",
    requerido: false,
    seccion: "personal"
}

const CreateDialog = ({currentForm, setCurrentForm, dialogAddField, setDialogAddField, editingField}: Props) => {
    const [itemsList, setItemsList] = useState<ItemList[]>([])
    const [newField, setNewField] = useState<FormField>(editingField || DialogDefault)
    const [optionsField, setOptionsField] = useState<string>("")
    const [showOptionsField, setShowOptionsField] = useState<boolean>(false)
    const [isQualification, setIsQualification] = useState<boolean>(false)
    const [maxQualification, setMaxQualification] = useState<number>(editingField?.maxQualification || configQualification.default)
    const [qualificationIcon, setQualificationIcon] = useState<typeof configQualificationIcons[number]["id"]>(editingField?.qualificationIcon || "star")

    useEffect(() => {
        if (editingField) {
            setNewField(editingField)
            setShowOptionsField(editingField.tipo === "seleccion" || editingField.tipo === "checklist_unico" || editingField.tipo === "checklist_multiple")
            setIsQualification(editingField.tipo === "qualification")
            if (editingField.opciones) {
                setItemsList(editingField.opciones.map((opcion, index) => ({ id: index, value: opcion })))
            }
            if (editingField.maxQualification) {
                setMaxQualification(editingField.maxQualification)
            }
            if (editingField.qualificationIcon) {
                setQualificationIcon(editingField.qualificationIcon)
            }
        } else {
            setNewField(DialogDefault)
            setShowOptionsField(false)
            setIsQualification(false)
            setItemsList([])
            setMaxQualification(configQualification.default)
            setQualificationIcon("star")
        }
    }, [editingField])

    const addField = () => {
        if (!currentForm || !newField.nombre) return

        const campoId = editingField?.id || newField.nombre.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now()

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

        if (campo.tipo === "qualification") {
            campo.maxQualification = maxQualification
            campo.qualificationIcon = qualificationIcon
        }

        if (editingField) {
            setCurrentForm({
                ...currentForm,
                campos: currentForm.campos.map((c) => c.id === editingField.id ? campo : c),
            })
        } else {
            setCurrentForm({
                ...currentForm,
                campos: [...currentForm.campos, campo],
            })
        }

        setNewField(DialogDefault)
        setOptionsField("")
        setShowOptionsField(false)
        setDialogAddField(false)
    }

    const handleChangeSelect = (value: typeFieldForm) => {
        setNewField({ ...newField, tipo: value })
        setShowOptionsField(value === "seleccion" || value === "checklist_unico" || value === "checklist_multiple")
        setIsQualification(value === "qualification")
    }

    return(
        <Dialog open={dialogAddField} onOpenChange={setDialogAddField}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingField ? "Editar Campo" : "Agregar Nuevo Campo"}</DialogTitle>
                <DialogDescription>{editingField ? "Modifique las propiedades del campo" : "Defina las propiedades del nuevo campo para el formulario"}</DialogDescription>
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
                        onValueChange={handleChangeSelect}
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

                {isQualification && (
                    <div className="grid grid-cols-4 gap-2">
                        <div className="w-full col-span-2 grid gap-2">
                            <Label htmlFor="max-qualification">Calificación Máxima</Label>
                            <Select
                                value={maxQualification.toString()}
                                onValueChange={(value) => setMaxQualification(Number(value))}
                            >
                                <SelectTrigger id="max-qualification" className="w-full">
                                    <SelectValue placeholder="Seleccione la calificación máxima" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from(
                                        { length: (configQualification.max - configQualification.min) / configQualification.step + 1 },
                                        (_, i) => configQualification.min + i * configQualification.step
                                    ).map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full col-span-2 grid gap-2">
                            <Label htmlFor="qualification-icon">Icono de Calificación</Label>
                            <Select
                                value={qualificationIcon}
                                onValueChange={(value: typeof configQualificationIcons[number]["id"]) => setQualificationIcon(value)}
                            >
                                <SelectTrigger id="qualification-icon" className="w-full">
                                    <SelectValue>
                                        {qualificationIcon === "star" && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
                                        {qualificationIcon === "heart" && <Heart className="w-5 h-5 fill-red-500 text-red-500" />}
                                        {qualificationIcon === "thumbs-up" && <ThumbsUp className="w-5 h-5 fill-blue-500 text-blue-500" />}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {configQualificationIcons.map((icon) => (
                                        <SelectItem key={icon.id} value={icon.id} spellCheck="false">
                                            <div className="flex items-center gap-2">
                                                {icon.id === "star" && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                                                {icon.id === "heart" && <Heart className="w-4 h-4 fill-red-500 text-red-500" />}
                                                {icon.id === "thumbs-up" && <ThumbsUp className="w-4 h-4 fill-blue-500 text-blue-500" />}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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