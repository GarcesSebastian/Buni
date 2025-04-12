import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Checkbox } from "@/components/ui/Checkbox"
import { FormField } from "@/types/Forms"
import { formOptionsType } from "@/app/forms/[[...params]]/page"
import { Star, Heart, ThumbsUp } from "lucide-react"
import { configQualificationIcons } from "@/config/Forms"

type formValuesType = Record<string, formOptionsType>

interface Props{
    field: FormField,
    formValues: formValuesType
    errors: Record<string, string>
    setFormValues: (value: formValuesType | ((prev: formValuesType) => formValuesType)) => void,
    setErrors: (value: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void,
}

const Field = ({field, formValues, setFormValues, errors, setErrors}: Props) => {
    const handleChange = (id: string, value: formOptionsType) => {
    setFormValues((prev) => ({
        ...prev,
        [id]: value,
    }))
  
      if (value && errors[id]) {
        setErrors((prev: Record<string, string>) => {
            const newErrors: Record<string, string> = { ...prev }
            delete newErrors[id]
            return newErrors
        })
      }
    }

    console.log(formValues, field)
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
                    <SelectItem key={opcion} value={opcion}>
                    {opcion}
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
                        <div key={opcion} className="flex items-center">
                            <Checkbox
                                id={`${field.id}-${opcion}`}
                                checked={formValues[field.id] === opcion}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        handleChange(field.id, opcion);
                                    }
                                }}
                            />
                            <Label htmlFor={`${field.id}-${opcion}`} className="ml-2">{opcion}</Label>
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
                            <div key={opcion} className="flex items-center">
                                <Checkbox
                                    id={`${field.id}-${opcion}`}
                                    checked={currentValues.includes(opcion)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            handleChange(field.id, [...currentValues, opcion]);
                                        } else {
                                            handleChange(field.id, currentValues.filter(v => v !== opcion));
                                        }
                                    }}
                                    variant="square"
                                />
                                <Label htmlFor={`${field.id}-${opcion}`} className="ml-2">{opcion}</Label>
                            </div>
                        )
                    })}
                </div>
                {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
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
                                    onClick={() => handleChange(field.id, (index + 1).toString())}
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
                        onClick={() => handleChange(field.id, "0")}
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