"use client"

import type React from "react"

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
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Switch } from "@/components/ui/Switch"
import { useNotification } from "@/hooks/client/useNotification"
import { CalendarRange, ClipboardCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Form } from "@/types/Forms"

interface FormConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventName: string
  formAssists: Form
  formInscriptions: Form
  onSave: (config: FormConfigData) => void
  initialConfig?: FormConfigData
  isChangeFormConfig: boolean
}

export interface FormConfigData {
  assists: {
    enabled: boolean
    startDate: string
    endDate: string
  }
  inscriptions: {
    enabled: boolean
    startDate: string
    endDate: string
  }
}

export function FormConfigDialog({
  open,
  onOpenChange,
  eventName,
  formAssists,
  formInscriptions,
  onSave,
  initialConfig,
  isChangeFormConfig
}: FormConfigDialogProps) {

    const [config, setConfig] = useState<FormConfigData>(
        initialConfig || {
        assists: {
            enabled: false,
            startDate: "",
            endDate: "",
        },
        inscriptions: {
            enabled: false,
            startDate: "",
            endDate: "",
        },
        },
    )
    const [activeTab, setActiveTab] = useState<"assists" | "inscriptions">("inscriptions")
    const { showNotification } = useNotification()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (config.assists.enabled) {
                if (!config.assists.startDate || !config.assists.endDate) {
                    throw new Error("Por favor complete las fechas para el formulario de asistencias")
                }
                if (new Date(config.assists.endDate) <= new Date(config.assists.startDate)) {
                    throw new Error("La fecha de fin debe ser posterior a la fecha de inicio para asistencias")
                }
            }

            if (config.inscriptions.enabled) {
                if (!config.inscriptions.startDate || !config.inscriptions.endDate) {
                    throw new Error("Por favor complete las fechas para el formulario de inscripciones")
                }
                if (new Date(config.inscriptions.endDate) <= new Date(config.inscriptions.startDate)) {
                    throw new Error("La fecha de fin debe ser posterior a la fecha de inicio para inscripciones")
                }
            }

            onSave(config)
        } catch (error) {
            showNotification({
                title: "Error",
                message: error instanceof Error ? error.message : "Error inesperado",
                type: "error",
            })
        }
    }

    useEffect(() => {
        if (!isChangeFormConfig) {
            onOpenChange(false)
        }
    },[isChangeFormConfig])

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] overflow-hidden">
        <form className="grid grid-rows-[auto_1fr] max-h-[90vh] overflow-hidden" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              <span>Configurar intervalos de formularios</span>
            </DialogTitle>
            <DialogDescription>
              Define cuándo estarán disponibles los formularios de inscripción y asistencia para el evento{" "}
              <span className="font-medium">{eventName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 px-2 max-h-[70vh] overflow-y-auto">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "assists" | "inscriptions")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="inscriptions" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Inscripciones</span>
                </TabsTrigger>
                <TabsTrigger value="assists" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Asistencias</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inscriptions">
                <Card>
                  <CardHeader className="pb-3 flex-col">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Formulario de inscripciones</CardTitle>
                        <CardDescription>
                          {formInscriptions.name || "No hay formulario de inscripciones seleccionado"}
                        </CardDescription>
                      </div>
                      <Badge variant={config.inscriptions.enabled ? "default" : "secondary"}>
                        {config.inscriptions.enabled ? "Habilitado" : "Deshabilitado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="inscriptions-enabled" className="flex items-center gap-2 cursor-pointer">
                        <span>Habilitar intervalo de fechas</span>
                      </Label>
                      <Switch
                        id="inscriptions-enabled"
                        disabled={isChangeFormConfig}
                        checked={config.inscriptions.enabled}
                        onCheckedChange={(checked) =>
                          setConfig({
                            ...config,
                            inscriptions: {
                              ...config.inscriptions,
                              enabled: checked,
                            },
                          })
                        }
                      />
                    </div>

                    {config.inscriptions.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="inscriptions-start">Fecha de inicio</Label>
                          <Input
                            id="inscriptions-start"
                            type="datetime-local"
                            disabled={isChangeFormConfig}
                            value={config.inscriptions.startDate}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                inscriptions: {
                                  ...config.inscriptions,
                                  startDate: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="inscriptions-end">Fecha de fin</Label>
                          <Input
                            id="inscriptions-end"
                            type="datetime-local"
                            disabled={isChangeFormConfig}
                            value={config.inscriptions.endDate}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                inscriptions: {
                                  ...config.inscriptions,
                                  endDate: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      {config.inscriptions.enabled ? (
                        <p>
                          Los usuarios podrán completar el formulario de inscripción solo durante el intervalo de fechas
                          especificado.
                        </p>
                      ) : (
                        <p>
                          El formulario de inscripción estará disponible en cualquier momento. Habilita el intervalo de
                          fechas para restringir su disponibilidad.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assists">
                <Card>
                  <CardHeader className="pb-3 flex-col">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Formulario de asistencias</CardTitle>
                        <CardDescription>
                          {formAssists.name || "No hay formulario de asistencias seleccionado"}
                        </CardDescription>
                      </div>
                      <Badge variant={config.assists.enabled ? "default" : "secondary"}>
                        {config.assists.enabled ? "Habilitado" : "Deshabilitado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="assists-enabled" className="flex items-center gap-2 cursor-pointer">
                        <span>Habilitar intervalo de fechas</span>
                      </Label>
                      <Switch
                        id="assists-enabled"
                        disabled={isChangeFormConfig}
                        checked={config.assists.enabled}
                        onCheckedChange={(checked) =>
                          setConfig({
                            ...config,
                            assists: {
                              ...config.assists,
                              enabled: checked,
                            },
                          })
                        }
                      />
                    </div>

                    {config.assists.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="assists-start">Fecha de inicio</Label>
                          <Input
                            id="assists-start"
                            type="datetime-local"
                            disabled={isChangeFormConfig}
                            value={config.assists.startDate}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                assists: {
                                  ...config.assists,
                                  startDate: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assists-end">Fecha de fin</Label>
                          <Input
                            id="assists-end"
                            type="datetime-local"
                            disabled={isChangeFormConfig}
                            value={config.assists.endDate}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                assists: {
                                  ...config.assists,
                                  endDate: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      {config.assists.enabled ? (
                        <p>
                          Los usuarios podrán completar el formulario de asistencia solo durante el intervalo de fechas
                          especificado.
                        </p>
                      ) : (
                        <p>
                          El formulario de asistencia estará disponible en cualquier momento. Habilita el intervalo de
                          fechas para restringir su disponibilidad.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="flex flex-row mt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isChangeFormConfig}>
              {isChangeFormConfig ? "Guardando..." : "Guardar configuración"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}