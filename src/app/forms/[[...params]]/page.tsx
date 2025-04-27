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
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Event, Scenery } from "@/types/Events"
import Field from "@/components/services/Forms/Field"
import { useUserData } from "@/hooks/auth/useUserData"
import Link from "next/link"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { getDataForm as getDataFormFromBackend } from "@/lib/DataSync"
import { useNotification } from "@/hooks/client/useNotification"
import { Form } from "@/types/Forms"
import { useSocket } from "@/hooks/server/useSocket"
import { validateForm } from "@/lib/FormsValidation"
import { Countdown } from "@/components/ui/Countdown"

export type formOptionsType = string | boolean | string[] | number

const getDataForm = async (eventId: number, typeForm: string): Promise<{event: Event, form: Form, scenery: Scenery} | undefined> => {
  const form = await getDataFormFromBackend(eventId, typeForm)
  return form
}

export default function FormsPage() {
  const params = useParams();
  const { user, setUser, isLoaded } = useUserData()
  const { showNotification } = useNotification()
  const { socket } = useSocket()
  const { params: dynamicParams } = params || {}; 
  const typeForm: string | undefined = dynamicParams?.[0] ?? undefined
  const idEvent: string | undefined = dynamicParams?.[1] ?? undefined
  const keyForm = typeForm ? `form${typeForm.charAt(0).toUpperCase().concat(typeForm.slice(1))}` : '';
  const [event, setEvent] = useState<Event | undefined>(undefined)
  const [scenery, setScenery] = useState<Scenery | undefined>(undefined)
  const [currentForm, setCurrentForm] = useState<Form | undefined>(undefined)
  const [formValues, setFormValues] = useState<Record<string, formOptionsType | Record<string, formOptionsType>>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [currentSection, setCurrentSection] = useState("personal")
  const [progress, setProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [isActive, setIsActive] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFormAvailable, setIsFormAvailable] = useState(false)
  const [isFormClosed, setIsFormClosed] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (user && idEvent) {
        const data = await getDataForm(Number(idEvent), keyForm)
        if (data) {
          setEvent(data.event)
          setCurrentForm(data.form)
          setScenery(data.scenery)
          setIsActive(data.event.state === "true")
          
          const now = new Date()
          const startDateTime = new Date(data.event.horarioInicio)
          const endDateTime = new Date(data.event.horarioFin)

          if (now >= startDateTime && now <= endDateTime) {
            setIsFormAvailable(true)
          } else {
            setIsFormAvailable(false)
          }

          if (now > endDateTime) {
            setIsFormClosed(true)
          } else {
            setIsFormClosed(false)
          }
        }
      }
    }
    fetchEvent()
  }, [user, idEvent])

  useEffect(() => {
    if (event && isFormAvailable && !isFormClosed) {
      const calculateTimeLeft = () => {
        const now = new Date()
        const endDateTime = new Date(event.horarioFin)
        const difference = endDateTime.getTime() - now.getTime()

        if (difference <= 0) {
          setIsFormClosed(true)
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          }
        }

        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }

      setTimeLeft(calculateTimeLeft())
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft())
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [event, isFormAvailable, isFormClosed])

  useEffect(() => {
    if (event && keyForm) {
      const form = user.forms.find((f) => f.id === Number((event[keyForm as keyof Event] as { id: number, key: string })?.id))
      if (form) {
        const initialValues: Record<string, (string | boolean)> = {}
        form.fields.forEach((campo) => {
          initialValues[campo.id] = campo.type === "checkbox" ? false : ""
        })
        setFormValues(initialValues)
      }
    }
  }, [event, keyForm, user.forms])

  useEffect(() => {
    if (event && keyForm) {
      const form = user.forms.find((f) => f.id === Number((event[keyForm as keyof Event] as { id: number, key: string })?.id))
      if (form) {
        const totalFields = form.fields.filter((campo) => campo.required).length
        const completedFields = form.fields
          .filter((campo) => campo.required)
          .filter((campo) => {
            if (campo.type === "checkbox") return formValues[campo.id] === true
            return formValues[campo.id] && formValues[campo.id].toString().trim() !== ""
          }).length

        const calculatedProgress = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
        setProgress(calculatedProgress)
      }
    }

    setIsLoading(false)
  }, [formValues, event, keyForm, user.forms])

  useEffect(() => {
    if (event && keyForm) {
      setIsLoading(false)
    }
  }, [event, keyForm])

  if (isLoading || !isLoaded) {
    return <div className="flex flex-col gap-4 justify-center items-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Cargando...</p>
    </div>
  }

  if ((!dynamicParams || dynamicParams.length === 0 || !typeForm || !idEvent) && !isLoaded) {
    return <ErrorMessage {...ERROR_MESSAGES.INVALID_PARAMS} />
  }

  if (!event && !isLoaded) {
    return <ErrorMessage {...ERROR_MESSAGES.EVENT_NOT_FOUND} />
  }

  if (!currentForm && !isLoaded) {
    return <ErrorMessage {...ERROR_MESSAGES.FORM_NOT_FOUND} />
  }

  const sceneryId = (event?.scenery as { id: number, key: string })?.id
  if (!sceneryId && !isLoaded) {
    return <ErrorMessage {...ERROR_MESSAGES.SCENERY_NOT_FOUND} />
  }

  const secciones = {
      personal: currentForm?.fields.filter((campo) => campo.section === "personal") || [],
      academic: currentForm?.fields.filter((campo) => campo.section === "academic") || [],
      additional: currentForm?.fields.filter((campo) => campo.section === "additional") || [],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (validateForm({currentForm, formValues, callback: setErrors})) {
        const newFormValues: Record<string, formOptionsType> = {}
        Object.keys(formValues).forEach((key) => {
          const value = formValues[key]
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            newFormValues[key.split("_")[0]] = JSON.stringify(value)
          } else {
            newFormValues[key.split("_")[0]] = value as formOptionsType
          }
        })

        if (!event) {
          throw new Error("Evento no encontrado")
        }

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

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${idEvent}/forms`, {
          method: "PUT",
          body: JSON.stringify({
            ...sanitizedFormValues,
            typeForm: typeForm,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (response.ok) {
          if (typeForm === "inscriptions") event?.inscriptions?.push(sanitizedFormValues)
          if (typeForm === "assists") event?.assists?.push(sanitizedFormValues)

          setSubmitted(true)

          const payload = {
            idEvent: Number(idEvent),
            typeForm: typeForm,
            data: sanitizedFormValues
          }

          const newUser = { ...user }
          newUser.events = newUser.events.map((eventUser) => {
            if (eventUser.id === Number(idEvent)) {
              const formKey = typeForm as 'assists' | 'inscriptions'
              return { ...eventUser, [formKey]: [...(eventUser[formKey] || []), sanitizedFormValues] };
            }
            return eventUser
          })

          setUser(newUser)
          socket?.emit("UPDATE_EVENT_FORMS", payload)
          return;
        }

        throw new Error(data.error || "Error al enviar el formulario")
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      showNotification({
        title: "Error",
        message: error instanceof Error ? error.message : "Error al enviar el formulario",
        type: "error"
      })
      setError(error instanceof Error ? error.message : "Error al enviar el formulario")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextSection = () => {
    if (currentSection === "personal") {
      if (validateForm({currentForm, formValues, sectionToValidate: "personal", callback: setErrors})) {
        setCurrentSection("academic")
      }
    } else if (currentSection === "academic") {
      if (validateForm({currentForm, formValues, sectionToValidate: "academic", callback: setErrors})) {
        setCurrentSection("additional")
      }
    } else if (currentSection === "additional") {
      if (validateForm({currentForm, formValues, sectionToValidate: "additional", callback: setErrors})) {
        setShowPreview(true)
      }
    }
  }

  const handlePrevSection = () => {
    if (currentSection === "academic") {
      setCurrentSection("personal")
    } else if (currentSection === "additional") {
      setCurrentSection("academic")
    } else if (showPreview) {
      setShowPreview(false)
    }
  }

  if (!isFormAvailable && event) {
    const startDateTime = new Date(event.horarioInicio)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Countdown 
          targetDate={startDateTime.toISOString()} 
          onComplete={() => setIsFormAvailable(true)}
        />
      </div>
    )
  }

  if (isFormClosed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">El evento ha finalizado</h2>
        <p className="text-muted-foreground">Lo sentimos, este formulario ya no está disponible.</p>
      </div>
    )
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
                <h1 className="text-2xl font-bold">{currentForm?.name}</h1>
                <p className="text-muted-foreground">{currentForm?.description}</p>
              </div>
            </div>

            {isFormAvailable && !isFormClosed && (
              <div className="mb-6">
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="text-muted-foreground">Tiempo restante:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{timeLeft.days}d</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="font-medium">{timeLeft.hours}h</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="font-medium">{timeLeft.minutes}m</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="font-medium">{timeLeft.seconds}s</span>
                  </div>
                </div>
              </div>
            )}

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
                  <CardDescription>{currentForm?.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Horario de inicio</Badge>
                    <span className="text-sm">{new Date(event?.horarioInicio || "").toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Horario de fin</Badge>
                    <span className="text-sm">{new Date(event?.horarioFin || "").toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Escenario</Badge>
                    <span className="text-sm">{scenery?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Cupos</Badge>
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
                        <Badge variant={currentSection === "academic" ? "default" : "outline"} className="text-xs">
                          {currentSection === "academic" ? "Actual" : "Espera"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Información Adicional</span>
                        <Badge variant={currentSection === "additional" ? "default" : "outline"} className="text-xs">
                          {currentSection === "additional" ? "Actual" : "Espera"}
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
                <CardTitle>{event?.nombre}</CardTitle>
                <CardDescription>{currentForm?.description}</CardDescription>
              </CardHeader>

              {isSubmitting && (
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-blue-100 p-3 mb-4">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Procesando formulario</h3>
                    <p className="text-muted-foreground mb-6">
                      Por favor, espere mientras se procesa su información...
                    </p>
                  </div>
                </CardContent>
              )}

              {error && (
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-red-100 p-3 mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">¡Ha ocurrido un error!</h3>
                    <p className="text-muted-foreground mb-6">
                      {error}
                    </p>
                    <Button type="button" onClick={() => {
                      setError(null)
                      setIsSubmitting(false)
                      setSubmitted(false)
                      setFormValues({})
                      setErrors({})
                      setCurrentSection("personal")
                      setShowPreview(false)
                    }} className="bg-primary hover:bg-primary/90">
                      Reintentar
                    </Button>
                  </div>
                </CardContent>
              )}

              {submitted && (
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
              )}

              {!submitted && (
                <form onSubmit={handleSubmit}>
                    {!showPreview && isActive && (
                      <CardContent>
                          <Tabs value={currentSection} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-8">
                              <TabsTrigger
                                value="personal"
                                onClick={() => setCurrentSection("personal")}
                                disabled={currentSection === "additional"}
                              >
                                Personal
                              </TabsTrigger>
                              <TabsTrigger
                                value="academic"
                                onClick={() => setCurrentSection("academic")}
                                disabled={currentSection === "personal" || currentSection === "additional"}
                              >
                                Académica
                              </TabsTrigger>
                              <TabsTrigger
                                value="additional"
                                onClick={() => setCurrentSection("additional")}
                                disabled={currentSection === "personal" || currentSection === "academic"}
                              >
                                Adicional
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-4">
                              {secciones.personal.map((campo) => (
                                <Field key={campo.id} field={campo} formValues={formValues} setFormValues={setFormValues} errors={errors} setErrors={setErrors} />
                              ))}
                            </TabsContent>

                            <TabsContent value="academic" className="space-y-4">
                              {secciones.academic.map((campo) => (
                                <Field key={campo.id} field={campo} formValues={formValues} setFormValues={setFormValues} errors={errors} setErrors={setErrors} />
                              ))}
                            </TabsContent>

                            <TabsContent value="additional" className="space-y-4">
                              {secciones.additional.map((campo) => (
                                <Field key={campo.id} field={campo} formValues={formValues} setFormValues={setFormValues} errors={errors} setErrors={setErrors} />
                              ))}
                            </TabsContent>
                          </Tabs>

                        {!isActive && (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <h3 className="text-xl font-semibold mb-2">¡Formulario cerrado!</h3>
                            <p className="text-muted-foreground mb-6">
                              El registro para este evento ha sido cerrado.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    )}

                  {isActive && (
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevSection}
                        disabled={currentSection === "personal" || isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronLeft className="mr-2 h-4 w-4" />}
                        Anterior
                      </Button>

                    {showPreview ? (
                      <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Enviar formulario
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleNextSection} className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronRight className="ml-2 h-4 w-4" />}
                        Siguiente
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