"use client"

import { useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Event } from "@/types/Events"

interface QRDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event
  type: "inscripcion" | "asistencia"
}

export function QRDialog({ open, onOpenChange, event, type }: QRDialogProps) {
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  const qrUrl = `${window.location.origin}/forms?id=${event.id}`

  const handleDownload = () => {
    if (qrRef.current) {
      const canvas = qrRef.current
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `qr-${event.nombre}-${type}.png`
      downloadLink.href = pngFile
      downloadLink.click()
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
          <QRCodeCanvas value={qrUrl} size={200} ref={qrRef} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90">
            Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
