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
import { Star, Heart, ThumbsUp, SquareCheck, CircleChevronDown, Mail, Calendar, Clock, CircleCheck, Type, Hash, Grid, Star as StarIcon, Book, User, Plus } from "lucide-react"
import { configQualification, configQualificationIcons } from "@/config/Forms"
import { Checkbox } from "@/components/ui/Checkbox"

interface Props{
    currentForm: Form | null
    setCurrentForm: (currentForm: Form) => void
    dialogAddField: boolean 
    setDialogAddField: (dialogAddField: boolean) => void
    editingField?: FormField
    setEditingField: (editingField: FormField | undefined) => void
}

export type ItemList = {id: string, value: string}
export type ItemListGrid = {id: string, value: string, data: string[]}

const DialogDefault: FormField = {
    id: "",
    name: "",
    type: "text",
    required: false,
    section: "personal"
}

const TypeOptionField = ({keyIcon}: {keyIcon: string}) => {
    const classIcon = "size-5"
    
    switch (keyIcon) {
        case "text":
            return <Type className={classIcon} />
        case "number":
            return <Hash className={classIcon} />
        case "email":
            return <Mail className={classIcon} />
        case "date":
            return <Calendar className={classIcon} />
        case "time":
            return <Clock className={classIcon} />
        case "checklist_single":
            return <CircleCheck className={classIcon} />
        case "checklist_multiple":
            return <SquareCheck className={classIcon} />
        case "checklist_single_grid":
            return <Grid className={classIcon} />
        case "checklist_multiple_grid":
            return <Grid className={classIcon} />
        case "checkbox":
            return <SquareCheck className={classIcon} />
        case "qualification":
            return <StarIcon className={classIcon} />
        case "select":
            return <CircleChevronDown className={classIcon} />
        default:
            return null
    }
}

const SectionOptionField = ({keyIcon}: {keyIcon: string}) => {
    const classIcon = "size-5"

    switch (keyIcon) {
        case "personal":
            return <User className={classIcon} />
        case "academy":
            return <Book className={classIcon} />
        case "additional":
            return <Plus className={classIcon} />
        default:
            return null
    }
}

const CreateDialog = ({currentForm, setCurrentForm, dialogAddField, setDialogAddField, editingField, setEditingField}: Props) => {
    const [itemsList, setItemsList] = useState<ItemList[]>([])
    const [newField, setNewField] = useState<FormField>(editingField || DialogDefault)
    const [showOptionsField, setShowOptionsField] = useState<boolean>(false)
    const [isQualification, setIsQualification] = useState<boolean>(false)
    const [isGrid, setIsGrid] = useState<boolean>(false)
    const [gridRows, setGridRows] = useState<ItemList[]>([])
    const [gridCols, setGridCols] = useState<ItemList[]>([])
    const [maxQualification, setMaxQualification] = useState<number>(editingField?.maxQualification || configQualification.default)
    const [qualificationIcon, setQualificationIcon] = useState<typeof configQualificationIcons[number]["id"]>(editingField?.qualificationIcon || "star")
    const [error, setError] = useState<string>("")

    const normalizeString = (str: string) => {
        return str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9]/g, "")
    }

    useEffect(() => {
        if (editingField) {
            setNewField(editingField)
            setShowOptionsField(editingField.type === "select" || editingField.type === "checklist_single" || editingField.type === "checklist_multiple")
            setIsQualification(editingField.type === "qualification")
            setIsGrid(editingField.type === "checklist_single_grid" || editingField.type === "checklist_multiple_grid")

            if (editingField.options) {
                if (typeof editingField.options[0] === 'string') {
                    setItemsList(editingField.options.map((option, index) => ({ id: index.toString(), value: option as string })))
                } else {
                    const gridOptions = editingField.options as unknown as { row: string; data: string[] }[]
                    const uniqueRows = [...new Set(gridOptions.map(opt => opt.row))]
                    const uniqueCols = gridOptions[0]?.data || []
                    setGridRows(uniqueRows.map((row, index) => ({ id: index.toString(), value: row })))
                    setGridCols(uniqueCols.map((col, index) => ({ id: index.toString(), value: col })))
                }
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
        setError("")
    }, [editingField])

    const addField = () => {
        if (!currentForm) return

        if (!newField.name.trim()) {
            setError("El nombre del campo no puede estar vacío")
            return
        }

        const fieldExists = currentForm.fields.some(
            field => field.id !== editingField?.id && 
            normalizeString(field.name) === normalizeString(newField.name)
        )

        if (fieldExists) {
            setError("Ya existe un campo con este nombre")
            return
        }

        const fieldId = editingField?.id || newField.name.toLowerCase() + "_" + Date.now()

        const field: FormField = {
            ...newField,
            id: fieldId,
        }

        if (field.type === "select") {
            field.options = itemsList.map((item) => item.value)
        }

        if (field.type === "checklist_single" || field.type === "checklist_multiple") {
            field.options = itemsList.map((item) => item.value)
        }

        if (field.type === "checklist_single_grid" || field.type === "checklist_multiple_grid") {
            const rows = gridRows.map((item) => item.value)
            const options = gridCols.map((item) => item.value)
            field.options = rows.map(row => ({
                row,
                data: options
            }))
        }

        if (field.type === "qualification") {
            field.maxQualification = maxQualification
            field.qualificationIcon = qualificationIcon
        }

        if (editingField) {
            setCurrentForm({
                ...currentForm,
                fields: currentForm.fields.map((c) => c.id === editingField.id ? field : c),
            })
        } else {
            setCurrentForm({
                ...currentForm,
                fields: [...currentForm.fields, field],
            })
        }

        setNewField(DialogDefault)
        setShowOptionsField(false)
        setDialogAddField(false)
        setItemsList([])
        setError("")
        setEditingField(undefined)
    }

    const handleChangeSelect = (value: typeFieldForm) => {
        setNewField({ ...newField, type: value })
        setShowOptionsField(value === "select" || value === "checklist_single" || value === "checklist_multiple")
        setIsQualification(value === "qualification")
        setIsGrid(value === "checklist_single_grid" || value === "checklist_multiple_grid")
    }
    
    return(
        <Dialog open={dialogAddField} onOpenChange={setDialogAddField}>
            <DialogContent className="grid grid-rows-[auto_1fr] max-h-[90vh] overflow-y-hidden">
                <DialogHeader>
                    <DialogTitle>{editingField ? "Editar Campo" : "Agregar Nuevo Campo"}</DialogTitle>
                    <DialogDescription>{editingField ? "Modifique las propiedades del campo" : "Defina las propiedades del nuevo campo para el formulario"}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 px-2 max-h-[100vh] overflow-y-auto">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre-campo">Nombre del Campo</Label>
                        <Input
                            id="nombre-campo"
                            value={newField.name}
                            onChange={(e) => {
                                setNewField({ ...newField, name: e.target.value })
                                setError("")
                            }}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tipo-campo">Tipo de Campo</Label>
                        <Select
                            value={newField.type}
                            onValueChange={handleChangeSelect}
                        >
                            <SelectTrigger id="tipo-campo">
                            <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[40vh] overflow-y-auto">
                                {configField.map((tipo) => (
                                    <SelectItem key={tipo.id} value={tipo.id}>
                                        <div className="flex items-center gap-2">
                                            <TypeOptionField keyIcon={tipo.key} />

                                            <span className="text-md">
                                                {tipo.name}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tipo-campo">Seccion del campo</Label>
                        <Select
                            value={newField.section}
                            onValueChange={(value: sectionFieldForm) => {
                                setNewField({ ...newField, section: value })
                            }}
                        >
                            <SelectTrigger id="seccion-campo">
                                <SelectValue placeholder="Seleccione una seccion" />
                            </SelectTrigger>
                            <SelectContent>
                            {configFieldSection.map((tipo) => (
                                <SelectItem key={tipo.id} value={tipo.id}>
                                    <div className="flex items-center gap-2">
                                        <SectionOptionField keyIcon={tipo.key} />

                                        <span className="text-md">
                                            {tipo.name}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {showOptionsField && (
                        <div className="grid gap-2">
                            <Label htmlFor="opciones-campo">Opciones</Label>
                            <CheckList itemsList={itemsList} setItemsList={setItemsList} normalizeString={normalizeString}/>
                        </div>
                    )}

                    {isGrid && (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="opciones-campo">Filas</Label>
                                <CheckList itemsList={gridRows} setItemsList={setGridRows} normalizeString={normalizeString}/>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="opciones-campo">Columnas</Label>
                                <CheckList itemsList={gridCols} setItemsList={setGridCols} normalizeString={normalizeString}/>
                            </div>
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
                        <Checkbox
                            id="campo-requerido"
                            variant="square"
                            checked={newField.required}
                            onCheckedChange={(checked: boolean) => setNewField({ ...newField, required: checked })}
                        />
                        
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="campo-requerido" className="font-medium cursor-pointer">
                                Campo requerido
                            </Label>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setNewField(DialogDefault)
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