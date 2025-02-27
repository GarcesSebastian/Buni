"use client"

import QRCode from "../Icons/QRCode"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import type { Event } from "@/types/Events"

interface QRDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event
  type: "inscripcion" | "asistencia"
}

export function QRDialog({ open, onOpenChange, event, type }: QRDialogProps) {
  const handleDownload = () => {
    const svg = document.getElementById("qr-code")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `qr-${event.nombre}-${type}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Código QR - {type === "inscripcion" ? "Inscripción" : "Asistencia"}</DialogTitle>
          <DialogDescription>
            {type === "inscripcion"
              ? "Use este código QR para que los participantes se inscriban al evento"
              : "Use este código QR para registrar la asistencia de los participantes"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <QRCode id="qr-code"/>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={handleDownload} className="bg-[#DC2626] hover:bg-[#DC2626]/90">
            Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

