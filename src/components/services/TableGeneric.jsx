"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Edit, Filter, MoreVertical, Plus, QrCode, Trash } from "lucide-react"
import { CreateEventDialog } from "./Dialogs/CreateDialog"
import { QRDialog } from "./Dialogs/QRDialog"
import { FilterDialog } from "./Dialogs/FilterDialog"
import { EditDialog } from "./Dialogs/EditDialog"
import { DeleteDialog } from "./Dialogs/DeleteDialog"
import { useUserData } from "@/hooks/useUserData"

export function TableGeneric({structure, structureForm, table}) {
  const { user } = useUserData()
  const [openCreate, setOpenCreate] = useState(false)
  const [openQR, setOpenQR] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [qrType, setQrType] = useState("inscripcion")
  const [filters, setFilters] = useState({
    nombre: "",
    organizador: "",
    aniversario: "",
  })
  const [sortConfig, setSortConfig] = useState(null)
  const [openFilter, setOpenFilter] = useState(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [eventToEdit, setEventToEdit] = useState(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  const sortedAndFilteredEvents = useMemo(() => {
    const filteredEvents = user[table.key].filter(
      (event) => {
        return Object.keys(filters).every((key) => {
          if (filters[key] === "") return true
          return event[key].toLowerCase().includes(filters[key].toLowerCase())
        })
      }
    )

    if (sortConfig !== null) {
      filteredEvents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return filteredEvents
  }, [user[table.key], filters, sortConfig])

  const handleQRClick = (event, type) => {
    setSelectedEvent(event)
    setQrType(type)
    setOpenQR(true)
  }

  const handleEditClick = (event) => {
    setEventToEdit(event)
    setOpenEdit(true)
  }

  const handleDeleteClick = (event) => {
    setEventToDelete(event)
    setOpenDelete(true)
  }

  const handleFilter = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }))
  }

  const handleSort = (column, direction) => {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button onClick={() => setOpenCreate(true)} className="bg-[#DC2626] hover:bg-[#DC2626]/90 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Limpiar Filtros
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">N°</TableHead>
              {Object.keys(structure)
              .filter((key) => key !== "id")
              .map((value) => (
                <TableHead key={value}>
                  {structure[value]}
                  <Button variant="ghost" onClick={() => setOpenFilter(value)} className="ml-2 hover:bg-transparent">
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
                      structure[value] ? (
                        value === "state" ? (
                          <TableCell key={value}>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              data[value] == "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {data[value] == "true" ? "Activo" : "No activo"}
                            </span>
                          </TableCell>
                        ) : (
                          <TableCell key={value}>{data[value]}</TableCell>
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

