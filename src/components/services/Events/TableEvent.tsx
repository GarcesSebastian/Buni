"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Filter } from "lucide-react"
import { FilterDialog } from "./FilterEvent"
import { Pagination } from "@/components/services/Pagination"

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
  onFilter: (column: string, value: string | string[]) => void
  onClearFilters: () => void
  hasActiveFilters?: boolean
  form?: Form
}

export function DataTable({
  type,
  data,
  columns,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onFilter,
  onClearFilters,
  hasActiveFilters = false,
  form
}: DataTableProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const paginatedData = data.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage,
  )

  return (
    <div className="space-y-4">
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onClearFilters} className="text-sm">
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
                  {columns.map((column) => (
                    <TableCell key={`cell-${item.id || index}-${column.key}`}>
                      {item[column.key as string]}
                    </TableCell>
                  ))}
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
          totalItems={data.length}
          rowsPerPage={pagination.rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}

      {activeFilter && (
        <FilterDialog
          column={activeFilter}
          onFilter={(value) => {
            onFilter(activeFilter, value)
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

