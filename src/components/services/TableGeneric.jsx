"use client"

import { useState, useMemo, useEffect } from "react"
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

export function TableGeneric({structure, structureForm, table}) {
  const { user } = useUserData()
  const router = useRouter()
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

  const userTableData = user[table.key];
  const sortedAndFilteredEvents = useMemo(() => {
    const filteredEvents = userTableData.filter(
      (event) => {
        return Object.keys(filters).every((key) => {
          const filterKey = key
          if (filters[filterKey] === "") return true
          return event[filterKey]?.toLowerCase().includes(filters[filterKey].toLowerCase())
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

    return filteredEvents;
  }, [userTableData, filters, sortConfig]);

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

  const normalizeData = (data, value) => {
    const dataFormatted = typeof data[value] === "object" 
      ? (data[value]).value 
      : data[value];
    const dataSplit = typeof dataFormatted === "string" ? dataFormatted.split("_") : []

    if (dataSplit.length <= 1){
      return dataFormatted
    }

    const id = dataSplit[dataSplit.length - 1]
    const dataFind = user[value]?.find((f) => f.id === Number(id))
    return dataFind?.nombre
  }

  useEffect(() => {
    Object.keys(structureForm).forEach(value => {
      if(structureForm[value].type == "selection" && user[value]){
        const rest = user[value].filter(v => v.state == true || v.state == "true").map(s => {
          return {
            value: s.nombre,
            label: s.nombre.charAt(0).toUpperCase() + s.nombre.slice(1),
            id: s.id
          }
        })

        structureForm[value].options = rest
      }
    })
  },[])

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between gap-4 max-md:flex-col">
        <Button onClick={() => setOpenCreate(true)} className="bg-[#DC2626] hover:bg-[#DC2626]/90 w-auto max-md:w-full">
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-auto max-md:w-full">
          <Filter className="mr-2 h-4 w-4" />
          Limpiar Filtros
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              {structure.filter((value) => value.key !== "id").map((value) => (
                <TableHead key={value.key} className="whitespace-nowrap">
                    <div className="w-full" style={{ display: "table" }}>
                      <span style={{ display: "table-cell", verticalAlign: "middle" }}>
                        {value.value}
                      </span>
                      <span
                        style={{
                          display: "table-cell",
                          verticalAlign: "middle",
                          textAlign: "right",
                          width: "1%",
                        }}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => setOpenFilter(value.value)}
                          className="hover:bg-transparent"
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </span>
                    </div>
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
                      structure.find(st => st.key == value) ? (
                        value === "state" ? (
                          <TableCell key={value}>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              data[value] === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {data[value] === "true" ? "Activo" : "No activo"}
                            </span>
                          </TableCell>
                        ) : (
                          <TableCell key={value}>{normalizeData(data, value)}</TableCell>
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

