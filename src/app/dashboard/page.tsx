"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { 
  Users, 
  Activity, 
  CheckCircle,
  Calendar,
  TrendingUp,
  Trash2,
  Plus,
  Edit,
  ArrowRight,
  LucideIcon
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import Section from "@/components/ui/Section"
import { useUserData } from "@/hooks/auth/useUserData"
import { Progress } from "@/components/ui/Progress"
import { Event } from "@/types/Events"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface MetricCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  subtitle?: string
  isLoading: boolean
}

interface Actividad {
  tipo: 'creacion' | 'eliminacion' | 'edicion',
  entidad: 'evento' | 'escenario' | 'usuario' | 'formulario' | 'programa' | 'rol',
  nombre: string,
  fecha: string,
  usuario: string,
  id?: string,
  ruta?: string
}

interface Estadisticas {
  totalEventos: number,
  totalInscripciones: number,
  totalAsistencias: number,
  tasaAsistencia: number,
  eventosUltimaSemana: number,
  inscripcionesUltimaSemana: number,
  asistenciasUltimaSemana: number
}

const MetricCard = ({ title, value, icon: Icon, subtitle, isLoading }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>

    <CardContent>
      {isLoading ? (
        <div className="flex flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-full bg-muted rounded animate-pulse" />
            <div className="h-6 w-full bg-muted rounded animate-pulse" />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-6 w-full bg-muted rounded animate-pulse" />
            <div className="h-6 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </>
      )}
    </CardContent>
  </Card>
)

const TableLoader = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const getIconoActividad = (tipo: string) => {
  switch (tipo) {
    case 'creacion':
      return <Plus className="h-4 w-4 text-green-500" />
    case 'eliminacion':
      return <Trash2 className="h-4 w-4 text-red-500" />
    case 'edicion':
      return <Edit className="h-4 w-4 text-blue-500" />
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />
  }
}

const defaultEstadisticas: Estadisticas = {
  totalEventos: 0,
  totalInscripciones: 0,
  totalAsistencias: 0,
  tasaAsistencia: 0,
  eventosUltimaSemana: 0,
  inscripcionesUltimaSemana: 0,
  asistenciasUltimaSemana: 0
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUserData()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [eventosRecientes, setEventosRecientes] = useState<Event[]>([])
  const [actividadesRecientes, setActividadesRecientes] = useState<Actividad[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadisticas>(defaultEstadisticas)

  useEffect(() => {
    if (user?.events) {
      const hoy = new Date()
      const hace7Dias = subDays(hoy, 7)
      
      const eventosOrdenados = [...user.events].sort((a, b) => 
        new Date(b.horarioInicio).getTime() - new Date(a.horarioInicio).getTime()
      ).slice(0, 5)

      setEventosRecientes(eventosOrdenados)

      const totalEventos = user.events.length
      const totalInscripciones = user.events.reduce((acc, event) => 
        acc + (event.inscriptions?.length || 0), 0
      )
      const totalAsistencias = user.events.reduce((acc, event) => 
        acc + (event.assists?.length || 0), 0
      )
      const tasaAsistencia = totalInscripciones > 0 
        ? Math.round((totalAsistencias / totalInscripciones) * 100) 
        : 0

      const eventosUltimaSemana = user.events.filter(event => 
        new Date(event.horarioInicio) >= hace7Dias
      )
      const inscripcionesUltimaSemana = eventosUltimaSemana.reduce((acc, event) => 
        acc + (event.inscriptions?.length || 0), 0
      )
      const asistenciasUltimaSemana = eventosUltimaSemana.reduce((acc, event) => 
        acc + (event.assists?.length || 0), 0
      )

      const actividades = [
        ...(user.events?.length > 0 ? user.events.map(event => ({
          tipo: 'creacion' as const,
          entidad: 'evento' as const,
          nombre: event.nombre,
          fecha: event.horarioInicio,
          usuario: event.organizador,
          id: event.id,
          ruta: `/events/${event.id}`
        })) : []),
        ...(user.scenery?.length > 0 ? user.scenery.map(scenery => ({
          tipo: 'creacion' as const,
          entidad: 'escenario' as const,
          nombre: scenery.name,
          fecha: user.events.find(e => e.scenery?.id === scenery.id)?.horarioInicio || new Date().toISOString(),
          usuario: user.events.find(e => e.scenery?.id === scenery.id)?.organizador || 'Sistema',
          id: scenery.id,
          ruta: '/events/scenerys'
        })) : []),
        ...(user.forms?.length > 0 ? user.forms.map(form => ({
          tipo: 'creacion' as const,
          entidad: 'formulario' as const,
          nombre: form.name,
          fecha: user.events.find(e => e.formAssists?.id === form.id || e.formInscriptions?.id === form.id)?.horarioInicio || new Date().toISOString(),
          usuario: user.events.find(e => e.formAssists?.id === form.id || e.formInscriptions?.id === form.id)?.organizador || 'Sistema',
          id: form.id,
          ruta: '/formularios'
        })) : []),
        ...(user.programs?.length > 0 ? user.programs.map(program => ({
          tipo: 'creacion' as const,
          entidad: 'programa' as const,
          nombre: program.name,
          fecha: user.events.find(e => e.programs?.id === program.id)?.horarioInicio || new Date().toISOString(),
          usuario: user.events.find(e => e.programs?.id === program.id)?.organizador || 'Sistema',
          id: program.id,
          ruta: '/programs'
        })) : [])
      ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5)

      setActividadesRecientes(actividades)
      setEstadisticas({
        totalEventos,
        totalInscripciones,
        totalAsistencias,
        tasaAsistencia,
        eventosUltimaSemana: eventosUltimaSemana.length,
        inscripcionesUltimaSemana,
        asistenciasUltimaSemana
      })

      setIsLoading(false)
    }
  }, [user?.events])

  const handleActividadClick = (actividad: typeof actividadesRecientes[0]) => {
    if (actividad.ruta) {
      router.push(actividad.ruta)
    }
  }

  return (
      <Section>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              title="Total Eventos" 
              value={estadisticas.totalEventos} 
              icon={Calendar}
              subtitle={`${estadisticas.eventosUltimaSemana} en la última semana`}
              isLoading={isLoading}
            />

            <MetricCard 
              title="Total Inscripciones" 
              value={estadisticas.totalInscripciones} 
              icon={Users}
              subtitle={`${estadisticas.inscripcionesUltimaSemana} en la última semana`}
              isLoading={isLoading}
            />

            <MetricCard 
              title="Total Asistencias" 
              value={estadisticas.totalAsistencias} 
              icon={CheckCircle}
              subtitle={`${estadisticas.asistenciasUltimaSemana} en la última semana`}
              isLoading={isLoading}
            />

            <MetricCard 
              title="Tasa de Asistencia" 
              value={`${estadisticas.tasaAsistencia}%`} 
              icon={Activity}
              subtitle="Promedio de asistencia"
              isLoading={isLoading}
            />
          </div>

          <div className="grid gap-4 grid-cols-2 max-md:grid-cols-1">
            <Card>
              <CardHeader className="flex flex-col">
                <CardTitle>Eventos Recientes</CardTitle>
                <CardDescription>Últimos 5 eventos registrados</CardDescription>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <TableLoader />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Evento</TableHead>
                        <TableHead className="whitespace-nowrap">Fecha</TableHead>
                        <TableHead className="whitespace-nowrap">Inscritos</TableHead>
                        <TableHead className="whitespace-nowrap">Asistencias</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {eventosRecientes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No hay eventos registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        eventosRecientes.map((evento) => (
                          <TableRow key={evento.id}>
                            <TableCell>{evento.nombre}</TableCell>
                            <TableCell>{format(new Date(evento.horarioInicio), "PPP", { locale: es })}</TableCell>
                            <TableCell>{evento.inscriptions?.length || 0}</TableCell>
                            <TableCell>{evento.assists?.length || 0}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col">
                <CardTitle>Actividades Recientes</CardTitle>
                <CardDescription>Últimas acciones en el sistema</CardDescription>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : actividadesRecientes.length === 0 ? (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    No hay actividades recientes
                  </div>
                ) : (
                  <div className="space-y-4">
                    {actividadesRecientes.map((actividad, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-4 p-2 rounded-lg"
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                          {getIconoActividad(actividad.tipo)}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{actividad.usuario}</span>

                            <span className="text-muted-foreground">
                                {actividad.tipo === 'creacion' ? 'creó' : 
                                actividad.tipo === 'eliminacion' ? 'eliminó' : 'editó'}
                            </span>
                            
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{actividad.nombre}</span>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {format(new Date(actividad.fecha), "PPP", { locale: es })}
                          </p>
                        </div>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0"
                          onClick={() => handleActividadClick(actividad)}
                        >
                          <ArrowRight className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-col">
                <CardTitle>Distribución de Participación</CardTitle>
                <CardDescription>Comparación de inscripciones y asistencias</CardDescription>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex gap-8 items-center justify-center">
                    <div className="h-full w-full bg-muted rounded animate-pulse" />
                    <div className="h-full w-full bg-muted rounded animate-pulse" />
                  </div>
                ) : estadisticas.totalInscripciones === 0 ? (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    No hay datos para mostrar
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Inscripciones", value: estadisticas.totalInscripciones, id: "inscripciones" },
                        { name: "Asistencias", value: estadisticas.totalAsistencias, id: "asistencias" }
                      ]}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Total" key="total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col">
                <CardTitle>Resumen de Participación</CardTitle>
                <CardDescription>Métricas clave de participación</CardDescription>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-2 w-full bg-muted rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : estadisticas.totalInscripciones === 0 ? (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    No hay datos para mostrar
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Inscripciones</span>
                        </div>
                        <span className="text-sm font-medium">{estadisticas.totalInscripciones}</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Asistencias</span>
                        </div>
                        <span className="text-sm font-medium">{estadisticas.totalAsistencias}</span>
                      </div>
                      <Progress 
                        value={(estadisticas.totalAsistencias / estadisticas.totalInscripciones) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Tasa de Asistencia</span>
                        </div>
                        <span className="text-sm font-medium">{estadisticas.tasaAsistencia}%</span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${estadisticas.tasaAsistencia}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
  )
}

