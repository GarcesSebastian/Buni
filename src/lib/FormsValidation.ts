import { Form } from "@/types/Forms"

interface FormValues {
    [key: string]: string | string[] | number | boolean | Record<string, string | string[] | number | boolean>
}

interface validateFormProps {
    currentForm: Form | undefined
    formValues: FormValues
    sectionToValidate?: string
    callback: (errors: Record<string, string>) => void
}

export const validateForm = ({currentForm, formValues, sectionToValidate, callback}: validateFormProps) => {
    const newErrors: Record<string, string> = {}

    const camposAValidar = sectionToValidate
      ? currentForm?.fields.filter((campo) => campo.section === sectionToValidate) || []
      : currentForm?.fields || []

    camposAValidar.forEach((campo) => {
      if (campo.required) {
        if (campo.type === "checkbox" && !formValues[campo.id]) {
          newErrors[campo.id] = "Este campo es obligatorio"
        } else if (campo.type === "checklist_single_grid" || campo.type === "checklist_multiple_grid") {
          const gridValues = formValues[campo.id] as Record<string, string | string[]> || {}
          const hasAllRowsSelected = campo.options?.every((opcion) => {
            if (typeof opcion === 'object') {
              const rowKey = `${campo.id}-${opcion.row}`
              if (campo.type === "checklist_single_grid") {
                return gridValues[rowKey] !== undefined && gridValues[rowKey] !== ""
              } else {
                return Array.isArray(gridValues[rowKey]) && (gridValues[rowKey] as string[]).length > 0
              }
            }
            return false
          })

          if (!hasAllRowsSelected) {
            newErrors[campo.id] = "Debe seleccionar al menos una opción en cada fila"
          }
        } else if ( campo.type !== "checkbox" && (!formValues[campo.id] || formValues[campo.id].toString().trim() === "")) {
          newErrors[campo.id] = "Este campo es obligatorio"
        }
      }

      if (campo.type === "email" && formValues[campo.id] && !/\S+@\S+\.\S+/.test(formValues[campo.id] as string)) {
        newErrors[campo.id] = "Ingrese un correo electrónico válido"
      }
    })

    callback(newErrors)
    return Object.keys(newErrors).length === 0
}