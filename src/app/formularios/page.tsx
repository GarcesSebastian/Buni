"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
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
import CreateDialog from "@/components/services/Dialogs/Forms/CreateDialog"

import { Plus, MoreVertical, Save, Edit, Check, X, Trash2, GripVertical } from "lucide-react"
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
import { useUserData } from "@/hooks/auth/useUserData"
import { configField } from "@/config/Forms"
import type { Form, FormField } from "@/types/Forms"
import { useWebSocket } from "@/hooks/server/useWebSocket"

interface SorteableFieldProps {
  campo: FormField,
  onDelete: (id: string) => void,
  onEdit: (id: string) => void
}

function SortableCampo({ campo, onDelete, onEdit }: SorteableFieldProps) {
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
      <div className="flex items-center gap-3 max-sm:gap-2">
        <div
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing max-sm:hidden"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium max-sm:text-sm">{campo.nombre}</p>
          <p className="text-sm text-muted-foreground max-sm:text-xs">
            Tipo: {configField.find((t) => t.id === campo.tipo)?.nombre || campo.tipo}
            {campo.requerido && " (Requerido)"}
          </p>
          <span className="flex items-center gap-2 max-[350px]:hidden">
            {campo.opciones && <p className="text-xs text-muted-foreground max-sm:text-xs">Opciones: {campo.opciones.join(", ")}</p>}
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 max-sm:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(campo.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(campo.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center items-center sm:hidden w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5 flex justify-center items-center hover:bg-muted">
              <span className="sr-only">Abrir menú</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(campo.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(campo.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default function FormulariosPage() {
  const {user, setUser} = useUserData();
  const { sendMessage } = useWebSocket()
  const [currentForm, setCurrentForm] = useState<Form | null>(null)
  const [dialogAddField, setDialogAddField] = useState<boolean>(false)
  const [editingField, setEditingField] = useState<FormField | undefined>(undefined)
  const [personalSection, setPersonalSection] = useState<FormField[]>([])
  const [academySection, setAcademySection] = useState<FormField[]>([])
  const [aditionalSection, setAditionalSection] = useState<FormField[]>([])
  const [error, setError] = useState<string>("")

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

    if (over && active.id !== over.id && currentForm) {
      const oldIndex = currentForm.campos.findIndex((campo) => campo.id === active.id)
      const newIndex = currentForm.campos.findIndex((campo) => campo.id === over.id)

      const newCampos = arrayMove(currentForm.campos, oldIndex, newIndex)

      setCurrentForm({
        ...currentForm,
        campos: newCampos,
      })
    }
  }

  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
  }

  const createForm = () => {
    const nombreFormulario = "Nuevo Formulario " + (user.form.length + 1)
    
    const formExists = user.form.some(
      form => normalizeString(form.name) === normalizeString(nombreFormulario)
    )

    if (formExists) {
      setError("Ya existe un formulario con este nombre")
      return
    }

    const nuevoFormulario: Form = {
      id: Date.now(),
      name: nombreFormulario,
      descripcion: "Descripción del formulario",
      campos: [],
      state: false,
    }

    const newData = {
      ...user,
      form: [...user.form, nuevoFormulario]
    }
    
    setUser(newData)
    setCurrentForm({ ...nuevoFormulario })
    sendMessage("UPDATE_DATA", {users: newData})
    setError("")
  }

  const editForm = (formulario: Form) => {
    setCurrentForm({ ...formulario })
  }

  const deleteForm = (id: number) => {
    const newData = {
      ...user,
      form: user.form.filter((f) => f.id !== id)
    }
    setUser(newData)

    if (currentForm?.id === id) {
      setCurrentForm(null)
    }

    sendMessage("UPDATE_DATA", {users: newData})
  }

  const updateForm = () => {
    if (!currentForm) return

    const formExists = user.form.some(
      form => form.id !== currentForm.id && 
      normalizeString(form.name) === normalizeString(currentForm.name)
    )

    if (formExists) {
      setError("Ya existe un formulario con este nombre")
      return
    }

    const newData = {
      ...user,
      form: user.form.map((f) => (f.id === currentForm.id ? currentForm : f))
    }

    setUser(newData)
    setCurrentForm(null)
    sendMessage("UPDATE_DATA", {users: newData})
    setError("")
  }

  const deleteField = (campoId: string) => {
    if (!currentForm) return

    setCurrentForm({
      ...currentForm,
      campos: currentForm.campos.filter((c) => c.id !== campoId),
    })
  }

  const editField = (campoId: string) => {
    if (!currentForm) return

    const campo = currentForm.campos.find((c) => c.id === campoId)
    if (!campo) return

    setEditingField(campo)
    setDialogAddField(true)
  }

  const toggleStateForm = (id: number) => {
    const newData = {
      ...user,
      form: user.form.map((f) => (f.id === id ? { ...f, state: !f.state } : f))
    }

    setUser(newData)
    sendMessage("UPDATE_DATA", {users: newData})
  }

  useEffect(() => {
    if (currentForm) {
      setPersonalSection(currentForm.campos.filter((c) => c.seccion === "personal"))
      setAcademySection(currentForm.campos.filter((c) => c.seccion === "academica"))
      setAditionalSection(currentForm.campos.filter((c) => c.seccion === "adicional"))
    }
  }, [currentForm])

  return (
    <div className="flex h-full flex-col">
        <Section>
          <div className="space-y-6 p-4 shadow-lg shadow-black/5 rounded-lg bg-white">
            <div className="flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-2">
              <h1 className="text-2xl font-bold">Formularios</h1>
              <div className="flex flex-col items-end gap-2">
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button onClick={createForm} className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Formulario
                </Button>
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
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
                      {user.form.map((formulario) => (
                        <TableRow key={formulario.id}>
                          <TableCell>{formulario.name}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                formulario.state ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {formulario.state ? "Activo" : "Inactivo"}
                            </span>
                          </TableCell>
                          <TableCell>{formulario.campos.length}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 flex justify-center items-center hover:bg-muted">
                                    <span className="sr-only">Abrir menú</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => editForm(formulario)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleStateForm(formulario.id)}>
                                    {formulario.state ? (
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
                                          onClick={() => deleteForm(formulario.id)}
                                          className="bg-primary hover:bg-primary/90"
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
                      {user.form.length === 0 && (
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
                <CardHeader className="flex flex-col p-0">
                  <CardTitle>{currentForm ? `Editar: ${currentForm.name}` : "Detalles del Formulario"}</CardTitle>
                  <CardDescription>
                    {currentForm
                      ? "Modifique los detalles y campos del formulario"
                      : "Seleccione un formulario para editar o cree uno nuevo"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentForm ? (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nombre-formulario">Nombre del Formulario</Label>
                        <Input
                          id="nombre-formulario"
                          value={currentForm.name}
                          onChange={(e) => {
                            setCurrentForm({ ...currentForm, name: e.target.value })
                            setError("")
                          }}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="descripcion-formulario">Descripción</Label>
                        <Input
                          id="descripcion-formulario"
                          value={currentForm.descripcion}
                          onChange={(e) => setCurrentForm({ ...currentForm, descripcion: e.target.value })}
                        />
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-4 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                          <h3 className="font-medium">Campos del Formulario</h3>
                          <Button variant="outline" size="sm" className="max-sm:w-full max-sm:text-xs" onClick={() => setDialogAddField(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Campo
                          </Button>
                        </div>

                        {currentForm.campos.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground mb-3">
                              Arrastra y suelta los campos para reordenarlos. El orden aquí determinará cómo se mostrarán en
                              el formulario.
                            </p>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                              <SortableContext
                                items={currentForm.campos.map((campo) => campo.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="space-y-2 flex flex-col items-start justify-between border p-3 rounded-md bg-white">
                                  <Label className="font-medium">Datos Personales</Label>
                                  {personalSection.length > 0 ? (
                                    personalSection.map((campo) => (
                                      <div key={campo.id} className="w-full">
                                        <SortableCampo campo={campo} onDelete={deleteField} onEdit={editField} />
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No hay campos personales</p>
                                  )}
                                </div>

                                <div className="space-y-2 flex flex-col items-start justify-between border p-3 rounded-md bg-white">
                                  <Label className="font-medium">Datos Académicos</Label>
                                  {academySection.length > 0 ? (
                                    academySection.map((campo) => (
                                      <div key={campo.id} className="w-full">
                                        <SortableCampo campo={campo} onDelete={deleteField} onEdit={editField} />
                                    </div>
                                  ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No hay campos académicos</p>
                                  )}
                                </div>

                                <div className="space-y-2 flex flex-col items-start justify-between border p-3 rounded-md bg-white">
                                  <Label className="font-medium">Datos Adicionales</Label>
                                  {aditionalSection.length > 0 ? (
                                    aditionalSection.map((campo) => (
                                      <div key={campo.id} className="w-full">
                                        <SortableCampo campo={campo} onDelete={deleteField} onEdit={editField} />
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No hay campos adicionales</p>
                                  )}
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

                {currentForm && (
                  <CardFooter className="flex justify-end space-x-2 p-6 pt-0">
                    <Button variant="outline" onClick={() => setCurrentForm(null)}>
                      Cancelar
                    </Button>
                    <Button onClick={updateForm} className="bg-primary hover:bg-primary/90 max-md:text-xs">
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

            <CreateDialog 
              currentForm={currentForm} 
              setCurrentForm={setCurrentForm}
              dialogAddField={dialogAddField}
              setDialogAddField={setDialogAddField}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          </div>
        </Section>
    </div>
  )
}

