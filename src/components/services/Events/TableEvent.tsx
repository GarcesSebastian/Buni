"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Filter } from "lucide-react"
import { FilterDialog } from "./FilterEvent"
import { Pagination } from "@/components/services/Pagination"
import { Badge } from "@/components/ui/Badge"

import type { TabsEvent } from "@/app/events/[id]/page"
import { Assists } from "@/types/Events"
import { Form } from "@/types/Forms"

interface DataTableProps {
  type: TabsEvent
  data: Assists[]
  columns: {[key: string]: string | number | boolean}[]
  pagination: Record<string, number>
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
  onClearFilters: () => void
  form?: Form
}

export function DataTable({
  type,
  data,
  columns,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onClearFilters,
  form
}: DataTableProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [assistsFilters, setAssistsFilters] = useState<Record<string, string | string[] | number>>({})
  const [inscriptionsFilters, setInscriptionsFilters] = useState<Record<string, string | string[] | number>>({})

  const filteredData = data.filter((item) => {
    const filters = type === "assists" ? assistsFilters : inscriptionsFilters
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true
      
      const fieldInfo = form?.campos.find(campo => campo.id.split("_")[0] === key)
      const itemValue = item[key]

      if (fieldInfo?.tipo === "seleccion" || 
          fieldInfo?.tipo === "checklist_unico" || 
          fieldInfo?.tipo === "checklist_multiple") {
        return Array.isArray(value) ? 
          (value as string[]).includes(itemValue as string) : 
          itemValue === value
      } else if (fieldInfo?.tipo === "qualification") {
        return Array.isArray(value) ? 
          (value as string[]).includes(itemValue?.toString() || "0") : 
          itemValue?.toString() === value
      } else if (fieldInfo?.tipo === "checkbox") {
        const itemValueStr = itemValue?.toString() === "1" ? "true" : "false"
        return itemValueStr === value
      } else if (fieldInfo?.tipo === "numero") {
        return Number(itemValue) === Number(value)
      } else if (fieldInfo?.tipo === "checklist_unico_grid" || fieldInfo?.tipo === "checklist_multiple_grid") {
        if (!itemValue || typeof itemValue !== "object") return false
        
        const rowKey = `${fieldInfo.id}-${value}`
        const gridValue = itemValue as Record<string, string | string[]>
        
        if (fieldInfo.tipo === "checklist_unico_grid") {
          return gridValue[rowKey] === value
        } else {
          return Array.isArray(gridValue[rowKey]) && gridValue[rowKey].includes(value as string)
        }
      } else {
        return itemValue?.toString().toLowerCase().includes(value.toString().toLowerCase())
      }
    })
  })

  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage,
  )

  const handleFilter = (column: string, value: string | string[] | number) => {
    if (type === "assists") {
      setAssistsFilters(prev => ({
        ...prev,
        [column]: value
      }))
    } else {
      setInscriptionsFilters(prev => ({
        ...prev,
        [column]: value
      }))
    }
  }

  const handleClearFilters = () => {
    if (type === "assists") {
      setAssistsFilters({})
    } else {
      setInscriptionsFilters({})
    }
    onClearFilters()
  }

  const renderCellValue = (
    value: string | number | Record<string, string | string[]> | undefined,
    fieldInfo?: { id: string; tipo: string; opciones?: (string | { row: string; data: string[] })[] }
  ): React.ReactNode => {
    if (!fieldInfo) return typeof value === "object" ? JSON.stringify(value) : value?.toString() || "-"
    
    if (fieldInfo?.tipo === "checkbox") {
      const isChecked = value?.toString() === "1"
      return (
        <Badge variant={isChecked ? "default" : "secondary"}>
          {isChecked ? "Sí" : "No"}
        </Badge>
      )
    } else if (fieldInfo?.tipo === "checklist_unico_grid" || fieldInfo?.tipo === "checklist_multiple_grid") {
      if (!value) return "-"
      
      const gridData = fieldInfo.opciones?.map((row: string | { row: string; data: string[] }) => {
        if (typeof row === 'object') {
          const rowValue = (value as Record<string, string | string[]>)[`${fieldInfo.id}-${row.row}`]
          if (!rowValue) return null
          
          if (fieldInfo.tipo === "checklist_unico_grid") {
            return `${row.row}: ${rowValue}`
          } else {
            return `${row.row}: ${Array.isArray(rowValue) ? rowValue.join(", ") : rowValue}`
          }
        }
        return null
      }).filter((item): item is string => item !== null)

      return (
        <div className="space-y-1">
          {gridData?.map((item, index) => (
            <div key={index} className="text-sm">
              {item}
            </div>
          ))}
        </div>
      )
    }
    
    return typeof value === "object" ? JSON.stringify(value) : value?.toString() || "-"
  }

  return (
    <div className="space-y-4">
      {(Object.keys(assistsFilters).length > 0 || Object.keys(inscriptionsFilters).length > 0) && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleClearFilters} className="text-sm">
            <Filter className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={`header-${column.key}`} className="whitespace-nowrap">
                  <span className="p-1" style={{ display: "table-cell", verticalAlign: "middle" }}>
                    {column.label}
                  </span>
                  
                  {column.filterable && (
                    <span style={{ display: "table-cell", verticalAlign: "middle", textAlign: "right", width: "1%"}}>
                      <Button variant="ghost" onClick={() => setActiveFilter(column.key as string)} className="hover:bg-transparent !p-1 !h-fit align-middle">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={`row-${item.id || index}`}>
                  {columns.map((column) => {
                    const fieldInfo = form?.campos.find(campo => campo.id.split("_")[0] === column.key)
                    return (
                      <TableCell key={`cell-${item.id || index}-${column.key}`}>
                        {renderCellValue(item[column.key as string], fieldInfo)}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-muted-foreground mb-2">No se encontraron datos</p>
                    <p className="text-xs text-muted-foreground">
                      {type === "assists"
                        ? "No hay registros de asistencia para este evento"
                        : "No hay inscripciones registradas para este evento"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > 0 && (
        <Pagination
          type={type}
          currentPage={pagination.currentPage}
          totalItems={filteredData.length}
          rowsPerPage={pagination.rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}

      {activeFilter && (
        <FilterDialog
          column={activeFilter}
          onFilter={(value) => {
            handleFilter(activeFilter, value)
            setActiveFilter(null)
          }}
          onClose={() => setActiveFilter(null)}
          open={activeFilter !== null}
          form={form}
        />
      )}
    </div>
  )
}

