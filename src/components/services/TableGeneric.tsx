"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Edit, Filter, MoreVertical, Plus, QrCode, Trash } from "lucide-react"
import { CreateEventDialog } from "./Dialogs/Tables/CreateDialog"
import { QRDialog } from "./Dialogs/QRDialog"
import { FilterDialog } from "./Dialogs/Tables/FilterDialog"
import { EditDialog } from "./Dialogs/Tables/EditDialog"
import { DeleteDialog } from "./Dialogs/Tables/DeleteDialog"
import { useUserData } from "@/hooks/useUserData"
import { useRouter } from "next/navigation"
import { ConfigEvent, ConfigEventForm } from "@/types/Events"

interface Props{
  structure: { key: string, value: string }[],
  structureForm: ConfigEventForm,
  table: {
    name: string,
    key: string,
    isQR: boolean
  }
}

interface Filters{
  nombre: string,
  organizador: string,
  aniversario: string,
}

type QRType = "inscripcion" | "asistencia"
type SortDirection = "asc" | "desc"

export function TableGeneric({structure, structureForm, table}: Props) {
  const { user } = useUserData()
  const router = useRouter()
  const [openCreate, setOpenCreate] = useState(false)
  const [openQR, setOpenQR] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ConfigEvent | null>(null)
  const [qrType, setQrType] = useState<QRType>("inscripcion")
  const [filters, setFilters] = useState<Filters>({
    nombre: "",
    organizador: "",
    aniversario: "",
  })
  const [sortConfig, setSortConfig] = useState<{ key: keyof Filters; direction: SortDirection } | null>(null)
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<ConfigEvent | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<ConfigEvent | null>(null)

  const userTableData = user[table.key as keyof typeof user] as (ConfigEvent & Filters)[];
  const sortedAndFilteredEvents = useMemo(() => {
    const filteredEvents = userTableData.filter(
      (event) => {
        return Object.keys(filters).every((key) => {
          const filterKey = key as keyof Filters
          if (filters[filterKey] === "") return true
          return event[filterKey]?.toLowerCase().includes(filters[filterKey].toLowerCase())
        })
      }
    )

    if (sortConfig !== null) {
      filteredEvents.sort((a, b) => {
        if (a[sortConfig.key as keyof Filters] < b[sortConfig.key as keyof Filters]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return filteredEvents;
  }, [userTableData, filters, sortConfig]);

  const handleQRClick = (event: ConfigEvent, type: QRType) => {
    setSelectedEvent(event)
    setQrType(type)
    setOpenQR(true)
  }

  const handleEditClick = (event: ConfigEvent) => {
    setEventToEdit(event)
    setOpenEdit(true)
  }

  const handleDeleteClick = (event: ConfigEvent) => {
    setEventToDelete(event)
    setOpenDelete(true)
  }

  const handleFilter = (column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }))
  }

  const handleSort = (column: string, direction: SortDirection | null) => {
    setSortConfig(direction ? { key: column as keyof Filters, direction } : null)
  }

  const clearFilters = () => {
    setFilters({
      nombre: "",
      organizador: "",
      aniversario: "",
    })
    setSortConfig(null)
  }

  const normalizeData = (data: ConfigEvent, value: string) => {
    console.log(data)
    const dataFormatted = typeof data[value as keyof ConfigEvent] === "object" 
      ? (data[value]).value 
      : data[value as keyof ConfigEvent];
    const dataSplit = typeof dataFormatted === "string" ? dataFormatted.split("_") : []

    if (dataSplit.length <= 1){
      return dataFormatted
    }

    const id = dataSplit[dataSplit.length - 1]
    const dataFind = user[value as keyof typeof user]?.find((f) => f.id === Number(id))
    return dataFind?.nombre
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between gap-4">
        <Button onClick={() => setOpenCreate(true)} className="bg-[#DC2626] hover:bg-[#DC2626]/90 w-fit sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-fit sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Limpiar Filtros
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">N°</TableHead>
              {structure.filter((value) => value.key !== "id").map((value) => (
                <TableHead key={value.key}>
                  {value.value}
                  <Button variant="ghost" onClick={() => setOpenFilter(value.value)} className="ml-2 hover:bg-transparent">
                    <Filter className="h-4 w-4" />
                  </Button>
                </TableHead>
              ))}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={Object.keys(structure).length + 2} className="text-center">
                  No se encontraron datos
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredEvents.map((data, index) => (
                <TableRow key={data.id || index}>
                  <TableCell>{data.id}</TableCell>
                  {Object.keys(data)
                    .filter((key) => key !== "id")
                    .map((value) =>
                      structure[value as keyof typeof structure] ? (
                        value === "state" ? (
                          <TableCell key={value}>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              data[value] === true ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {data[value] === true ? "Activo" : "No activo"}
                            </span>
                          </TableCell>
                        ) : (
                          <TableCell key={value}>{String(normalizeData(data, value))}</TableCell>
                        )
                      ) : null
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-fit w-fit p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreVertical className="h-4 w-4 p-0"/>
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
                        {
                          table.isQR && (
                            <>
                              <DropdownMenuItem onClick={() => handleQRClick(data, "inscripcion")}>
                                <QrCode className="mr-2 h-4 w-4" />
                                QR Inscripción
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleQRClick(data, "asistencia")}>
                                <QrCode className="mr-2 h-4 w-4" />
                                QR Asistencia
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-800" onClick={() => {
                               router.push("/forms?id=" + data.id)
                              }}>
                                Prueba de Direccion
                              </DropdownMenuItem>
                            </>
                          )
                        }
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
        data = {{table: table, structureForm: structureForm}}
        open={openCreate} 
        onOpenChange={setOpenCreate} 
      />

      {selectedEvent && <QRDialog open={openQR} onOpenChange={setOpenQR} event={selectedEvent} type={qrType} />}

      {eventToDelete && (
        <DeleteDialog
          data={{ table: table, structureForm: structureForm }}
          open={openDelete}
          onOpenChange={setOpenDelete}
          initialData={eventToDelete}
        />
      )}

      {eventToEdit && (
        <EditDialog
          data={{ table: table, structureForm: structureForm }}
          open={openEdit}
          onOpenChange={setOpenEdit}
          initialData={eventToEdit}
        />
      )}

      <FilterDialog
        open={openFilter !== null}
        onOpenChange={() => setOpenFilter(null)}
        column={openFilter}
        onFilter={(value) => {
          if (openFilter) {
            handleFilter(openFilter, value)
          }
          setOpenFilter(null)
        }}
        onSort={(direction) => {
          if (openFilter) {
            handleSort(openFilter, direction)
          }
          setOpenFilter(null)
        }}
      />
    </div>
  )
}

