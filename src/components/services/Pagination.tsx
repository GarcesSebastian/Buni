"use client"

import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { TabsEvent } from "@/app/events/[id]/page"

interface PaginationProps {
  type: TabsEvent
  currentPage: number
  totalItems: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
}

export function Pagination({
  type,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / rowsPerPage)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor={`${type}-rows-per-page`} className="whitespace-nowrap">
          Filas por página:
        </Label>
        <Select value={rowsPerPage.toString()} onValueChange={(value) => onRowsPerPageChange(Number.parseInt(value))}>
          <SelectTrigger id={`${type}-rows-per-page`} className="w-[80px]">
            <SelectValue placeholder={rowsPerPage.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {totalItems > 0
            ? `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalItems)} de ${totalItems}`
            : "0 resultados"}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm mx-2">
          Página {currentPage} de {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="flex justify-center items-center"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalItems === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

