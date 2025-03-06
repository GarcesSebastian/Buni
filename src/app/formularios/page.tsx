"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown"
import Section from "@/components/ui/Section"
import { Plus, MoreVertical, Save, Edit, Check, X, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const tiposCampo = [
  { id: "texto", nombre: "Texto" },
  { id: "numero", nombre: "Número" },
  { id: "email", nombre: "Email" },
  { id: "fecha", nombre: "Fecha" },
  { id: "seleccion", nombre: "Selección" },
  { id: "checkbox", nombre: "Casilla de verificación" },
]

interface CampoFormulario {
  id: string
  nombre: string
  tipo: string
  requerido: boolean
  opciones?: string[]
}

interface Formulario {
  id: number
  nombre: string
  descripcion: string
  campos: CampoFormulario[]
  activo: boolean
}

function SortableCampo({ campo, onDelete }: { campo: CampoFormulario; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: campo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border p-3 rounded-md bg-white hover:bg-gray-50 cursor-move"
    >
      <div className="flex items-center gap-3">
        <div
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{campo.nombre}</p>
          <p className="text-sm text-muted-foreground">
            Tipo: {tiposCampo.find((t) => t.id === campo.tipo)?.nombre || campo.tipo}
            {campo.requerido && " (Requerido)"}
          </p>
          {campo.opciones && <p className="text-xs text-muted-foreground">Opciones: {campo.opciones.join(", ")}</p>}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(campo.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function FormulariosPage() {
  const [formularios, setFormularios] = useState<Formulario[]>([
    {
      id: 1,
      nombre: "Registro de Estudiantes",
      descripcion: "Formulario para registrar estudiantes en eventos",
      activo: true,
      campos: [
        { id: "nombre", nombre: "Nombre", tipo: "texto", requerido: true },
        { id: "codigo", nombre: "Código Estudiantil", tipo: "numero", requerido: true },
        {
          id: "escuela",
          nombre: "Escuela",
          tipo: "seleccion",
          requerido: true,
          opciones: ["Sistemas", "Psicología", "Medicina", "Derecho"],
        },
        { id: "email", nombre: "Correo Electrónico", tipo: "email", requerido: true },
      ],
    },
    {
      id: 2,
      nombre: "Registro de Docentes",
      descripcion: "Formulario para registrar docentes en eventos",
      activo: false,
      campos: [
        { id: "nombre", nombre: "Nombre Completo", tipo: "texto", requerido: true },
        {
          id: "facultad",
          nombre: "Facultad",
          tipo: "seleccion",
          requerido: true,
          opciones: ["Ingeniería", "Humanidades", "Ciencias de la Salud", "Derecho"],
        },
        { id: "telefono", nombre: "Teléfono", tipo: "numero", requerido: false },
      ],
    },
  ])

  const [formularioActual, setFormularioActual] = useState<Formulario | null>(null)

  const [nuevoCampo, setNuevoCampo] = useState<CampoFormulario>({
    id: "",
    nombre: "",
    tipo: "texto",
    requerido: false,
  })

  const [opcionesCampo, setOpcionesCampo] = useState<string>("")

  const [mostrarOpciones, setMostrarOpciones] = useState<boolean>(false)

  const [dialogoAgregarCampo, setDialogoAgregarCampo] = useState<boolean>(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id && formularioActual) {
      const oldIndex = formularioActual.campos.findIndex((campo) => campo.id === active.id)
      const newIndex = formularioActual.campos.findIndex((campo) => campo.id === over.id)

      const newCampos = arrayMove(formularioActual.campos, oldIndex, newIndex)

      setFormularioActual({
        ...formularioActual,
        campos: newCampos,
      })
    }
  }

  const moverCampoArriba = (index: number) => {
    if (!formularioActual || index <= 0) return

    const newCampos = [...formularioActual.campos]
    ;[newCampos[index], newCampos[index - 1]] = [newCampos[index - 1], newCampos[index]]

    setFormularioActual({
      ...formularioActual,
      campos: newCampos,
    })
  }

  const moverCampoAbajo = (index: number) => {
    if (!formularioActual || index >= formularioActual.campos.length - 1) return

    const newCampos = [...formularioActual.campos]
    ;[newCampos[index], newCampos[index + 1]] = [newCampos[index + 1], newCampos[index]]

    setFormularioActual({
      ...formularioActual,
      campos: newCampos,
    })
  }

  const crearFormulario = () => {
    const nuevoFormulario: Formulario = {
      id: Date.now(),
      nombre: "Nuevo Formulario",
      descripcion: "Descripción del formulario",
      campos: [],
      activo: false,
    }

    setFormularios([...formularios, nuevoFormulario])
    setFormularioActual({ ...nuevoFormulario })
  }

  const editarFormulario = (formulario: Formulario) => {
    setFormularioActual({ ...formulario })
  }

  const eliminarFormulario = (id: number) => {
    setFormularios(formularios.filter((f) => f.id !== id))
    if (formularioActual?.id === id) {
      setFormularioActual(null)
    }
  }

  const actualizarFormulario = () => {
    if (!formularioActual) return

    setFormularios(formularios.map((f) => (f.id === formularioActual.id ? formularioActual : f)))
    setFormularioActual(null)
  }

  const agregarCampo = () => {
    if (!formularioActual || !nuevoCampo.nombre) return

    // Generar un ID único para el campo
    const campoId = nuevoCampo.nombre.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now()

    // Crear el nuevo campo
    const campo: CampoFormulario = {
      ...nuevoCampo,
      id: campoId,
    }

    // Si es un campo de tipo selección, agregar las opciones
    if (campo.tipo === "seleccion" && opcionesCampo) {
      campo.opciones = opcionesCampo.split(",").map((opt) => opt.trim())
    }

    // Actualizar el formulario actual
    setFormularioActual({
      ...formularioActual,
      campos: [...formularioActual.campos, campo],
    })

    // Resetear el estado del nuevo campo
    setNuevoCampo({
      id: "",
      nombre: "",
      tipo: "texto",
      requerido: false,
    })
    setOpcionesCampo("")
    setMostrarOpciones(false)
    setDialogoAgregarCampo(false)
  }

  const eliminarCampo = (campoId: string) => {
    if (!formularioActual) return

    setFormularioActual({
      ...formularioActual,
      campos: formularioActual.campos.filter((c) => c.id !== campoId),
    })
  }

  const toggleEstadoFormulario = (id: number) => {
    setFormularios(formularios.map((f) => (f.id === id ? { ...f, activo: !f.activo } : f)))
  }

  return (
    <div className="flex h-full flex-col">
        <Section>
          <div className="space-y-6 p-4 shadow-lg shadow-black/5 rounded-lg bg-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Formularios</h1>
              <Button onClick={crearFormulario} className="bg-[#DC2626] hover:bg-[#DC2626]/90">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Formulario
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-col">
                  <CardTitle>Formularios Disponibles</CardTitle>
                  <CardDescription>Formularios que pueden ser utilizados en eventos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Campos</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formularios.map((formulario) => (
                        <TableRow key={formulario.id}>
                          <TableCell>{formulario.nombre}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                formulario.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {formulario.activo ? "Activo" : "Inactivo"}
                            </span>
                          </TableCell>
                          <TableCell>{formulario.campos.length}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-muted">
                                    <span className="sr-only">Abrir menú</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => editarFormulario(formulario)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleEstadoFormulario(formulario.id)}>
                                    {formulario.activo ? (
                                      <>
                                        <X className="mr-2 h-4 w-4" />
                                        Desactivar
                                      </>
                                    ) : (
                                      <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Activar
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta acción no se puede deshacer. Esto eliminará permanentemente el formulario y
                                          todos sus campos asociados.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => eliminarFormulario(formulario.id)}
                                          className="bg-[#DC2626] hover:bg-[#DC2626]/90"
                                        >
                                          Eliminar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {formularios.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            No hay formularios disponibles
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-col">
                  <CardTitle>{formularioActual ? `Editar: ${formularioActual.nombre}` : "Detalles del Formulario"}</CardTitle>
                  <CardDescription>
                    {formularioActual
                      ? "Modifique los detalles y campos del formulario"
                      : "Seleccione un formulario para editar o cree uno nuevo"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formularioActual ? (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nombre-formulario">Nombre del Formulario</Label>
                        <Input
                          id="nombre-formulario"
                          value={formularioActual.nombre}
                          onChange={(e) => setFormularioActual({ ...formularioActual, nombre: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="descripcion-formulario">Descripción</Label>
                        <Input
                          id="descripcion-formulario"
                          value={formularioActual.descripcion}
                          onChange={(e) => setFormularioActual({ ...formularioActual, descripcion: e.target.value })}
                        />
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Campos del Formulario</h3>
                          <Button variant="outline" size="sm" onClick={() => setDialogoAgregarCampo(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Campo
                          </Button>
                        </div>

                        {formularioActual.campos.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground mb-3">
                              Arrastra y suelta los campos para reordenarlos. El orden aquí determinará cómo se mostrarán en
                              el formulario.
                            </p>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                              <SortableContext
                                items={formularioActual.campos.map((campo) => campo.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="space-y-2">
                                  {formularioActual.campos.map((campo, index) => (
                                    <div key={campo.id} className="relative">
                                      <SortableCampo campo={campo} onDelete={eliminarCampo} />
                                      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                          onClick={() => moverCampoArriba(index)}
                                          disabled={index === 0}
                                        >
                                          <ArrowUp className="h-4 w-4" />
                                          <span className="sr-only">Mover arriba</span>
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                          onClick={() => moverCampoAbajo(index)}
                                          disabled={index === formularioActual.campos.length - 1}
                                        >
                                          <ArrowDown className="h-4 w-4" />
                                          <span className="sr-only">Mover abajo</span>
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </SortableContext>
                            </DndContext>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No hay campos definidos</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-muted-foreground">Seleccione un formulario para ver sus detalles</p>
                    </div>
                  )}
                </CardContent>
                {formularioActual && (
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setFormularioActual(null)}>
                      Cancelar
                    </Button>
                    <Button onClick={actualizarFormulario} className="bg-[#DC2626] hover:bg-[#DC2626]/90">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Formulario
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-col">
                <CardTitle>Uso de Formularios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Los formularios creados aquí pueden ser utilizados en diferentes eventos para recopilar información de los
                    participantes. Para utilizar un formulario en un evento, debe estar marcado como &quot;Activo&quot;.
                  </p>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">1. Crear Formulario</h3>
                      <p className="text-sm text-muted-foreground">
                        Defina un nombre, descripción y agregue los campos necesarios para recopilar la información.
                      </p>
                    </div>

                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">2. Activar Formulario</h3>
                      <p className="text-sm text-muted-foreground">
                        Marque el formulario como &quot;Activo&quot; para que esté disponible para su uso en eventos.
                      </p>
                    </div>

                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">3. Usar en Eventos</h3>
                      <p className="text-sm text-muted-foreground">
                        Al crear o editar un evento, seleccione el formulario que desea utilizar para el registro de
                        participantes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Dialog open={dialogoAgregarCampo} onOpenChange={setDialogoAgregarCampo}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Campo</DialogTitle>
                  <DialogDescription>Defina las propiedades del nuevo campo para el formulario</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre-campo">Nombre del Campo</Label>
                    <Input
                      id="nombre-campo"
                      value={nuevoCampo.nombre}
                      onChange={(e) => setNuevoCampo({ ...nuevoCampo, nombre: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tipo-campo">Tipo de Campo</Label>
                    <Select
                      value={nuevoCampo.tipo}
                      onValueChange={(valor) => {
                        setNuevoCampo({ ...nuevoCampo, tipo: valor })
                        setMostrarOpciones(valor === "seleccion")
                      }}
                    >
                      <SelectTrigger id="tipo-campo">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposCampo.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {mostrarOpciones && (
                    <div className="grid gap-2">
                      <Label htmlFor="opciones-campo">Opciones (separadas por comas)</Label>
                      <Input
                        id="opciones-campo"
                        value={opcionesCampo}
                        onChange={(e) => setOpcionesCampo(e.target.value)}
                        placeholder="Opción 1, Opción 2, Opción 3"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="campo-requerido"
                      checked={nuevoCampo.requerido}
                      onChange={(e) => setNuevoCampo({ ...nuevoCampo, requerido: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="campo-requerido">Campo requerido</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNuevoCampo({
                        id: "",
                        nombre: "",
                        tipo: "texto",
                        requerido: false,
                      })
                      setOpcionesCampo("")
                      setMostrarOpciones(false)
                      setDialogoAgregarCampo(false)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={agregarCampo} className="bg-[#DC2626] hover:bg-[#DC2626]/90">
                    Agregar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Section>
    </div>
  )
}

