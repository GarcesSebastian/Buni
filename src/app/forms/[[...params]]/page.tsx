"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Progress } from "@/components/ui/Progress"
import { Badge } from "@/components/ui/Badge"
import {
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { Event } from "@/types/Events"
import Field from "@/components/services/Forms/Field"
import { User, useUserData } from "@/hooks/auth/useUserData"
import Link from "next/link"
import { useWebSocket } from "@/hooks/server/useWebSocket"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

export type formOptionsType = string | boolean | string[] | number

const getEvent = (user: User, eventId: number): Event | undefined => {
  const eventFind = (user.events as Event[]).find((evt:{id: number | string}) => evt.id == eventId)
  return eventFind
}

export default function FormsPage() {
  const params = useParams();
  const {user} = useUserData()
  const { sendMessage } = useWebSocket()
  const { params: dynamicParams } = params || {}; 
  const typeForm: string | undefined = dynamicParams?.[0] ?? undefined
  const idEvent: string | undefined = dynamicParams?.[1] ?? undefined
  const keyForm = typeForm ? `form${typeForm.charAt(0).toUpperCase().concat(typeForm.slice(1))}` : '';

  const [event, setEvent] = useState<Event | undefined>(undefined)

  const [formValues, setFormValues] = useState<Record<string, formOptionsType | Record<string, formOptionsType>>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [currentSection, setCurrentSection] = useState("personal")
  const [progress, setProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [isActive, setIsActive] = useState<boolean>(true)
  
  useEffect(() => {
    if (user && idEvent) {
      const eventFound = getEvent(user, Number(idEvent))
      setEvent(eventFound)
      setIsActive(eventFound?.state === "true")
    }
  }, [user, idEvent])

  useEffect(() => {
    if (event && keyForm) {
      if (form) {
        const initialValues: Record<string, (string | boolean)> = {}
        form.campos.forEach((campo) => {
          initialValues[campo.id] = campo.tipo === "checkbox" ? false : ""
        })
        setFormValues(initialValues)
      }
    }
  }, [event, keyForm])

  useEffect(() => {
    if (event && keyForm) {
      if (form) {
        const totalFields = form.campos.filter((campo) => campo.requerido).length
        const completedFields = form.campos
          .filter((campo) => campo.requerido)
          .filter((campo) => {
            if (campo.tipo === "checkbox") return formValues[campo.id] === true
            return formValues[campo.id] && formValues[campo.id].toString().trim() !== ""
          }).length

        const calculatedProgress = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
        setProgress(calculatedProgress)
      }
    }
  }, [formValues, event, keyForm])


  if (!dynamicParams || dynamicParams.length === 0 || !typeForm || !idEvent) {
    return <ErrorMessage {...ERROR_MESSAGES.INVALID_PARAMS} />
  }

  if (!event) {
    return <ErrorMessage {...ERROR_MESSAGES.EVENT_NOT_FOUND} />
  }

  const idForm = (event[keyForm as keyof Event] as { id: number, key: string }).id
  const form = user.form.find((f) => f.id == Number(idForm))

  if (!form) {
    return <ErrorMessage {...ERROR_MESSAGES.FORM_NOT_FOUND} />
  }

  const idScenery = (event.scenery as { id: number, key: string }).id
  const scenery = user.scenery.find((s) => s.id == Number(idScenery))

  if (!scenery) {
    return <ErrorMessage {...ERROR_MESSAGES.SCENERY_NOT_FOUND} />
  }

  const secciones = {
      personal: form.campos.filter((campo) => campo.seccion === "personal") || [],
      academica: form.campos.filter((campo) => campo.seccion === "academica") || [],
      adicional: form.campos.filter((campo) => campo.seccion === "adicional") || [],
  }

  const validateForm = (sectionToValidate?: string) => {
    const newErrors: Record<string, string> = {}

    const camposAValidar = sectionToValidate
      ? form.campos.filter((campo) => campo.seccion === sectionToValidate)
      : form.campos

    camposAValidar.forEach((campo) => {
      if (campo.requerido) {
        if (campo.tipo === "checkbox" && !formValues[campo.id]) {
          newErrors[campo.id] = "Este campo es obligatorio"
        } else if (campo.tipo === "checklist_unico_grid" || campo.tipo === "checklist_multiple_grid") {
          const gridValues = formValues[campo.id] as Record<string, string | string[]> || {}
          const hasAllRowsSelected = campo.opciones?.every((opcion) => {
            if (typeof opcion === 'object') {
              const rowKey = `${campo.id}-${opcion.row}`
              if (campo.tipo === "checklist_unico_grid") {
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
        } else if (
          campo.tipo !== "checkbox" &&
          (!formValues[campo.id] || formValues[campo.id].toString().trim() === "")
        ) {
          newErrors[campo.id] = "Este campo es obligatorio"
        }
      }

      if (campo.tipo === "email" && formValues[campo.id] && !/\S+@\S+\.\S+/.test(formValues[campo.id] as string)) {
        newErrors[campo.id] = "Ingrese un correo electrónico válido"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const newFormValues: Record<string, formOptionsType> = {}
      Object.keys(formValues).forEach((key) => {
        const value = formValues[key]
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          newFormValues[key.split("_")[0]] = JSON.stringify(value)
        } else {
          newFormValues[key.split("_")[0]] = value as formOptionsType
        }
      })
      
      const event = user.events.find((evt) => evt.id == Number(idEvent))
      const sanitizedFormValues: Record<string, string | number> = {};
      Object.keys(newFormValues).forEach((key) => {
        const value = newFormValues[key]
        if (typeof value === "boolean") {
          sanitizedFormValues[key] = value ? 1 : 0
        } else if (Array.isArray(value)) {
          sanitizedFormValues[key] = value.join(", ")
        } else {
          sanitizedFormValues[key] = value as string
        }
      })

      if (typeForm === "inscriptions") event?.inscriptions?.push(sanitizedFormValues)
      if (typeForm === "assists") event?.assists?.push(sanitizedFormValues)

      setSubmitted(true)
      sendMessage("UPDATE_DATA", {users: user})
    }
  }

  const handleNextSection = () => {
    if (currentSection === "personal") {
      if (validateForm("personal")) {
        setCurrentSection("academica")
      }
    } else if (currentSection === "academica") {
      if (validateForm("academica")) {
        setCurrentSection("adicional")
      }
    } else if (currentSection === "adicional") {
      if (validateForm("adicional")) {
        setShowPreview(true)
      }
    }
  }

  const handlePrevSection = () => {
    if (currentSection === "academica") {
      setCurrentSection("personal")
    } else if (currentSection === "adicional") {
      setCurrentSection("academica")
    } else if (showPreview) {
      setShowPreview(false)
    }
  }

  return (
    <div className="h-full">
      <div className="h-full bg-gray-100">
        <main className="h-full overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex max-md:flex-col gap-2 justify-start items-center mb-6">
              <Link href="/events" className="mr-4">
                  <Button variant="outline" size="icon" className="flex justify-center items-center">
                      <ArrowLeft className="h-4 w-4" />
                  </Button>
              </Link>
              <div className="flex flex-col items-start justify-start gap-2 w-full">
                <h1 className="text-2xl font-bold">{form.name}</h1>
                <p className="text-muted-foreground">{form.descripcion}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className={`${isActive ? "md:col-span-2" : "md:col-span-3"}`}>
                <CardHeader className="pb-3 flex flex-col">
                  <div className="flex justify-between items-center gap-2">
                    <Badge variant="outline" className="mb-2 flex justify-center items-center text-center">
                      {event?.organizador}
                    </Badge>
                    <Badge variant={isActive ? "secondary" : "default"} className="flex justify-center items-center text-center">
                      {isActive ? "Registro abierto" : "Registro cerrado"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{event?.nombre}</CardTitle>
                  <CardDescription>{form.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{event?.fecha}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{event.hora}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{scenery.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {event?.cupos == "-1" ? "Cupos ilimitados" : event?.cupos + " Cupos"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {isActive && (
                <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">Progreso del registro</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center">{progress}% completado</p>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Información Personal</span>
                        <Badge variant={currentSection === "personal" ? "default" : "outline"} className="text-xs">
                          {currentSection === "personal" ? "Actual" : "Espera"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Información Académica</span>
                        <Badge variant={currentSection === "academica" ? "default" : "outline"} className="text-xs">
                          {currentSection === "academica" ? "Actual" : "Espera"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Información Adicional</span>
                        <Badge variant={currentSection === "adicional" ? "default" : "outline"} className="text-xs">
                          {currentSection === "adicional" ? "Actual" : "Espera"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Revisión y Envío</span>
                        <Badge variant={showPreview ? "default" : "outline"} className="text-xs">
                          {showPreview ? "Actual" : "Espera"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="mb-8 print:shadow-none">
              <CardHeader className="flex flex-col">
                <CardTitle>{event.nombre}</CardTitle>
                <CardDescription>{form.descripcion}</CardDescription>
              </CardHeader>

              {submitted ? (
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-green-100 p-3 mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">¡Formulario enviado con éxito!</h3>
                    <p className="text-muted-foreground mb-6">
                      Gracias por completar el formulario. Su información ha sido registrada.
                    </p>
                    <div className="space-y-4">
                      <p className="text-sm">
                        Se ha enviado un correo de confirmación a <strong>{(formValues.email as string) || ""}</strong> con los detalles
                        del evento.
                      </p>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    {!showPreview && isActive && (
                      <Tabs value={currentSection} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                          <TabsTrigger
                            value="personal"
                            onClick={() => setCurrentSection("personal")}
                            disabled={currentSection === "adicional"}
                          >
                            Personal
                          </TabsTrigger>
                          <TabsTrigger
                            value="academica"
                            onClick={() => setCurrentSection("academica")}
                            disabled={currentSection === "personal" || currentSection === "adicional"}
                          >
                            Académica
                          </TabsTrigger>
                          <TabsTrigger
                            value="adicional"
                            onClick={() => setCurrentSection("adicional")}
                            disabled={currentSection === "personal" || currentSection === "academica"}
                          >
                            Adicional
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal" className="space-y-4">
                          {secciones.personal.map((campo) => (
                            <Field key={campo.id} field={campo} formValues={formValues} setFormValues={setFormValues} errors={errors} setErrors={setErrors} />
                          ))}
                        </TabsContent>

                        <TabsContent value="academica" className="space-y-4">
                          {secciones.academica.map((campo) => (
                            <Field key={campo.id} field={campo} formValues={formValues} setFormValues={setFormValues} errors={errors} setErrors={setErrors} />
                          ))}
                        </TabsContent>

                        <TabsContent value="adicional" className="space-y-4">
                          {secciones.adicional.map((campo) => (
                            <Field key={campo.id} field={campo} formValues={formValues} setFormValues={setFormValues} errors={errors} setErrors={setErrors} />
                          ))}
                        </TabsContent>
                      </Tabs>
                    )}

                    {!isActive && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <h3 className="text-xl font-semibold mb-2">¡Formulario cerrado!</h3>
                        <p className="text-muted-foreground mb-6">
                          El registro para este evento ha sido cerrado.
                        </p>
                      </div>
                    )}
                  </CardContent>

                  {isActive && (
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevSection}
                        disabled={currentSection === "personal"}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>

                    {showPreview ? (
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        <Save className="mr-2 h-4 w-4" />
                        Enviar formulario
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleNextSection} className="bg-primary hover:bg-primary/90">
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                  )}
                </form>
              )}
            </Card>

            <div className="text-sm text-muted-foreground text-center print:hidden pb-6">
              <p>
                Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
              </p>
              <p className="mt-2">© {new Date().getFullYear()} BUNI - Sistema de Eventos</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}