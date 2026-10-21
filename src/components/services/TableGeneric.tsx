"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Edit, Filter, MoreVertical, Plus, QrCode, Trash, Eye, Lock } from "lucide-react"
import { CreateEventDialog } from "./Dialogs/Tables/CreateDialog"
import { QRDialog } from "./Dialogs/QRDialog"
import { FilterDialog } from "./Dialogs/Tables/FilterDialog"
import { EditDialog } from "./Dialogs/Tables/EditDialog"
import { DeleteDialog } from "./Dialogs/Tables/DeleteDialog"
import { User, useUserData } from "@/hooks/auth/useUserData"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"
import CustomLoader from "@/components/ui/CustomLoader"
import { DialogRecovery } from "./Dialogs/User/DialogRecovery"
import { apiFetch, ApiError } from "@/lib/api/client"
import { useNotification } from "@/hooks/client/useNotification"
import { User as TableUserType, ConfigUser, ConfigFormUser } from "@/types/User"
import type { Event, ConfigEvent, ConfigEventForm, ConfigScenery, ConfigFormScenery, TableEvent, TableScenery } from "@/types/Events"
import type { ConfigPrograms, ConfigFormPrograms, TablePrograms } from "@/types/Programs"
import type { TableUser } from "@/types/User"
import type { GeneralStructureForm } from "@/types/Table"

type ColumnStructure = ConfigUser | ConfigEvent | ConfigScenery | ConfigPrograms
type StructureForm = ConfigFormUser | ConfigEventForm | ConfigFormScenery | ConfigFormPrograms | GeneralStructureForm
type TableConfig = TableUser | TableEvent | TableScenery | TablePrograms

interface TableGenericProps {
  structure: ColumnStructure[]
  structureForm: StructureForm
  table: TableConfig
}

type Row = Record<string, unknown>

interface SortConfig {
  key: string
  direction: "asc" | "desc"
}

export function TableGeneric({ structure, structureForm: structureFormProp, table: tableProp }: TableGenericProps) {
  // Internal normalized views. The props accept the heterogeneous per-screen config
  // shapes (users/events/scenery/programs); internally we treat the form config as the
  // shared `GeneralStructureForm` and the table config as a superset with the optional flags.
  const structureForm = structureFormProp as unknown as GeneralStructureForm
  const table = tableProp as { name: string; key: string; isQR?: boolean; isView?: boolean; isUser?: boolean }
  const { user, isLoaded } = useUserData()
  const router = useRouter()
  const { showNotification } = useNotification();
  const [mounted, setMounted] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [openQR, setOpenQR] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Row | null>(null)
  const [qrType, setQrType] = useState<"inscriptions" | "assists">("inscriptions")
  const [filters, setFilters] = useState<Record<string, string>>({
    nombre: "",
    organizador: "",
    aniversario: "",
  })
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<Row | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Row | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [sendedCode, setSendedCode] = useState(false)
  const [openRecovery, setOpenRecovery] = useState(false)
  const [eventToRecovery, setEventToRecovery] = useState<Row | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const userTableData = useMemo<Row[]>(() => {
    if (!isLoaded) return [];
    return (user[table.key as keyof User] as unknown as Row[]) || [];
  }, [isLoaded, user, table.key]);

  const sortedAndFilteredEvents = useMemo<Row[]>(() => {
    if (!isLoaded) return [];

    const filteredEvents = userTableData.filter(
      (event) => {
        return Object.keys(filters).every((key) => {
          const filterKey = key
          if (filters[filterKey] === "") return true
          const cell = event[filterKey]
          return cell?.toString().toLowerCase().includes((filters[filterKey] ?? "").toLowerCase())
        })
      }
    )

    if (sortConfig !== null) {
      filteredEvents.sort((a, b) => {
        if (Number(a[sortConfig.key]) < Number(b[sortConfig.key])) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (Number(a[sortConfig.key]) > Number(b[sortConfig.key])) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return filteredEvents;
  }, [userTableData, filters, sortConfig, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    Object.keys(structureForm).forEach(value => {
      const valueFormatted = value == "formAssists" || value == "formInscriptions" ? "forms" : value
      const field = structureForm[value]
      const dataList = user[valueFormatted as keyof User]
      if (field && field.type == "select" && Array.isArray(dataList)) {
        const rest = (dataList as Array<{ state?: unknown; name?: string; nombre?: string; id: string }>)
          .filter(v => v.state == true || v.state == "true")
          .map(s => {
            const name = (s.name || s.nombre) as string
            return {
              value: name,
              label: name.charAt(0).toUpperCase() + name.slice(1),
              id: s.id
            }
          })
        ;(field as { options?: { value: string; label: string; id?: number }[] }).options = rest as unknown as { value: string; label: string; id?: number }[]
      }
    })
  }, [isLoaded, structureForm, user]);

  if (!mounted || !isLoaded) {
    return (
      <CustomLoader />
    )
  }

  const handleQRClick = (event: Row, type: "inscriptions" | "assists") => {
    setSelectedEvent(event)
    setQrType(type)
    setOpenQR(true)
  }

  const handleEditClick = (event: Row) => {
    setEventToEdit(event)
    setOpenEdit(true)
  }

  const handleDeleteClick = (event: Row) => {
    setEventToDelete(event)
    setOpenDelete(true)
  }

  const handleFilter = (column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }))
  }

  const handleSort = (column: string, direction: "asc" | "desc" | null) => {
    setSortConfig(direction ? { key: column, direction } : null)
  }

  const clearFilters = () => {
    setFilters({
      nombre: "",
      organizador: "",
      aniversario: "",
    })
    setSortConfig(null)
  }

  const normalizeData = (data: Row, value: string) => {
    if (typeof data[value] != "object") {
      if (value === "cupos" && data[value] === "-1") {
        return "Ilimitado"
      }

      if (value === "state") {
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${data[value] === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
            {data[value] === "true" ? "Activo" : "Inactivo"}
          </span>
        );
      }

      if (value === "password") {
        return (
          <div className="flex flex-row gap-2">
            <Input
              disabled
              type={showPassword ? "text" : "password"}
              className="w-full border-none"
              value={data[value] as string}
              style={{
                cursor: 'default',
                color: 'var(--foreground)',
                WebkitTextFillColor: 'var(--foreground)',
                opacity: 1
              }}
            />
            <Button variant="ghost" className="h-fit w-fit p-0" onClick={() => setShowPassword(!showPassword)}>
              <Eye className="h-4 w-4 p-0" />
            </Button>
          </div>
        )
      }

      if (value === "horarioInicio" || value === "horarioFin") {
        return new Date(data[value] as string).toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      }

      return data[value] as React.ReactNode
    }

    const DataEvent = data[value] as { key?: string; id?: string } | null

    if (!DataEvent || !DataEvent.key) {
      return data[value] as React.ReactNode
    }

    const dataList = user[DataEvent.key as keyof User]
    const dataFind = Array.isArray(dataList)
      ? (dataList as Array<{ id: string; name?: string; nombre?: string }>).find((f) => f.id === DataEvent.id)
      : undefined
    return dataFind?.name || dataFind?.nombre
  }

  const handleViewData = (data: Row) => {
    router.push(`/${table.key}/${data.id}`)
  }

  const handleRecoverPassword = async (data: Row) => {
    setOpenRecovery(true)
    setEventToRecovery(data)

    try {
      await apiFetch<unknown>(`/users/${data.id}/recovery`, {
        method: "POST",
      })

      setSendedCode(true)
    } catch (error) {
      console.error(error)
      setOpenRecovery(false)

      const message = error instanceof ApiError
        ? ((error.body as { error?: string } | null)?.error || "Error al enviar el código de recuperación")
        : (error instanceof Error ? error.message : "Error al enviar el código de recuperación")

      showNotification({
        title: "",
        type: "error",
        message
      })
    }

  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between gap-4 max-md:flex-col">
        <Button onClick={() => setOpenCreate(true)} className="bg-primary hover:bg-primary/90 w-auto max-md:w-full">
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-auto max-md:w-full">
          <Filter className="mr-2 h-4 w-4" />
          Limpiar Filtros
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              {structure.filter(column => column.key !== "id").map((column) => (
                <TableHead key={column.key} className="whitespace-nowrap">
                  <div className="w-full" style={{ display: "table" }}>
                    <span className="p-1" style={{ display: "table-cell", verticalAlign: "middle" }}>
                      {column.value}
                    </span>

                    {column.filter && (
                      <span style={{ display: "table-cell", verticalAlign: "middle", textAlign: "right", width: "1%" }}>
                        <Button variant="ghost" onClick={() => setOpenFilter(column.key)} className="hover:bg-transparent !p-1 !h-fit align-middle">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={structure.length + 1} className="text-center">
                  No se encontraron datos
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredEvents.map((data, index) => (
                <TableRow key={(data.id as string) || index}>
                  <TableCell>{index + 1}</TableCell>
                  {structure.map((column) => {
                    if (column.key === "id") return null;
                    return (
                      <TableCell key={`${column.key}_${index}`}>
                        {normalizeData(data, column.key)}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-fit w-fit p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreVertical className="h-4 w-4 p-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-green-800" onClick={() => handleEditClick(data)}>
                          <Edit className="mr-2 h-4 w-4 text-green-800" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-800" onClick={() => handleDeleteClick(data)}>
                          <Trash className="mr-2 h-4 w-4 text-red-800" />
                          Eliminar
                        </DropdownMenuItem>
                        {table.isView && (
                          <DropdownMenuItem onClick={() => handleViewData(data)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Evento
                          </DropdownMenuItem>
                        )}
                        {table.isQR && (
                          <>
                            <DropdownMenuItem onClick={() => handleQRClick(data, "inscriptions")}>
                              <QrCode className="mr-2 h-4 w-4" />
                              QR Inscripción
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleQRClick(data, "assists")}>
                              <QrCode className="mr-2 h-4 w-4" />
                              QR Asistencia
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-green-800" onClick={() => router.push(`forms/assists/${data.id}`)}>
                              Registro de Asistencia (Debug)
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-green-800" onClick={() => router.push(`forms/inscriptions/${data.id}`)}>
                              Registro de Inscripcion (Debug)
                            </DropdownMenuItem>
                          </>
                        )}
                        {table.isUser && (
                          <>
                            <DropdownMenuItem onClick={() => handleRecoverPassword(data)}>
                              <Lock className="mr-2 h-4 w-4" />
                              Recuperar contraseña
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateEventDialog
        data={{ table: table, structureForm: structureForm }}
        open={openCreate}
        onOpenChange={setOpenCreate}
      />

      {selectedEvent && <QRDialog open={openQR} onOpenChange={setOpenQR} event={selectedEvent as unknown as Event} type={qrType} />}

      {eventToDelete && (
        <DeleteDialog
          data={{ table: table, structureForm: structureForm }}
          open={openDelete}
          onOpenChange={setOpenDelete}
          initialData={eventToDelete as Record<string, string>}
        />
      )}

      {eventToEdit && (
        <EditDialog
          data={{ table: table, structureForm: structureForm }}
          open={openEdit}
          onOpenChange={setOpenEdit}
          initialData={eventToEdit as Record<string, string>}
        />
      )}

      {openRecovery && (
        <DialogRecovery
          open={openRecovery}
          eventToRecovery={eventToRecovery as unknown as TableUserType}
          sendedCode={sendedCode}
          setSendedCode={setSendedCode}
          onOpenChange={setOpenRecovery}
        />
      )}

      <FilterDialog
        open={openFilter !== null}
        onOpenChange={() => setOpenFilter(null)}
        column={openFilter}
        onFilter={(value: string) => {
          if (openFilter) {
            handleFilter(openFilter, value)
          }
          setOpenFilter(null)
        }}
        onSort={(direction: "asc" | "desc" | null) => {
          if (openFilter) {
            handleSort(openFilter, direction)
          }
          setOpenFilter(null)
        }}
      />
    </div>
  )
}
