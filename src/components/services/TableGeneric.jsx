"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Edit, Filter, MoreVertical, Plus, QrCode, Trash, Eye, Loader } from "lucide-react"
import { CreateEventDialog } from "./Dialogs/Tables/CreateDialog"
import { QRDialog } from "./Dialogs/QRDialog"
import { FilterDialog } from "./Dialogs/Tables/FilterDialog"
import { EditDialog } from "./Dialogs/Tables/EditDialog"
import { DeleteDialog } from "./Dialogs/Tables/DeleteDialog"
import { useUserData } from "@/hooks/auth/useUserData"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"

export function TableGeneric({structure, structureForm, table}) {
  const { user, isLoaded } = useUserData()
  const router = useRouter()
  const [openCreate, setOpenCreate] = useState(false)
  const [openQR, setOpenQR] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [qrType, setQrType] = useState("inscriptions")
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
  const [showPassword, setShowPassword] = useState(false)

  const userTableData = useMemo(() => {
    if (!isLoaded) return [];
    return user[table.key] || [];
  }, [isLoaded, user, table.key]);

  const sortedAndFilteredEvents = useMemo(() => {
    if (!isLoaded) return [];
    
    const filteredEvents = userTableData.filter(
      (event) => {
        return Object.keys(filters).every((key) => {
          const filterKey = key
          if (filters[filterKey] === "") return true
          return event[filterKey]?.toString().toLowerCase().includes(filters[filterKey].toLowerCase())
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
      const valueFormatted = value == "formAssists" || value == "formInscriptions" ? "form" : value
      if(structureForm[value].type == "selection" && user[valueFormatted]){
        const rest = user[valueFormatted].filter(v => v.state == true || v.state == "true").map(s => {
          const name = s.name || s.nombre
          return {
            value: name,
            label: name.charAt(0).toUpperCase() + name.slice(1),
            id: s.id
          }
        })
        structureForm[value].options = rest
      }
    })
  }, [isLoaded, structureForm, user]);

  if(!isLoaded){
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full">
        <Loader className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    )
  }

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
    if(typeof data[value] != "object"){
      if (value === "cupos" && data[value] === "-1") {
        return "Ilimitado"
      }

      if (value === "password") {
        return (
          <div className="flex flex-row gap-2">
            <Input 
              disabled 
              type={showPassword ? "text" : "password"} 
              className="w-full border-none" 
              value={data[value]} 
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

      return data[value]
    }

    const DataEvent = data[value]

    if(!DataEvent || !DataEvent.key){
      return data[value]
    }

    const dataFind = user[DataEvent.key]?.find((f) => f.id === Number(DataEvent.id))
    return dataFind?.name || dataFind?.nombre
  }

  const handleViewData = (data) => {
    router.push(`/${table.key}/${data.id}`)
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
              {structure.filter((value) => value.key !== "id").map((value) => (
                <TableHead key={value.key} className="whitespace-nowrap">
                    <div className="w-full" style={{ display: "table" }}>
                      <span className="p-1" style={{ display: "table-cell", verticalAlign: "middle" }}>
                        {value.value}
                      </span>

                      {value.filter && (
                        <span style={{ display: "table-cell", verticalAlign: "middle", textAlign: "right", width: "1%"}}>
                          <Button variant="ghost" onClick={() => setOpenFilter(value.key)} className="hover:bg-transparent !p-1 !h-fit align-middle">
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
                          table.isView && (
                            <>
                              <DropdownMenuItem onClick={() => handleViewData(data)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Evento
                              </DropdownMenuItem>
                            </>
                          )
                        }
                        {
                          table.isQR && (
                            <>
                              <DropdownMenuItem onClick={() => handleQRClick(data, "inscriptions")}>
                                <QrCode className="mr-2 h-4 w-4" />
                                QR Inscripción
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleQRClick(data, "assists")}>
                                <QrCode className="mr-2 h-4 w-4" />
                                QR Asistencia
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-800" onClick={() => {
                               router.push(`forms/assists/${data.id}`)
                              }}>
                                Prueba de Asistencia
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-800" onClick={() => {
                               router.push(`forms/inscriptions/${data.id}`)
                              }}>
                                Prueba de Inscripcion
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