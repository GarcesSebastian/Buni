"use client"

import { useEffect, useState } from "react"
import { Loader2, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

interface CountdownProps {
  targetDate: string
  onComplete?: () => void
}

export function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()
      
      if (difference <= 0) {
        onComplete?.()
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    setTimeLeft(calculateTimeLeft())
    setIsLoading(false)

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Preparando el contador...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold">El evento comenzará en:</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg border border-primary/10">
            <span className="text-5xl font-bold text-primary">{timeLeft.days}</span>
            <span className="text-sm font-medium text-muted-foreground">Días</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg border border-primary/10">
            <span className="text-5xl font-bold text-primary">{timeLeft.hours}</span>
            <span className="text-sm font-medium text-muted-foreground">Horas</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg border border-primary/10">
            <span className="text-5xl font-bold text-primary">{timeLeft.minutes}</span>
            <span className="text-sm font-medium text-muted-foreground">Minutos</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg border border-primary/10">
            <span className="text-5xl font-bold text-primary">{timeLeft.seconds}</span>
            <span className="text-sm font-medium text-muted-foreground">Segundos</span>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Fecha de inicio: {new Date(targetDate).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Hora de inicio: {new Date(targetDate).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 