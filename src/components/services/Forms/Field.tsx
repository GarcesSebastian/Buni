import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Checkbox } from "@/components/ui/Checkbox"
import { FormField } from "@/types/Forms"
import { formOptionsType } from "@/app/forms/[[...params]]/page"
import { Star, Heart, ThumbsUp } from "lucide-react"
import { configQualificationIcons } from "@/config/Forms"
import { useEffect, useState } from "react"

type formValuesType = Record<string, formOptionsType | Record<string, formOptionsType>>

interface Props{
    field: FormField,
    formValues: formValuesType
    errors: Record<string, string>
    setFormValues: (value: formValuesType | ((prev: formValuesType) => formValuesType)) => void,
    setErrors: (value: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void,
}

const Field = ({field, formValues, setFormValues, errors, setErrors}: Props) => {
    const handleChange = (id: string, value: formOptionsType, superId?: string) => {
        if (superId) {
            setFormValues((prev) => {
                const currentSuperValue = (prev[superId] as Record<string, formOptionsType>) || {}
                return {
                    ...prev,
                    [superId]: {
                        ...currentSuperValue,
                        [id]: value
                    }
                }
            })
        } else {
            setFormValues((prev) => ({
                ...prev,
                [id]: value,
            }))
        }
        
        if (formValues[id]) {
            setErrors((prev: Record<string, string>) => {
                const newErrors: Record<string, string> = { ...prev }
                delete newErrors[id]
                return newErrors
            })
        }
    }
    
    const [columnsGrid, setColumnsGrid] = useState<string[]>([])

    useEffect(() => {
        if (field.tipo === "checklist_unico_grid" || field.tipo === "checklist_multiple_grid") {
            const firstOption = field.opciones?.[0]
            setColumnsGrid(typeof firstOption === 'string' ? [] : firstOption?.data || [])
        }
    }, [field])

    switch (field.tipo) {
        case "texto":
        case "email":
        return (
            <div className="grid gap-2" key={field.id}>
            <Label htmlFor={field.id} className="font-medium">
                {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
            </Label>
            <Input
                id={field.id}
                type={field.tipo === "email" ? "email" : "text"}
                value={formValues[field.id] as string || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={errors[field.id] ? "border-red-500" : ""}
            />
            {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
            </div>
        )

        case "numero":
        return (
            <div className="grid gap-2" key={field.id}>
            <Label htmlFor={field.id} className="font-medium">
                {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
            </Label>
            <Input
                id={field.id}
                type="number"
                value={formValues[field.id] as string || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={errors[field.id] ? "border-red-500" : ""}
            />
            {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
            </div>
        )

        case "fecha":
        return (
            <div className="grid gap-2" key={field.id}>
            <Label htmlFor={field.id} className="font-medium">
                {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
            </Label>
            <Input
                id={field.id}
                type="date"
                value={formValues[field.id] as string || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={errors[field.id] ? "border-red-500" : ""}
            />
            {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
            </div>
        )

        case "hora":
        return (
            <div className="grid gap-2" key={field.id}>
                <Label htmlFor={field.id} className="font-medium">
                    {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
                </Label>
                <Input
                    id={field.id}
                    type="time"
                    value={formValues[field.id] as string || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className={errors[field.id] ? "border-red-500" : ""}
                />  
                {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
            </div>
        )

        case "seleccion":
        return (
            <div className="grid gap-2" key={field.id}>
            <Label htmlFor={field.id} className="font-medium">
                {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
            </Label>
            <Select value={formValues[field.id] as string || ""} onValueChange={(value) => handleChange(field.id, value)}>
                <SelectTrigger className={errors[field.id] ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                {field.opciones?.map((opcion) => (
                    <SelectItem key={typeof opcion === 'string' ? opcion : opcion.row} value={typeof opcion === 'string' ? opcion : opcion.row}>
                        {typeof opcion === 'string' ? opcion : opcion.row}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
            </div>
        )

        case "checkbox":
        return (
            <div className="flex items-start space-x-2 py-2" key={field.id}>
                <Checkbox
                    id={field.id}
                    checked={formValues[field.id] as boolean || false}
                    onCheckedChange={(checked) => handleChange(field.id, checked)}
                />

                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={field.id} className="font-medium">
                        {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
                    </Label>
                    {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
                </div>
            </div>
        )

        case "checklist_unico":
        return (
            <div className="grid gap-2" key={field.id}>
                <Label className="font-medium">
                    {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
                </Label>
                <div className="flex flex-col space-y-2 py-3">
                    {field.opciones?.map((opcion) => (
                        <div key={typeof opcion === 'string' ? opcion : opcion.row} className="flex items-center">
                            <Checkbox
                                id={`${field.id}-${typeof opcion === 'string' ? opcion : opcion.row}`}
                                checked={formValues[field.id] === (typeof opcion === 'string' ? opcion : opcion.row)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        handleChange(field.id, typeof opcion === 'string' ? opcion : opcion.row);
                                    }
                                }}
                            />
                            <Label htmlFor={`${field.id}-${typeof opcion === 'string' ? opcion : opcion.row}`} className="ml-2">
                                {typeof opcion === 'string' ? opcion : opcion.row}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
            </div>
        )

        case "checklist_multiple":
        return (
            <div className="grid gap-2" key={field.id}>
                <Label className="font-medium">
                    {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
                </Label>
                <div className="flex flex-col space-y-2 py-3">
                    {field.opciones?.map((opcion) => {
                        const currentValues = formValues[field.id] as string[] || [];
                        return (
                            <div key={typeof opcion === 'string' ? opcion : opcion.row} className="flex items-center">
                                <Checkbox
                                    id={`${field.id}-${typeof opcion === 'string' ? opcion : opcion.row}`}
                                    checked={currentValues.includes(typeof opcion === 'string' ? opcion : opcion.row)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            handleChange(field.id, [...currentValues, typeof opcion === 'string' ? opcion : opcion.row]);
                                        } else {
                                            handleChange(field.id, currentValues.filter(v => v !== (typeof opcion === 'string' ? opcion : opcion.row)));
                                        }
                                    }}
                                    variant="square"
                                />
                                <Label htmlFor={`${field.id}-${typeof opcion === 'string' ? opcion : opcion.row}`} className="ml-2">
                                    {typeof opcion === 'string' ? opcion : opcion.row}
                                </Label>
                            </div>
                        )
                    })}
                </div>
                {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
            </div>
        )

        case "checklist_unico_grid":
        return (
            <div className="grid gap-2" key={field.id}>
                <Label className="font-medium">
                    {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
                </Label>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left p-2">Pregunta</th>
                                {columnsGrid.map((column, index) => (
                                    <th key={index} className="text-center p-2">
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {field.opciones?.map((row, index) => (
                                typeof row === 'object' && (
                                    <tr key={index} className="border-t">
                                        <td className="p-2">{row.row}</td>
                                        {row.data.map((data, i) => (
                                            <td key={i} className="text-center p-2">
                                                <Checkbox
                                                    id={`${field.id}-${row.row}-${data}`}
                                                    checked={(formValues[field.id] as Record<string, string>)?.[`${field.id}-${row.row}`] === data}
                                                    onCheckedChange={() => handleChange(`${field.id}-${row.row}`, data, field.id)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )

        case "checklist_multiple_grid":
        return (
            <div className="grid gap-2" key={field.id}>
                <Label className="font-medium">
                    {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
                </Label>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left p-2">Pregunta</th>
                                {columnsGrid.map((column, index) => (
                                    <th key={index} className="text-center p-2">
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {field.opciones?.map((row, index) => (
                                typeof row === 'object' && (
                                    <tr key={index} className="border-t">
                                        <td className="p-2">{row.row}</td>
                                        {row.data.map((data, i) => {
                                            const currentValues = (formValues[field.id] as Record<string, string[]>)?.[`${field.id}-${row.row}`] || []
                                            return (
                                                <td key={i} className="text-center p-2">
                                                    <Checkbox
                                                        id={`${field.id}-${row.row}-${data}`}
                                                        variant="square"
                                                        checked={currentValues.includes(data)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                handleChange(`${field.id}-${row.row}`, [...currentValues, data], field.id)
                                                            } else {
                                                                handleChange(`${field.id}-${row.row}`, currentValues.filter(v => v !== data), field.id)
                                                            }
                                                        }}
                                                    />
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )

        case "qualification":
        return (
            <div className="grid gap-2" key={field.id}>
                <Label className="font-medium">
                    {field.nombre} {field.requerido && <span className="text-red-500">*</span>}
                </Label>
                <div className="flex flex-col justify-start items-star">
                    <div className="flex gap-2">
                        {Array.from({ length: field.maxQualification || 5 }).map((_, index) => {
                            const isSelected = index < Number(formValues[field.id] || 0);
                            const iconConfig = configQualificationIcons.find(icon => icon.id === field.qualificationIcon) || configQualificationIcons[0];
                            
                            const classIcons = `w-6 h-6 stroke-none ${isSelected ? iconConfig.selectedColor : iconConfig.unselectedColor}`
                            const fillIcons = isSelected ? "currentColor" : "#c7c6c6"

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleChange(field.id, (index + 1))}
                                    className="hover:scale-110 transition-transform"
                                >
                                    {iconConfig.id === "star" && (
                                        <Star 
                                            className={classIcons}
                                            fill={fillIcons}
                                        />
                                    )}
                                    {iconConfig.id === "heart" && (
                                        <Heart 
                                            className={classIcons}
                                            fill={fillIcons}
                                        />
                                    )}
                                    {iconConfig.id === "thumbs-up" && (
                                        <ThumbsUp 
                                            className={classIcons}
                                            fill={fillIcons}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleChange(field.id, 0)}
                        className="hover:scale-110 transition-transform w-fit"
                    >
                        <span className="text-gray-400 text-sm">Ninguna</span>
                    </button>
                </div>
                {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
            </div>
        )

        default:
        return null
    }
}

export default Field;