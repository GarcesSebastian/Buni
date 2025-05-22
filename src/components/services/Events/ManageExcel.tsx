"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/Button"
import { FileSpreadsheet, Upload } from "lucide-react"
import ExcelJS from "exceljs"
import { useNotification } from "@/hooks/client/useNotification"
import { useUserData } from "@/hooks/auth/useUserData"
import { useSocket } from "@/hooks/server/useSocket"
import Cookies from "js-cookie"

import type { TabsEvent } from "@/app/events/[id]/page"
import { Assists } from "@/types/Events"

interface DataImportExportProps {
  type: TabsEvent
  eventId: string,
  data: Assists[]
  columns: Assists[]
  fileName: string
  onImport: (data: Assists[]) => void
}

const getColumLabel = (key: string, columns: Assists[]) => {
  const column = columns.find((col) => col.key === key);
  return column?.label as string;
}

export function DataImportExport({ type, eventId, data: DataTest, columns, fileName, onImport }: DataImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showNotification } = useNotification()
  const { user, setUser } = useUserData()
  const { socket } = useSocket()

  const exportToExcel = async () => {
    if (DataTest.length === 0) {
      showNotification({
        title: "Datos vacíos",
        message: `No hay datos de ${type === "assists" ? "asistencias" : "inscripciones"} para exportar.`,
        type: "error"
      });
      return;
    }
  
    const transformedData: Record<string, string | number | boolean | string[] | unknown>[] = [];
    const headers: Record<string, string>[] = [];
  
    DataTest.forEach((item) => {
      const transformedRow: Record<string, string | number | boolean | unknown> = {};
  
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value);
            if (typeof parsed === "object" && !Array.isArray(parsed)) {
              Object.entries(parsed).forEach(([subKey, subVal]) => {
                transformedRow[`${getColumLabel(key, columns)} [${subKey.split("-")[1]}]`] = Array.isArray(subVal) as boolean
                  ? (subVal as string[]).join(", ")
                  : subVal;
                  headers.push({
                    key: subKey,
                    parentKey: key,
                    data: subVal as unknown as string
                  });
              });
            } else {
              transformedRow[getColumLabel(key, columns)] = value;
              headers.push({
                key: key,
                data: item[key] as unknown as string
              });
            }
          } catch {
            transformedRow[getColumLabel(key, columns)] = value;
            headers.push({
              key: key,
              data: item[key] as unknown as string
            });
          }
        } else {
          transformedRow[getColumLabel(key, columns)] = value;
          headers.push({
            key: key,
            data: item[key] as unknown as string
          });
        }
      });
  
      transformedData.push(transformedRow);
    });
  
    const uniqueKeys = Array.from(
      new Set(transformedData.flatMap(obj => Object.keys(obj)))
    );

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sistema de Eventos';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Datos', {
      pageSetup: { 
        paperSize: 9, 
        orientation: 'landscape',
        margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
      }
    });

    worksheet.columns = uniqueKeys.map(key => {
      const headerLen = key.length;
      const maxCellLen = transformedData.reduce((max, row) => {
        const cell = row[key] != null ? String(row[key]) : "";
        return Math.max(max, cell.length);
      }, 0);
      
      return {
        header: key,
        key: key,
        width: Math.min(Math.max(headerLen, maxCellLen) + 6, 60)
      };
    });

    transformedData.forEach(row => {
      worksheet.addRow(row);
    });

    const headerRow = worksheet.getRow(1);
    headerRow.height = 35;
    
    console.log(headers)
    headerRow.eachCell((cell, colNumber) => {
      const cellData = headers[colNumber - 1]

      const text = `Parent:${cellData.parentKey}\nType:${type}\nData:${cellData.data}\nKey:${cellData.key}\nColumn:${colNumber}`

      console.log(text)
      cell.note = {
        texts: [{
          'font': { 'size': 10, 'name': 'Segoe UI', 'color': { 'argb': 'FF000000' } },
          'text': text
        }]
      };

      cell.fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 45,
        stops: [
          { position: 0, color: { argb: 'FFDE2626' } },
          { position: 1, color: { argb: 'FFDC1A1A' } }
        ]
      };
      
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
        size: 12,
        name: 'Segoe UI'
      };
      
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
      
      cell.border = {
        top: { style: 'medium', color: { argb: 'FFDE2626' } },
        bottom: { style: 'medium', color: { argb: 'FFDE2626' } },
        left: { style: 'medium', color: { argb: 'FFDE2626' } },
        right: { style: 'medium', color: { argb: 'FFDE2626' } }
      };
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      
      row.height = 28;
      
      const isEvenRow = rowNumber % 2 === 0;
      const baseColor = isEvenRow ? 'FFF1F5F9' : 'FFFFFFFF';
      
      row.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: baseColor }
        };
        
        cell.font = {
          size: 10,
          name: 'Segoe UI',
          color: { argb: 'FF021117' }
        };
        
        cell.alignment = {
          vertical: 'middle',
          horizontal: colNumber === 1 ? 'left' : 'center',
          indent: colNumber === 1 ? 2 : 0
        };
        
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

        if (typeof cell.value === 'number' && cell.value > 999) {
          cell.numFmt = '#,##0';
        }
        
        if (cell.value && typeof cell.value === 'string') {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (dateRegex.test(cell.value)) {
            cell.value = new Date(cell.value);
            cell.numFmt = 'dd/mm/yyyy';
          } else {
            const lowerValue = cell.value.toLowerCase();
            if (lowerValue === 'true' || lowerValue === 'false') {
              const booleanValue = lowerValue === 'true' ? 'SÍ' : 'NO';
              cell.value = booleanValue;
              cell.font = {
                ...cell.font,
                bold: true,
                color: { argb: booleanValue === 'SÍ' ? 'FF059669' : 'FFDC2626' }
              };
            } else if (cell.value.includes('@')) {
              cell.font = {
                ...cell.font,
                color: { argb: 'FFDE2626' }
              };
            }
          }
        }
      });
      
      if (rowNumber % 10 === 0) {
        row.eachCell(cell => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEF3C7' }
          };
          cell.border = {
            ...cell.border,
            bottom: { style: 'medium', color: { argb: 'FFDE2626' } }
          };
        });
      }
    });

    const lastColumn = String.fromCharCode(64 + uniqueKeys.length);
    worksheet.autoFilter = `A1:${lastColumn}1`;

    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 1 }
    ];

    const summarySheet = workbook.addWorksheet('Resumen');
    
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = `Resumen de ${type === "assists" ? "Asistencias" : "Inscripciones"}`;
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFDE2626' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFEF2F2' }
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = {
      top: { style: 'medium', color: { argb: 'FFDE2626' } },
      bottom: { style: 'medium', color: { argb: 'FFDE2626' } },
      left: { style: 'medium', color: { argb: 'FFDE2626' } },
      right: { style: 'medium', color: { argb: 'FFDE2626' } }
    };
    
    summarySheet.mergeCells('A1:C1');
    summarySheet.getRow(1).height = 40;

    const summaryData = [
      ['Estadística', 'Valor', 'Porcentaje'],
      ['Total de registros', transformedData.length, '100%'],
      ['Fecha de exportación', new Date().toLocaleDateString('es-ES'), '-'],
      ['Archivo generado por', 'Sistema de Eventos', '-']
    ];

    summaryData.slice(1).forEach((rowData, index) => {
      const row = summarySheet.addRow(rowData);
      row.height = 25;
      
      row.eachCell((cell, colNumber) => {
        if (index === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDE2626' }
          };
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        } else {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: index % 2 === 0 ? 'FFF1F5F9' : 'FFFFFFFF' }
          };
          cell.font = { color: { argb: 'FF021117' } };
        }
        
        cell.alignment = { 
          horizontal: colNumber === 1 ? 'left' : 'center',
          vertical: 'middle'
        };
        
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      });
    });

    summarySheet.columns = [
      { width: 25 },
      { width: 20 },
      { width: 15 }
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.xlsx`;
  
    document.body.appendChild(link);
    link.click();
  
    showNotification({
      title: "Datos exportados",
      message: `Datos de ${type === "assists" ? "asistencias" : "inscripciones"} exportados correctamente.`,
      type: "success",
    });
  
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  const importFromExcel = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = new ExcelJS.Workbook();
        
        workbook.xlsx.load(data as ArrayBuffer).then( async () => {
          const worksheet = workbook.getWorksheet(1);
          if (!worksheet) throw new Error("No se pudo leer la hoja de cálculo.");

          const jsonData: { [key: string]: string }[] = [];
          const headers: string[] = [];
          const headerMetadata: { [key: string]: { key: string } } = {};

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
              row.eachCell((cell) => {
                const headerValue = String(cell.value || '').trim();
                headers.push(headerValue);

                interface newComment extends ExcelJS.Comment {
                  texts: { text: string }[]
                }

                const note: newComment = cell.note as unknown as newComment;
                
                if (note && note.texts && note.texts.length > 0) {
                  const noteText = note.texts[0].text;
                  const metadata: { parentKey: string, type: string, data: string, key: string, column: string } = {
                    parentKey: "",
                    type: "",
                    data: "",
                    key: "",
                    column: ""
                  }

                  const parentKeyMatch = noteText.match(/Parent:\s*([^\n]+)/u);
                  const typeMatch = noteText.match(/Type:\s*([^\n]+)/u);
                  const dataMatch = noteText.match(/Data:\s*([^\n]+)/u);
                  const keyMatch = noteText.match(/Key:\s*([^\n]+)/u);
                  const columnMatch = noteText.match(/Column:\s*([^\n]+)/u);
                  
                  if (parentKeyMatch && typeMatch && dataMatch && keyMatch && columnMatch) {
                    metadata.parentKey = parentKeyMatch[1];
                    metadata.type = typeMatch[1];
                    metadata.data = dataMatch[1];
                    metadata.key = keyMatch[1];
                    metadata.column = columnMatch[1];
                  }

                  headerMetadata[headerValue] = metadata;
                }
              });
            } else {
              const rowData: { [key: string]: string } = {};
              row.eachCell((cell, colNumber) => {
                const header = headers[colNumber - 1];
                if (header) {
                  rowData[header] = String(cell.value || '').trim();
                }
              });
              if (Object.values(rowData).some(val => val !== '')) {
                jsonData.push(rowData);
              }
            }
          });

          interface MetadataItem {
            key: string;
            parentKey: string;
            [key: string]: string; 
          }
          
          const templateData: Assists[] = [];

          function isProbablyDateString(value: unknown): boolean {
            if (typeof value !== 'string') return false;
          
            const datePattern = /\b(19|20)\d\d\b.*\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{1,2})\b/i;
          
            if (!datePattern.test(value)) return false;
          
            const date = new Date(value);
            return !isNaN(date.getTime());
          }

          jsonData.forEach(item => {
            const data: Record<string, string | Record<string, string>> = {};
            Object.keys(headerMetadata).forEach((key) => {
              const metaData = headerMetadata[key] as MetadataItem;

              if(isProbablyDateString(metaData.data)){
                data[metaData.key] = new Date(item[key]).toISOString().split("T")[0];
                return;
              }

              if(metaData.parentKey == "undefined"){
                data[metaData.key] = item[key];
                return;
              }

              const keySplited = metaData.key.split("_")[0]
              if(keySplited == metaData.parentKey){
                if(!data[metaData.parentKey]) data[metaData.parentKey] = {};
                
                const parentValue = data[metaData.parentKey];
                if (typeof parentValue === 'object' && parentValue !== null) {
                  (parentValue as Record<string, string>)[metaData.key] = item[key];
                }
              }
            })

            templateData.push(data as Assists)
          })

          const requiredKeys = columns?.map((col) => {
            const key = col.key;
            return typeof key === 'string' ? key.toLowerCase() : String(key).toLowerCase();
          });

          if (templateData.length === 0) {
            throw new Error("El archivo no contiene datos.");
          }

          const importedKeys = Object.keys(templateData[0]).map((key) => key.toLowerCase());

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

          type MetadataKey<K extends string> = `__metadata_${K}`;

          type ProcessedRow<K extends string> = {
            id: string;
          } & Record<K, string> & Partial<Record<MetadataKey<K>, string>>;

          const processedData = templateData.map((item: Assists, index) => {
            const keys = Object.keys(item) as string[];
            const processedRow: ProcessedRow<string> = {
              id: String(item.id || index + 1),
              ...item,
            };

            keys.forEach(key => {
              if (headerMetadata[key]) {
                processedRow[`__metadata_${key}` as `__metadata_${string}`] = headerMetadata[key].key;
              }
            });

            return processedRow;
          });

          const eventFinded = user.events.find(event => event.id == eventId)
          if(!eventFinded){
            throw new Error("No se encontro el evento")
          }

          if(type === 'assists' || type === 'inscriptions') {
            eventFinded[type] = [...(eventFinded[type] || []), ...templateData]
          }

          const newData = {
            ...user,
            events: user.events.map(event => {
              if(event.id == eventId){
                return eventFinded
              }

              return event
            })
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get("token")}`
            },
            body: JSON.stringify(eventFinded)
          })

          const data_response = await response.json()

          if (!response.ok) {
            throw new Error(data_response.error || "Error al actualizar el usuario")
          }

          setUser(newData)
          socket?.emit("UPDATE_DATA", newData)
          console.log('Datos procesados con metadatos:', processedData);
          
          onImport(processedData);
          showNotification({
            title: "Datos importados",
            message: `Datos de ${ type === "assists" ? "asistencias" : "inscripciones" } importados correctamente con metadatos.`,
            type: "success",
          });
        });
      } catch (error: unknown) {
        console.error("Error al importar el archivo:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        showNotification({
          title: "Error al importar",
          message: `Ocurrió un error al importar el archivo. Por favor, intenta de nuevo. ${errorMessage}`,
          type: "error",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      importFromExcel(file)
    }
    e.target.value = ""
  }

  return (
    <div className="flex space-x-2 max-sm:flex-col max-sm:items-end max-sm:justify-center max-sm:space-y-2 max-sm:w-full">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" ref={fileInputRef} />

      <Button className="w-full" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        Importar Excel
      </Button>

      <Button className="w-full" variant="outline" size="sm" onClick={exportToExcel}>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Exportar a Excel
      </Button>
    </div>
  )
}