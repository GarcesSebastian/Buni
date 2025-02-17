"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Filter, MoreVertical, Plus, QrCode } from "lucide-react"
import { CreateEventDialog } from "./CreateDialog"
import { QRDialog } from "./QRDialog"
import { FilterDialog } from "./FilterDialog"

type SortConfig = {
  key: string
  direction: "asc" | "desc"
} | null

export function TableGeneric({structure, data, setData}) {
  const [openCreate, setOpenCreate] = useState(false)
  const [openQR, setOpenQR] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [qrType, setQrType] = useState<"inscripcion" | "asistencia">("inscripcion")
  const [filters, setFilters] = useState({
    nombre: "",
    organizador: "",
  })
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  const sortedAndFilteredEvents = useMemo(() => {
    const filteredEvents = data.filter(
      (event) =>
        event.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
        event.organizador.toLowerCase().includes(filters.organizador.toLowerCase()),
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
  }, [data, filters, sortConfig])

  const handleCreateRow = (newRow: Omit<never, "id">) => {
    const event = {
      ...newRow,
      id: data.length + 1,
      state: true,
    }
    setData([...data, event])
    setOpenCreate(false)
  }

  const handleQRClick = (event: Event, type: "inscripcion" | "asistencia") => {
    setSelectedEvent(event)
    setQrType(type)
    setOpenQR(true)
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
              {Object.keys(structure).map((value) => (
                <TableHead key={value}>
                  {structure[value]}
                  <Button variant="ghost" onClick={() => setOpenFilter("nombre")} className="ml-2 hover:bg-transparent">
                    <Filter className="h-4 w-4" />
                  </Button>
                </TableHead>
              ))}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredEvents.length == 0 ? (
              <TableRow>
                <TableCell colSpan={Object.keys(structure).length + 2} className="text-center">
                  No se encontraron datos
                </TableCell>
              </TableRow>
            ): (
              sortedAndFilteredEvents.map((data, index) => (
                <TableRow key={index + data.id}>
                <TableCell key={index + data.id}>{index + 1}</TableCell>
                  {Object.keys(data).map((value) => (
                    structure[value] && (
                      value == "state" ? (
                        <TableCell>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    data[value] ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                                {data[value] ? "Activo" : "No activo"}
                            </span>
                        </TableCell>
                      ) : (
                        <TableCell key={data[value]}>{data[value]}</TableCell>
                      )
                    )
                  ))}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-fit w-fit p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreVertical className="h-4 w-4 p-0"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleQRClick(data, "inscripcion")}>
                            <QrCode className="mr-2 h-4 w-4" />
                            QR Inscripción
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleQRClick(data, "asistencia")}>
                            <QrCode className="mr-2 h-4 w-4" />
                            QR Asistencia
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                </TableRow>
              ))
            )
          }
          </TableBody>
        </Table>
      </div>

      <CreateEventDialog open={openCreate} onOpenChange={setOpenCreate} onSubmit={handleCreateRow} />

      {selectedEvent && <QRDialog open={openQR} onOpenChange={setOpenQR} event={selectedEvent} type={qrType} />}

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

