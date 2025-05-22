"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { CalendarRange, Loader } from "lucide-react"
import { FormConfigDialog, type FormConfigData } from "./FormConfigDialog"
import { useNotification } from "@/hooks/client/useNotification"
import { Form } from "@/types/Forms"

interface FormConfigButtonProps {
  eventId: string
  eventName: string
  formAssists: Form
  formInscriptions: Form
  initialConfig?: FormConfigData
  onConfigSaved: (config: FormConfigData) => void
  isChangeFormConfig: boolean
}

export function FormConfigButton({
  eventId,
  eventName,
  formAssists,
  formInscriptions,
  initialConfig,
  onConfigSaved,
  isChangeFormConfig
}: FormConfigButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { showNotification } = useNotification()

  const handleSave = (config: FormConfigData) => {
    try {
      onConfigSaved(config)
    } catch (error) {
      showNotification({
        title: "Error",
        message: "No se pudo guardar la configuración",
        type: "error",
      })
    }
  }

  return (
    <>
      <Button onClick={() => setDialogOpen(true)} variant="outline" className="flex items-center gap-2" size="sm">
        {isChangeFormConfig ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            <span>Guardando...</span>
          </>
        ) : (
          <>
            <CalendarRange className="h-4 w-4" />
            <span>Configurar formularios</span>
          </>
        )}
      </Button>

      <FormConfigDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        eventId={eventId}
        eventName={eventName}
        formAssists={formAssists}
        formInscriptions={formInscriptions}
        initialConfig={initialConfig}
        onSave={handleSave}
        isChangeFormConfig={isChangeFormConfig}
      />
    </>
  )
}
