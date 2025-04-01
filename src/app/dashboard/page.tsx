"use client"

import { useState } from "react"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Sector,
  SectorProps
} from "recharts"
import { BookOpen, Calendar, LayoutDashboard, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import Section from "@/components/ui/Section"

const participantesPorEscuela = [
  { name: "Sistemas", value: 45, color: "#0088FE" },
  { name: "Psicología", value: 30, color: "#00C49F" },
  { name: "Medicina", value: 25, color: "#FFBB28" },
  { name: "Derecho", value: 20, color: "#FF8042" },
  { name: "Economía", value: 15, color: "#8884d8" },
]

const detallesSistemas = [
  { name: "Primer Semestre", value: 15 },
  { name: "Segundo Semestre", value: 10 },
  { name: "Tercer Semestre", value: 8 },
  { name: "Cuarto Semestre", value: 7 },
  { name: "Quinto+ Semestre", value: 5 },
]

const prestamosActivos = [
  {
    id: 1,
    item: "Proyector HD",
    solicitante: "Juan Pérez",
    fechaInicio: "2024-06-01",
    fechaFin: "2024-06-05",
    estado: "activo",
  },
  {
    id: 2,
    item: "Micrófono inalámbrico",
    solicitante: "María López",
    fechaInicio: "2024-06-02",
    fechaFin: "2024-06-04",
    estado: "activo",
  },
  {
    id: 3,
    item: "Laptop Dell",
    solicitante: "Carlos Rodríguez",
    fechaInicio: "2024-06-03",
    fechaFin: "2024-06-07",
    estado: "activo",
  },
  {
    id: 4,
    item: "Cámara DSLR",
    solicitante: "Ana Martínez",
    fechaInicio: "2024-06-01",
    fechaFin: "2024-06-08",
    estado: "activo",
  },
  {
    id: 5,
    item: "Tableta Gráfica",
    solicitante: "Pedro Sánchez",
    fechaInicio: "2024-06-04",
    fechaFin: "2024-06-10",
    estado: "activo",
  },
]

const escenariosOcupados = [
  {
    id: 1,
    nombre: "Auditorio Principal",
    evento: "Conferencia de Ingeniería",
    fecha: "2024-06-05",
    horaInicio: "10:00",
    horaFin: "12:00",
  },
  {
    id: 2,
    nombre: "Sala de Conferencias A",
    evento: "Taller de Liderazgo",
    fecha: "2024-06-06",
    horaInicio: "14:00",
    horaFin: "16:00",
  },
  {
    id: 3,
    nombre: "Laboratorio de Informática",
    evento: "Hackathon Universitario",
    fecha: "2024-06-07",
    horaInicio: "09:00",
    horaFin: "18:00",
  },
  {
    id: 4,
    nombre: "Sala de Videoconferencias",
    evento: "Seminario Internacional",
    fecha: "2024-06-08",
    horaInicio: "11:00",
    horaFin: "13:30",
  },
]

export default function DashboardPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showDetailChart, setShowDetailChart] = useState(false)

  const handlePieClick = (data: {name: string,  value: number, color: string}, index: number) => {
    setActiveIndex(index);
    setShowDetailChart(true);
  };

  const renderActiveShape = (props: SectorProps) => {
      const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

      return (
      <g>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius || 0 + 6}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
      </g>
      )
  }

  return (
        <div className="flex h-full flex-col">
            <Section>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">10</div>
                      <p className="text-xs text-muted-foreground">+2 desde el último mes</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Préstamos Activos</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5</div>
                      <p className="text-xs text-muted-foreground">-2 desde ayer</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Escenarios Ocupados</CardTitle>
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4</div>
                      <p className="text-xs text-muted-foreground">+1 desde la última semana</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Eventos Próximos</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4</div>
                      <p className="text-xs text-muted-foreground">En los próximos 7 días</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución por Escuela</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              activeIndex={activeIndex !== null ? activeIndex : undefined}
                              activeShape={renderActiveShape}
                              data={participantesPorEscuela}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              onClick={handlePieClick}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {participantesPorEscuela.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-sm text-center mt-2 text-muted-foreground">Haga clic en una sección para ver detalles</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {showDetailChart
                          ? `Detalles de ${participantesPorEscuela[activeIndex || 0]?.name || "Escuela"}`
                          : "Detalles por Escuela"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {showDetailChart ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={detallesSistemas}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Bar
                              dataKey="value"
                              fill={participantesPorEscuela[activeIndex || 0]?.color || "#DC2626"}
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px]">
                          <p className="text-muted-foreground">Seleccione una escuela en el gráfico para ver detalles</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Préstamos Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Solicitante</TableHead>
                          <TableHead>Fecha Inicio</TableHead>
                          <TableHead>Fecha Fin</TableHead>
                          <TableHead>Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prestamosActivos.map((prestamo) => (
                          <TableRow key={prestamo.id}>
                            <TableCell>{prestamo.item}</TableCell>
                            <TableCell>{prestamo.solicitante}</TableCell>
                            <TableCell>{prestamo.fechaInicio}</TableCell>
                            <TableCell>{prestamo.fechaFin}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Link href={`/prestamos?id=${prestamo.id}`}>Ver detalles</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <Link href="/eventos?id=1" className="block">
                        <div className="flex items-center">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                          </span>
                          <div className="ml-4 space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">Nuevo evento creado</p>
                            <p className="text-sm text-muted-foreground">Hace 2 horas</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>

                      <Link href="/participantes" className="block">
                        <div className="flex items-center">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <div className="ml-4 space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">5 nuevos participantes registrados</p>
                            <p className="text-sm text-muted-foreground">Hace 4 horas</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>

                      <Link href="/prestamos?id=3" className="block">
                        <div className="flex items-center">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                          </span>
                          <div className="ml-4 space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">Préstamo devuelto</p>
                            <p className="text-sm text-muted-foreground">Hace 1 día</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>

                      <Link href="/eventos/escenarios?id=2" className="block">
                        <div className="flex items-center">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                          </span>
                          <div className="ml-4 space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">Escenario reservado</p>
                            <p className="text-sm text-muted-foreground">Hace 2 días</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>

                      <Link href="/formularios?id=1" className="block">
                        <div className="flex items-center">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                          </span>
                          <div className="ml-4 space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">Nuevo formulario creado</p>
                            <p className="text-sm text-muted-foreground">Hace 3 días</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Section>
        </div>
  )
}

