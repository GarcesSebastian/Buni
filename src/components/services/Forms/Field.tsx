import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Checkbox } from "@/components/ui/Checkbox"
import { FormField } from "@/types/Forms"

interface Props{
    field: FormField,
    formValues: Record<string, (string | boolean | string[])>
    errors: Record<string, string>
    setFormValues: (value: Record<string, (string | boolean | string[])> | ((prev: Record<string, (string | boolean | string[])>) => Record<string, (string | boolean | string[])>)) => void,
    setErrors: (value: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void,
}

const Field = ({field, formValues, setFormValues, errors, setErrors}: Props) => {
    const handleChange = (id: string, value: string | boolean | string[]) => {
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
                <div className="flex flex-col space-y-2 border rounded-md p-3">
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
                <div className="flex flex-col space-y-2 border rounded-md p-3">
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
                                />
                                <Label htmlFor={`${field.id}-${opcion}`} className="ml-2">{opcion}</Label>
                            </div>
                        )
                    })}
                </div>
                {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
            </div>
        )

        default:
        return null
    }
}

export default Field;