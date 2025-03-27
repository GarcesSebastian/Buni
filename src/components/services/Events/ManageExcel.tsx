"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/Button"
import { FileSpreadsheet, Upload } from "lucide-react"
import * as XLSX from "xlsx"
import { useNotification } from "@/components/ui/Notification"
import { AssistsColumns } from "@/config/Assists"
import { InscriptionsColumns } from "@/config/Inscriptions"

import type { TabsEvent } from "@/app/events/[id]/page"

interface DataImportExportProps {
  type: TabsEvent
  data: any[]
  fileName: string
  onImport: (data: any[]) => void
}

export function DataImportExport({ type, data, fileName, onImport }: DataImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showNotification } = useNotification()

  const exportToExcel = () => {
    if (data.length === 0) {
      showNotification({
        title: "Datos vacíos",
        message: `No hay datos de ${type === "assists" ? "asistencias" : "inscripciones"} para exportar.`,
        type: "error"
      })
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos")

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${fileName}.xlsx`

    document.body.appendChild(link)
    link.click()

    showNotification({
      title: "Datos exportados",
      message: `Datos de ${type === "assists" ? "asistencias" : "inscripciones"} exportados correctamente.`,
      type: "success",
    })

    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
  }

  const importFromExcel = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const requiredKeys = type === "assists"  ? AssistsColumns.map((col) => col.key.toLowerCase()) : InscriptionsColumns.map((col) => col.key.toLowerCase());

        if (jsonData.length === 0) {
          throw new Error("El archivo no contiene datos.");
        }

        const importedKeys = Object.keys(jsonData[0]).map((key) => key.toLowerCase());

        const hasAllRequiredKeys = requiredKeys.every((reqKey) =>
          importedKeys.includes(reqKey)
        );

        if (!hasAllRequiredKeys) {
          showNotification({
            title: "Error en la estructura",
            message: `El archivo no tiene la estructura requerida para ${ type === "assists" ? "asistencias" : "inscripciones" }.`,
            type: "error",
          });
          return;
        }

        const processedData = jsonData.map((item: any, index) => ({
          id: item.id || index + 1,
          ...item,
        }));

        onImport(processedData);
        showNotification({
          title: "Datos importados",
          message: `Datos de ${ type === "assists" ? "asistencias" : "inscripciones" } importados correctamente.`,
          type: "success",
        });
      } catch (error: any) {
        console.error("Error al importar el archivo:", error);
        showNotification({
          title: "Error al importar",
          message: `Ocurrió un error al importar el archivo. Por favor, intenta de nuevo. ${error.message}`,
          type: "error",
        });
      }
    };

    reader.readAsBinaryString(file);
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      importFromExcel(file)
    }
    e.target.value = ""
  }

  return (
    <div className="flex space-x-2">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        Importar Excel
      </Button>
      <Button variant="outline" size="sm" onClick={exportToExcel}>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Exportar a Excel
      </Button>
    </div>
  )
}