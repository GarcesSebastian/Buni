"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { AlertTriangle, ArrowLeft, Calendar, Clock, Loader, MapPin, Users } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/types/Events"

import { DataTable } from "@/components/services/Events/TableEvent"
import { DataImportExport } from "@/components/services/Events/ManageExcel"
import { ChartSection, FacultyFilter } from "@/components/services/Events/CharSection"

//import { useUserData } from "@/hooks/useUserData"

import { COLORS } from "@/lib/ManageEvents"
import { getDataForCharts, getFaculties, handleFilter } from "@/lib/ManageEvents"
import { AssistsColumns } from "@/config/Assists"
import { InscriptionsColumns } from "@/config/Inscriptions"
import { Alert, AlertTitle } from "@/components/ui/Alert"
import { eventosEjemplo } from "./data"

export type TabsEvent = "summary" | "assists" | "inscriptions"

export default function EventDetailPage() {
    const params = useParams()
    const router = useRouter()
    const eventId = params.id as string
    //const {user} = useUserData()
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentTab, setCurrentTab] = useState<TabsEvent>("summary")

    const [assistsFilter, setAssistsFilter] = useState<Record<string, string>>({})
    const [inscriptionsFilter, setInscriptionsFilter] = useState<Record<string, string>>({})

    const [selectedFaculty, setSelectedFaculty] = useState<string>("todas")

    const [assistsPagination, setAssistsPagination] = useState({
        currentPage: 1,
        rowsPerPage: 10,
    })

    const [inscriptionsPagination, setInscriptionsPagination] = useState({
        currentPage: 1,
        rowsPerPage: 10,
    })

    const { assistData, inscriptionData } = getDataForCharts(event, selectedFaculty)

    useEffect(() => {
        setLoading(true)
        const foundEvent = eventosEjemplo.find((e) => e.id === Number(eventId))

        if (foundEvent) {
            setEvent(foundEvent)
        } else {
            router.push("/events")
        }

        setLoading(false)
    }, [eventId, router])

    const filteredAssists = event?.assists?.filter((assists) => {
        return Object.entries(assistsFilter).every(([key, value]) => {
            if (!value) return true
            return assists[key]?.toString().toLowerCase().includes(value.toLowerCase())
        })
    }) || []

    const filteredInscriptions = event?.inscriptions?.filter((inscription) => {
        return Object.entries(inscriptionsFilter).every(([key, value]) => {
            if (!value) return true
            return inscription[key]?.toString().toLowerCase().includes(value.toLowerCase())
        })
    }) || []

    const handlePageChange = (type: TabsEvent, page: number) => {
        if (type === "assists") {
            setAssistsPagination({
                ...assistsPagination,
                currentPage: page,
            })
        } else {
            setInscriptionsPagination({
                ...inscriptionsPagination,
                currentPage: page,
            })
        }
    }

    const handleRowsPerPageChange = (type: TabsEvent, rowsPerPage: number) => {
        if (type === "assists") {
            setAssistsPagination({
                currentPage: 1,
                rowsPerPage,
            })
        } else {
            setInscriptionsPagination({
                currentPage: 1,
                rowsPerPage,
            })
        }
    }

    const handleImportData = (type: TabsEvent, data: any[]) => {
        if (!event) return

        if (type === "assists") {
            setEvent({
                ...event,
                assists: [...event.assists, ...data],
            })
            setAssistsFilter({})
            setAssistsPagination({
                currentPage: 1,
                rowsPerPage: assistsPagination.rowsPerPage,
            })
        } else {
            setEvent({
                ...event,
                inscriptions: [...event.inscriptions, ...data],
            })
            setInscriptionsFilter({})
            setInscriptionsPagination({
                currentPage: 1,
                rowsPerPage: inscriptionsPagination.rowsPerPage,
            })
        }
    }

    const clearAssistsFilter = () => {
        setAssistsFilter({})
        setAssistsPagination({
            ...assistsPagination,
            currentPage: 1,
        })
    }

    const clearInscriptionsFilter = () => {
        setInscriptionsFilter({})
        setInscriptionsPagination({
            ...inscriptionsPagination,
            currentPage: 1,
        })
    }

    const handleFilterAssists = (column: string, value: string) => {
        handleFilter({
            type: "assists",
            column,
            value,
            functions: {
                setAssistsFilter: setAssistsFilter,
                setAssistsPagination: setAssistsPagination,
                setInscriptionsFilter: setInscriptionsFilter,
                setInscriptionsPagination: setInscriptionsPagination,
            },
            data: {
                assistsPagination: assistsPagination,
                inscriptionsPagination: inscriptionsPagination,
            }
        })
    }

    const handleFilterInscriptions = (column: string, value: string) => {
        handleFilter({
            type: "inscriptions",
            column,
            value,
            functions: {
                setAssistsFilter: setAssistsFilter,
                setAssistsPagination: setAssistsPagination,
                setInscriptionsFilter: setInscriptionsFilter,
                setInscriptionsPagination: setInscriptionsPagination,
            },
            data: {
                assistsPagination: assistsPagination,
                inscriptionsPagination: inscriptionsPagination,
            }
        })
    }

    if (loading) {
        return (
            <div className="h-full">
                <div className="h-full bg-gray-100">
                    <main className="h-full overflow-y-auto p-4 md:p-8">
                        <div className="flex flex-col items-center justify-center py-10">
                            <Loader className="h-10 w-10 animate-spin text-primary" />
                            <p className="mt-3 text-lg font-semibold text-primary">Buscando evento...</p>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="h-full">
                <div className="h-full bg-gray-100">
                    <main className="h-full overflow-y-auto p-4 md:p-8">
                        <div className="max-w-5xl mx-auto space-y-6">
                            <Alert variant="destructive" className="flex items-center gap-4">
                                <AlertTriangle className="h-6 w-6 text-primary" />
                                <div>
                                    <AlertTitle>Evento no encontrado</AlertTitle>
                                </div>
                            </Alert>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full">
            <div className="h-full bg-muted">
                <main className="h-full overflow-y-auto p-4 md:p-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="flex max-[400px]:flex-col max-[480px]:items-start max-[480px]:gap-3 items-center mb-6">
                            <Link href="/events" className="mr-4">
                                <Button variant="outline" size="icon" className="flex justify-center items-center">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold">{event.nombre}</h1>
                                <p className="text-muted-foreground">{event.organizador}</p>
                            </div>
                        </div>
                        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as TabsEvent)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 max-[380px]:grid-cols-1 mb-4 h-fit">
                                <TabsTrigger value="summary">Resumen</TabsTrigger>
                                <TabsTrigger value="assists">Asistencias</TabsTrigger>
                                <TabsTrigger value="inscriptions">Inscripciones</TabsTrigger>
                            </TabsList>

                            <TabsContent value="summary" className="space-y-6">
                                <Card>
                                    <CardHeader className="flex flex-col">
                                        <CardTitle>Información del Evento</CardTitle>
                                        <CardDescription>Detalles generales del evento</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center">
                                                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">Fecha</p>
                                                        <p>{event.fecha}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">Hora</p>
                                                        <p>{event.hora}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">Escenario</p>
                                                        <p>{event.scenery?.data.nombre}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center">
                                                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">Cupos</p>
                                                        <p>{event.cupos === -1 ? "Ilimitados" : event.cupos}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <div>
                                                        <p className="text-sm font-medium">Facultad</p>
                                                        <Badge variant="outline">
                                                            {event.faculty?.data.nombre}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <div>
                                                        <p className="text-sm font-medium">Estado</p>
                                                        <Badge variant={event.state === "true" ? "default" : "secondary"}>
                                                            {event.state === "true" ? "Activo" : "Inactivo"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {event.assists?.length > 0 || event.inscriptions?.length > 0 ? (
                                    <>
                                        <FacultyFilter
                                            selectedFaculty={selectedFaculty}
                                            faculties={getFaculties(event)}
                                            onChange={setSelectedFaculty}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ChartSection
                                                title="Estadísticas de Asistencias"
                                                description="Distribución de asistencias por carrera"
                                                data={assistData}
                                                type="pie"
                                                colors={COLORS}
                                                totalLabel="Total de asistencias"
                                                totalValue={
                                                    selectedFaculty === "todas"
                                                    ? event.assists?.length || 0
                                                    : event.assists?.filter((a) => a.facultad === selectedFaculty).length || 0
                                                }
                                            />

                                            <ChartSection
                                                title="Estadísticas de Inscripciones"
                                                description="Distribución de inscripciones por carrera"
                                                data={inscriptionData}
                                                type="pie"
                                                colors={COLORS}
                                                totalLabel="Total de inscripciones"
                                                totalValue={
                                                    selectedFaculty === "todas"
                                                    ? event.inscriptions?.length || 0
                                                    : event.inscriptions?.filter((i) => i.facultad === selectedFaculty).length || 0
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ChartSection title="Asistencias por Carrera" data={assistData} type="bar" colors={[COLORS[0]]} />

                                            <ChartSection
                                                title="Inscripciones por Carrera"
                                                data={inscriptionData}
                                                type="bar"
                                                colors={[COLORS[3]]}
                                                />
                                        </div>
                                    </>
                                ) : (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center p-6">
                                            <div className="rounded-full bg-muted p-3 mb-4">
                                                <Calendar className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">No hay datos para mostrar</h3>
                                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                                Este evento aún no tiene asistencias ni inscripciones registradas. Las estadísticas y gráficos se
                                                mostrarán cuando haya datos disponibles.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="assists" className="space-y-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Asistencias</CardTitle>
                                            <CardDescription>Lista de personas que asistieron al evento</CardDescription>
                                        </div>

                                        <DataImportExport
                                            type="assists"
                                            data={filteredAssists}
                                            fileName={`asistencias_evento_${event.id}`}
                                            onImport={(data) => handleImportData("assists", data)}
                                        />
                                    </CardHeader>
                                    <CardContent>
                                        <DataTable
                                            type="assists"
                                            data={filteredAssists}
                                            columns={AssistsColumns}
                                            pagination={assistsPagination}
                                            onPageChange={(page) => handlePageChange("assists", page)}
                                            onRowsPerPageChange={(rows) => handleRowsPerPageChange("assists", rows)}
                                            onFilter={handleFilterAssists}
                                            onClearFilters={clearAssistsFilter}
                                            hasActiveFilters={Object.keys(assistsFilter).length > 0}
                                        />
                                    </CardContent>
                                </Card>

                                {filteredAssists.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ChartSection title="Distribución por Carrera" data={assistData} type="pie" colors={COLORS} />
                                        <ChartSection title="Distribución por Semestre" data={assistData} type="bar" colors={[COLORS[0]]} />
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="inscriptions" className="space-y-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Inscripciones</CardTitle>
                                            <CardDescription>Lista de personas inscritas al evento</CardDescription>
                                        </div>
                                        <DataImportExport
                                            type="inscriptions"
                                            data={filteredInscriptions}
                                            fileName={`inscripciones_evento_${event.id}`}
                                            onImport={(data) => handleImportData("inscriptions", data)}
                                        />
                                    </CardHeader>
                                    <CardContent>
                                        <DataTable
                                            type="inscriptions"
                                            data={filteredInscriptions}
                                            columns={InscriptionsColumns}
                                            pagination={inscriptionsPagination}
                                            onPageChange={(page) => handlePageChange("inscriptions", page)}
                                            onRowsPerPageChange={(rows) => handleRowsPerPageChange("inscriptions", rows)}
                                            onFilter={handleFilterInscriptions}
                                            onClearFilters={clearInscriptionsFilter}
                                            hasActiveFilters={Object.keys(inscriptionsFilter).length > 0}
                                        />
                                    </CardContent>
                                </Card>

                                {filteredInscriptions.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ChartSection title="Distribución por Carrera" data={inscriptionData} type="pie" colors={COLORS} />
                                        <ChartSection title="Distribución por Semestre" data={inscriptionData} type="bar" colors={[COLORS[3]]} />
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    )
}