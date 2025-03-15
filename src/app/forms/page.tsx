"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Checkbox } from "@/components/ui/Checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Progress } from "@/components/ui/Progress"
import { Separator } from "@/components/ui/Separator"
import { Badge } from "@/components/ui/Badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import {
  ArrowLeft,
  Save,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Printer,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface FormField {
  id: string
  nombre: string
  tipo: "texto" | "numero" | "email" | "fecha" | "seleccion" | "checkbox"
  requerido: boolean
  opciones?: string[]
  valor?: any
  seccion?: string
}

interface Formulario {
  id: number
  nombre: string
  descripcion: string
  campos: FormField[]
  evento?: {
    nombre: string
    fecha: string
    hora: string
    lugar: string
    organizador: string
  }
}

const formularioEjemplo: Formulario = {
  id: 1,
  nombre: "Registro de Participantes",
  descripcion: "Complete este formulario para registrarse en el evento",
  evento: {
    nombre: "Conferencia de Ingeniería 2024",
    fecha: "15 de Junio, 2024",
    hora: "10:00 AM - 4:00 PM",
    lugar: "Auditorio Principal, Campus Central",
    organizador: "Facultad de Ingeniería",
  },
  campos: [
    { id: "nombre", nombre: "Nombre Completo", tipo: "texto", requerido: true, seccion: "personal" },
    { id: "email", nombre: "Correo Electrónico", tipo: "email", requerido: true, seccion: "personal" },
    { id: "telefono", nombre: "Teléfono", tipo: "numero", requerido: false, seccion: "personal" },
    { id: "fecha_nacimiento", nombre: "Fecha de Nacimiento", tipo: "fecha", requerido: true, seccion: "personal" },
    {
      id: "escuela",
      nombre: "Escuela/Facultad",
      tipo: "seleccion",
      requerido: true,
      opciones: ["Ingeniería", "Medicina", "Derecho", "Psicología", "Economía", "Otra"],
      seccion: "academica",
    },
    { id: "semestre", nombre: "Semestre Actual", tipo: "numero", requerido: true, seccion: "academica" },
    {
      id: "area_interes",
      nombre: "Área de Interés",
      tipo: "seleccion",
      requerido: true,
      opciones: ["Inteligencia Artificial", "Desarrollo Web", "Robótica", "Ciencia de Datos", "Ciberseguridad", "Otra"],
      seccion: "academica",
    },
    {
      id: "conocimiento_previo",
      nombre: "Nivel de Conocimiento Previo",
      tipo: "seleccion",
      requerido: true,
      opciones: ["Ninguno", "Básico", "Intermedio", "Avanzado"],
      seccion: "academica",
    },
    {
      id: "expectativas",
      nombre: "¿Qué espera aprender en este evento?",
      tipo: "texto",
      requerido: false,
      seccion: "adicional",
    },
    {
      id: "como_entero",
      nombre: "¿Cómo se enteró del evento?",
      tipo: "seleccion",
      requerido: false,
      opciones: ["Redes Sociales", "Correo Electrónico", "Página Web", "Amigos", "Profesores", "Otro"],
      seccion: "adicional",
    },
    {
      id: "terminos",
      nombre: "Acepto los términos y condiciones",
      tipo: "checkbox",
      requerido: true,
      seccion: "adicional",
    },
    {
      id: "comunicaciones",
      nombre: "Deseo recibir información sobre futuros eventos",
      tipo: "checkbox",
      requerido: false,
      seccion: "adicional",
    },
  ],
}

const faqItems = [
  {
    question: "¿Cómo puedo modificar mis datos después de enviar el formulario?",
    answer:
      "Puede contactar al organizador del evento a través del correo electrónico proporcionado en la sección de contacto para solicitar modificaciones en sus datos.",
  },
  {
    question: "¿Es necesario completar todos los campos del formulario?",
    answer:
      "Solo los campos marcados con un asterisco (*) son obligatorios. Los demás campos son opcionales pero nos ayudan a mejorar su experiencia en el evento.",
  },
  {
    question: "¿Qué sucede después de enviar mi registro?",
    answer:
      "Recibirá un correo electrónico de confirmación con los detalles del evento y su código QR de acceso. Si no lo recibe, verifique su carpeta de spam o contacte al organizador.",
  },
  {
    question: "¿Puedo registrar a más de una persona con este formulario?",
    answer:
      "No, este formulario es para registro individual. Cada participante debe completar su propio formulario de registro.",
  },
]

export default function FormsPage() {
  const searchParams = useSearchParams()
  const formId = searchParams.get("id")
  const { toast } = useToast()

  const [formulario, setFormulario] = useState<Formulario>(formularioEjemplo)

  const [formValues, setFormValues] = useState<Record<string, any>>({})

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [submitted, setSubmitted] = useState(false)

  const [currentSection, setCurrentSection] = useState("personal")

  const [progress, setProgress] = useState(0)

  const [showPreview, setShowPreview] = useState(false)

  const secciones = {
    personal: formulario.campos.filter((campo) => campo.seccion === "personal"),
    academica: formulario.campos.filter((campo) => campo.seccion === "academica"),
    adicional: formulario.campos.filter((campo) => campo.seccion === "adicional"),
  }

  useEffect(() => {
    const initialValues: Record<string, any> = {}
    formulario.campos.forEach((campo) => {
      initialValues[campo.id] = campo.tipo === "checkbox" ? false : ""
    })
    setFormValues(initialValues)
  }, [formulario])

  useEffect(() => {
    const totalFields = formulario.campos.filter((campo) => campo.requerido).length
    const completedFields = formulario.campos
      .filter((campo) => campo.requerido)
      .filter((campo) => {
        if (campo.tipo === "checkbox") return formValues[campo.id] === true
        return formValues[campo.id] && formValues[campo.id].toString().trim() !== ""
      }).length

    const calculatedProgress = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
    setProgress(calculatedProgress)
  }, [formValues, formulario.campos])

  const handleChange = (id: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }))

    if (value && errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const validateForm = (sectionToValidate?: string) => {
    const newErrors: Record<string, string> = {}

    const camposAValidar = sectionToValidate
      ? formulario.campos.filter((campo) => campo.seccion === sectionToValidate)
      : formulario.campos

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

      if (campo.tipo === "email" && formValues[campo.id] && !/\S+@\S+\.\S+/.test(formValues[campo.id])) {
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

  const handleReset = () => {
    const initialValues: Record<string, any> = {}
    formulario.campos.forEach((campo) => {
      initialValues[campo.id] = campo.tipo === "checkbox" ? false : ""
    })
    setFormValues(initialValues)
    setErrors({})
    setSubmitted(false)
    setCurrentSection("personal")
    setShowPreview(false)
  }

  const handleSaveProgress = () => {
    localStorage.setItem(`form_${formulario.id}_progress`, JSON.stringify(formValues))

    toast({
      title: "Progreso guardado",
      description: "Podrá continuar desde donde lo dejó más tarde.",
      duration: 3000,
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const renderField = (campo: FormField) => {
    switch (campo.tipo) {
      case "texto":
      case "email":
        return (
          <div className="grid gap-2" key={campo.id}>
            <Label htmlFor={campo.id} className="font-medium">
              {campo.nombre} {campo.requerido && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={campo.id}
              type={campo.tipo === "email" ? "email" : "text"}
              value={formValues[campo.id] || ""}
              onChange={(e) => handleChange(campo.id, e.target.value)}
              className={errors[campo.id] ? "border-red-500" : ""}
            />
            {errors[campo.id] && <p className="text-sm text-red-500">{errors[campo.id]}</p>}
          </div>
        )

      case "numero":
        return (
          <div className="grid gap-2" key={campo.id}>
            <Label htmlFor={campo.id} className="font-medium">
              {campo.nombre} {campo.requerido && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={campo.id}
              type="number"
              value={formValues[campo.id] || ""}
              onChange={(e) => handleChange(campo.id, e.target.value)}
              className={errors[campo.id] ? "border-red-500" : ""}
            />
            {errors[campo.id] && <p className="text-sm text-red-500">{errors[campo.id]}</p>}
          </div>
        )

      case "fecha":
        return (
          <div className="grid gap-2" key={campo.id}>
            <Label htmlFor={campo.id} className="font-medium">
              {campo.nombre} {campo.requerido && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={campo.id}
              type="date"
              value={formValues[campo.id] || ""}
              onChange={(e) => handleChange(campo.id, e.target.value)}
              className={errors[campo.id] ? "border-red-500" : ""}
            />
            {errors[campo.id] && <p className="text-sm text-red-500">{errors[campo.id]}</p>}
          </div>
        )

      case "seleccion":
        return (
          <div className="grid gap-2" key={campo.id}>
            <Label htmlFor={campo.id} className="font-medium">
              {campo.nombre} {campo.requerido && <span className="text-red-500">*</span>}
            </Label>
            <Select value={formValues[campo.id] || ""} onValueChange={(value) => handleChange(campo.id, value)}>
              <SelectTrigger className={errors[campo.id] ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                {campo.opciones?.map((opcion) => (
                  <SelectItem key={opcion} value={opcion}>
                    {opcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[campo.id] && <p className="text-sm text-red-500">{errors[campo.id]}</p>}
          </div>
        )

      case "checkbox":
        return (
          <div className="flex items-start space-x-2 py-2" key={campo.id}>
            <Checkbox
              id={campo.id}
              checked={formValues[campo.id] || false}
              onCheckedChange={(checked) => handleChange(campo.id, checked)}
              className={errors[campo.id] ? "border-red-500" : ""}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={campo.id} className="font-medium">
                {campo.nombre} {campo.requerido && <span className="text-red-500">*</span>}
              </Label>
              {errors[campo.id] && <p className="text-sm text-red-500">{errors[campo.id]}</p>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Renderizar vista previa
  const renderPreview = () => {
    return (
      <div className="space-y-6">
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-semibold mb-2">Información Personal</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secciones.personal.map((campo) => (
              <div key={campo.id}>
                <dt className="text-sm font-medium text-muted-foreground">{campo.nombre}</dt>
                <dd className="text-sm font-semibold">
                  {formValues[campo.id] ? formValues[campo.id].toString() : "No proporcionado"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-semibold mb-2">Información Académica</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secciones.academica.map((campo) => (
              <div key={campo.id}>
                <dt className="text-sm font-medium text-muted-foreground">{campo.nombre}</dt>
                <dd className="text-sm font-semibold">
                  {formValues[campo.id] ? formValues[campo.id].toString() : "No proporcionado"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-semibold mb-2">Información Adicional</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secciones.adicional
              .filter((campo) => campo.tipo !== "checkbox")
              .map((campo) => (
                <div key={campo.id}>
                  <dt className="text-sm font-medium text-muted-foreground">{campo.nombre}</dt>
                  <dd className="text-sm font-semibold">
                    {formValues[campo.id] ? formValues[campo.id].toString() : "No proporcionado"}
                  </dd>
                </div>
              ))}
          </dl>

          <h4 className="font-medium mt-4 mb-2">Preferencias</h4>
          <ul className="space-y-1">
            {secciones.adicional
              .filter((campo) => campo.tipo === "checkbox")
              .map((campo) => (
                <li key={campo.id} className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${formValues[campo.id] ? "text-green-500" : "text-gray-300"}`} />
                  <span className="text-sm">{campo.nombre}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col sm:flex-row bg-gray-100 h-full overflow-y-auto">
        <main className="w-full overflow-y-auto p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex max-md:flex-col gap-2 justify-center items-center items-center mb-6">
              <div className="max-md:flex gap-2">
                <h1 className="text-2xl font-bold">{formulario.nombre}</h1>
                <p className="text-muted-foreground">{formulario.descripcion}</p>
              </div>
              <div className="ml-auto flex gap-2 print:hidden">
                <Button variant="outline" size="sm" onClick={handleSaveProgress}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar progreso
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-3 flex flex-col">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      {formulario.evento?.organizador}
                    </Badge>
                    <Badge variant="secondary">Registro abierto</Badge>
                  </div>
                  <CardTitle className="text-xl">{formulario.evento?.nombre}</CardTitle>
                  <CardDescription>{formulario.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formulario.evento?.fecha}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formulario.evento?.hora}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formulario.evento?.lugar}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Cupos limitados</span>
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
                        {currentSection === "personal" ? "Actual" : ""}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Información Académica</span>
                      <Badge variant={currentSection === "academica" ? "default" : "outline"} className="text-xs">
                        {currentSection === "academica" ? "Actual" : ""}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Información Adicional</span>
                      <Badge variant={currentSection === "adicional" ? "default" : "outline"} className="text-xs">
                        {currentSection === "adicional" ? "Actual" : ""}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Revisión y Envío</span>
                      <Badge variant={showPreview ? "default" : "outline"} className="text-xs">
                        {showPreview ? "Actual" : ""}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8 print:shadow-none">
              <CardHeader className="flex flex-col">
                <CardTitle>{formulario.nombre}</CardTitle>
                <CardDescription>{formulario.descripcion}</CardDescription>
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
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="outline" onClick={handleReset}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Completar otro formulario
                        </Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Descargar comprobante
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    {!showPreview ? (
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
                          {secciones.personal.map(renderField)}
                        </TabsContent>

                        <TabsContent value="academica" className="space-y-4">
                          {secciones.academica.map(renderField)}
                        </TabsContent>

                        <TabsContent value="adicional" className="space-y-4">
                          {secciones.adicional.map(renderField)}
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Vista previa de su registro</h3>
                          <Badge>Revisión final</Badge>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">Verifique su información</h4>
                            <p className="text-sm text-yellow-700">
                              Por favor revise cuidadosamente todos los datos antes de enviar el formulario. Una vez
                              enviado, no podrá modificar la información.
                            </p>
                          </div>
                        </div>

                        {renderPreview()}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between border-t p-6">
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

            <div className="grid grid-cols-1 gap-6 mb-8 print:hidden">
              <Card>
                <CardHeader className="flex flex-col">
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Organizador</h4>
                    <p className="text-sm">{formulario.evento?.organizador}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Correo electrónico</h4>
                    <p className="text-sm">soporte@universidad.edu.co</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Teléfono</h4>
                    <p className="text-sm">+57 (1) 123-4567</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Horario de atención</h4>
                    <p className="text-sm">Lunes a viernes: 8:00 AM - 5:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>

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

