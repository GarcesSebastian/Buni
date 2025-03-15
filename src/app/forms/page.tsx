"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Event } from "@/types/Events"
import Field from "@/components/services/Forms/Field"
import Cookies from "js-cookie"

const getFormById = (eventId: number | string): Event => {
  const events = JSON.parse(Cookies.get("events") || "[]")
  const eventFind = events.find((evt:{id: number | string}) => evt.id == eventId)
  return eventFind
}

export default function FormsPage() {
  const searchParams = useSearchParams()
  const formId = searchParams.get("id") as string
  const formFound: Event = getFormById(Number(formId))

  const [formulario] = useState<Event>(formFound)
  const [formValues, setFormValues] = useState<Record<string, (string | boolean)>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [currentSection, setCurrentSection] = useState("personal")
  const [progress, setProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [isActive] = useState<boolean>(true)

  const secciones = {
    personal: formulario.forms.data.campos.filter((campo) => campo.seccion === "personal") || [],
    academica: formulario.forms.data.campos.filter((campo) => campo.seccion === "academica") || [],
    adicional: formulario.forms.data.campos.filter((campo) => campo.seccion === "adicional") || [],
  }

  useEffect(() => {
    const initialValues: Record<string, (string | boolean)> = {}
    formulario.forms.data.campos.forEach((campo) => {
      initialValues[campo.id] = campo.tipo === "checkbox" ? false : ""
    })
    setFormValues(initialValues)
  }, [formulario])

  useEffect(() => {
    const totalFields = formulario.forms.data.campos.filter((campo) => campo.requerido).length
    const completedFields = formulario.forms.data.campos
      .filter((campo) => campo.requerido)
      .filter((campo) => {
        if (campo.tipo === "checkbox") return formValues[campo.id] === true
        return formValues[campo.id] && formValues[campo.id].toString().trim() !== ""
      }).length

    const calculatedProgress = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
    setProgress(calculatedProgress)
  }, [formValues, formulario.forms.data.campos])

  const validateForm = (sectionToValidate?: string) => {
    const newErrors: Record<string, string> = {}

    const camposAValidar = sectionToValidate
      ? formulario.forms.data.campos.filter((campo) => campo.seccion === sectionToValidate)
      : formulario.forms.data.campos

    camposAValidar.forEach((campo) => {
      if (campo.requerido) {
        if (campo.tipo === "checkbox" && !formValues[campo.id]) {
          newErrors[campo.id] = "Este campo es obligatorio"
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
      console.log("Formulario enviado:", formValues)
      setSubmitted(true)
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
    <div className="flex h-full flex-col">
      <div className="flex flex-col sm:flex-row bg-gray-100 h-full overflow-y-auto">
        <main className="w-full overflow-y-auto p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex max-md:flex-col gap-2 justify-start items-center mb-6">
              <div className="max-md:flex gap-2">
                <h1 className="text-2xl font-bold">{formulario.nombre}</h1>
                <p className="text-muted-foreground">{formulario.forms.data.descripcion}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-3 flex flex-col">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      {formulario?.organizador}
                    </Badge>
                    <Badge variant={isActive ? "secondary" : "default"}>
                      {isActive ? "Registro abierto" : "Registro cerrado"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{formulario?.nombre}</CardTitle>
                  <CardDescription>{formulario.forms.data.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formulario?.fecha}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formulario.hora}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formulario.scenerys}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {formulario?.cupos == -1 && formulario?.cupos ? "Cupos ilimitados" : formulario?.cupos + " Cupos"}
                    </span>
                  </div>
                </CardContent>
              </Card>

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
            </div>

            <Card className="mb-8 print:shadow-none">
              <CardHeader className="flex flex-col">
                <CardTitle>{formulario.nombre}</CardTitle>
                <CardDescription>{formulario.forms.data.descripcion}</CardDescription>
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
                        Se ha enviado un correo de confirmación a <strong>{formValues.email}</strong> con los detalles
                        del evento.
                      </p>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    {!showPreview && (
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
                    )
                  }
                  </CardContent>

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
                      <Button type="submit" className="bg-[#DC2626] hover:bg-[#DC2626]/90">
                        <Save className="mr-2 h-4 w-4" />
                        Enviar formulario
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleNextSection} className="bg-[#DC2626] hover:bg-[#DC2626]/90">
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </form>
              )}
            </Card>

            <div className="text-sm text-muted-foreground text-center print:hidden">
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