"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { AlertTriangle, ArrowLeft, Calendar, Loader, Users } from "lucide-react"
import Link from "next/link"
import Cookies from "js-cookie"
import type { Assists, Event, Scenery } from "@/types/Events"
import type { User } from "@/hooks/auth/useUserData"

import { DataTable } from "@/components/services/Events/TableEvent"
import { DataImportExport } from "@/components/services/Events/ManageExcel"
import { ChartSection } from "@/components/services/Events/CharSection"

import { useUserData } from "@/hooks/auth/useUserData"

import { getDataForCharts, COLORS } from "@/lib/ManageEvents"
import { Alert, AlertTitle } from "@/components/ui/Alert"
import { Form } from "@/types/Forms"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { generateSampleData } from "@/lib/DataTesting"
import { Programs } from "@/types/Programs"
import { fieldsDistribution } from "@/config/Forms"
import { useSocket } from "@/hooks/server/useSocket"
import { EventInfo } from "@/components/config/EventInfo"
import { FormConfigButton } from "@/components/services/Dialogs/Events/FormConfigButton"
import { FormConfigData } from "@/components/services/Dialogs/Events/FormConfigDialog"
import { useNotification } from "@/hooks/client/useNotification"

export type TabsEvent = "summary" | "assists" | "inscriptions"

export default function EventDetailPage() {
    const params = useParams()
    const router = useRouter()
    const eventId = params.id as string
    const {user, isLoaded, updateEvent} = useUserData()
    const { showNotification } = useNotification()
    const { socket } = useSocket()
    const [event, setEvent] = useState<Event | undefined>()
    const [formAssists, setFormAssists] = useState<Form | undefined>()
    const [formInscriptions, setFormInscriptions] = useState<Form | undefined>()
    const [scenery, setScenery] = useState<Scenery | undefined>()
    const [program, setProgram] = useState<Programs | undefined>()
    const [currentTab, setCurrentTab] = useState<TabsEvent>("summary")
    const [hasDistributionAssists, setHasDistributionAssists] = useState(false)
    const [hasDistributionInscriptions, setHasDistributionInscriptions] = useState(false)

    const [formConfig, setFormConfig] = useState<FormConfigData | undefined>(event?.formConfig)
    const [isChangeFormConfig, setIsChangeFormConfig] = useState(false)
    
    const [selectedAssistsDistribution, setSelectedAssistsDistribution] = useState<string | undefined>()
    const [selectedInscriptionsDistribution, setSelectedInscriptionsDistribution] = useState<string | undefined>()

    const [assistsFilters, setAssistsFilters] = useState<Record<string, string | string[]>>({})
    const [inscriptionsFilters, setInscriptionsFilters] = useState<Record<string, string | string[]>>({})

    const [selectedProgram] = useState<string>("todas")

    const [assistsPagination, setAssistsPagination] = useState<Record<string, number>>({
        currentPage: 1,
        rowsPerPage: 5,
    })

    const [inscriptionsPagination, setInscriptionsPagination] = useState<Record<string, number>>({
        currentPage: 1,
        rowsPerPage: 5,
    })

    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if(!isLoaded) return;
        const foundEvent = user.events.find((e) => e.id === eventId)

        if (foundEvent) {
            setEvent(foundEvent)

            const idFormAssists = foundEvent?.formAssists?.id
            const idFormInscriptions = foundEvent?.formInscriptions?.id
            const idProgram = foundEvent?.programs?.id
            const idScenery = foundEvent?.scenery?.id

            setFormAssists(user.forms.find((f) => f.id == idFormAssists) ?? undefined)
            setFormInscriptions(user.forms.find((f) => f.id == idFormInscriptions) ?? undefined)
            setProgram(user.programs.find((p) => p.id == idProgram) ?? undefined)
            setScenery(user.scenery.find((s) => s.id == idScenery) ?? undefined)
            setFormConfig(foundEvent.formConfig)
            
            const assistsField = formAssists?.fields.find(field => field.type === "select")?.id.split("_")[0] || "carrera"
            const inscriptionsField = formInscriptions?.fields.find(field => field.type === "select")?.id.split("_")[0] || "carrera"
            setSelectedAssistsDistribution(assistsField)
            setSelectedInscriptionsDistribution(inscriptionsField)

            const defaultAssistsField = formAssists?.fields.find(field => field.type === "select")?.id.split("_")[0] || "carrera"
            const defaultInscriptionsField = formInscriptions?.fields.find(field => field.type === "select")?.id.split("_")[0] || "carrera"

            setSelectedAssistsDistribution(defaultAssistsField)
            setSelectedInscriptionsDistribution(defaultInscriptionsField)
        }else{
            router.push("/events")
        }

    }, [eventId, router, user.events, formAssists, formInscriptions, program, scenery, user.forms, user.programs, user.scenery, isLoaded])

    useEffect(() => {
        socket?.on("UPDATE_DATA", (updatedUser: User) => {
            const updatedEvent = updatedUser.events.find((e: Event) => e.id === eventId);
            
            if (updatedEvent && (!event || JSON.stringify(event) !== JSON.stringify(updatedEvent))) {
                setEvent(updatedEvent);
                updateEvent(eventId, updatedEvent);
            }
        });

        return () => {
            socket?.off("UPDATE_DATA");
        };
    }, [socket, eventId, updateEvent, event]);

    useEffect(() => {
        if (event?.formAssists?.id && event?.formInscriptions?.id) {
            formAssists?.fields.forEach((field) => {
                if (fieldsDistribution.includes(field.type)) {
                    setHasDistributionAssists(true)
                }
            })

            formInscriptions?.fields.forEach((field) => {
                if (fieldsDistribution.includes(field.type)) {
                    setHasDistributionInscriptions(true)
                }
            })
        }
    }, [event])

    const handleFormConfigSave = async (config: FormConfigData) => {
        setFormConfig(config)
        setIsChangeFormConfig(true)

        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/form-config`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`,
                },
                body: JSON.stringify(config),
            })
    
            const data = await response.json()
    
            if (!response.ok) {
                throw new Error(data.error || "Error al guardar la configuración")
            }

            const newData = {
                ...user,
                events: user.events.map((e) => {
                    if (e.id === eventId) {
                        return {
                            ...e,
                            formConfig: config
                        }
                    }
                    return e
                })
            }

            socket?.emit("UPDATE_DATA", newData)
    
            setIsChangeFormConfig(false)
            showNotification({
                title: "Configuración actualizada",
                message: "Los intervalos de fechas para los formularios han sido actualizados",
                type: "success",
                duration: 5000,
            })
        }catch(error){
            console.error(error)
            showNotification({
                title: "Error",
                message: "No se pudo guardar la configuración",
                type: "error",
            })
        }
    }

    const filteredAssists = event?.assists?.filter((assists) => {
        return Object.entries(assistsFilters).every(([key, value]) => {
            if (!value) return true
            if (Array.isArray(value)) {
                return value.includes(assists[key]?.toString())
            }
            return assists[key]?.toString().toLowerCase().includes(value.toLowerCase())
        })
    }) || []

    const filteredInscriptions = event?.inscriptions?.filter((inscription) => {
        return Object.entries(inscriptionsFilters).every(([key, value]) => {
            if (!value) return true
            if (Array.isArray(value)) {
                return value.includes(inscription[key]?.toString())
            }
            return inscription[key]?.toString().toLowerCase().includes(value.toLowerCase())
        })
    }) || []

    const { assistData, inscriptionData } = getDataForCharts(
        {
            ...event as Event,
            assists: filteredAssists,
            inscriptions: filteredInscriptions
        }, 
        selectedProgram, 
        selectedAssistsDistribution,
        selectedInscriptionsDistribution,
        formAssists,
        formInscriptions
    )

    const handleClearFilters = (type: TabsEvent) => {
        if (type === "assists") {
            setAssistsFilters({})
        } else {
            setInscriptionsFilters({})
        }
    }

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

    const handleImportData = (type: TabsEvent, data: Assists[]) => {
        if (!event) return

        if (type === "assists") {
            setEvent({
                ...event,
                assists: [...event.assists || [], ...data],
            })
            setAssistsFilters({})
            setAssistsPagination({
                currentPage: 1,
                rowsPerPage: assistsPagination.rowsPerPage,
            })
        } else {
            setEvent({
                ...event,
                inscriptions: [...event.inscriptions || [], ...data],
            })
            setInscriptionsFilters({})
            setInscriptionsPagination({
                currentPage: 1,
                rowsPerPage: inscriptionsPagination.rowsPerPage,
            })
        }
    }

    const getColumnsForm = (formUse: Form | undefined): {[key: string]: string | number | boolean}[] => {
        if (!formUse) return []

        const structure: {[key: string]: string | number | boolean}[] = []

        formUse.fields.forEach((field) => {
            structure.push({
                key: field.id.split("_")[0],
                label: field.name,
                filterable: true,
            })
        })

        return structure
    }

    const getDistributionOptions = (form: Form | undefined) => {
        if (!form) return []

        return form.fields.filter(field => {
            const hasOptions = field.options && field.options.length > 0
            const isSelectableType = [
                "select",
                "checklist_single",
                "checklist_multiple",
                "qualification",
                "checkbox"
            ].includes(field.type)

            if (field.type === "checkbox" || field.type === "qualification") {
                return true
            }

            return hasOptions && isSelectableType
        }).map(field => ({
            value: field.id.split("_")[0],
            label: field.name
        }))
    }

    const handleGenerateData = async () => {
        setIsGenerating(true);

        const inscriptionsCount = Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;
        const assistsCount = Math.floor(Math.random() * (inscriptionsCount - 0 + 1)) + 0;

        const [newInscriptions, newAssists] = await Promise.all([
            generateSampleData(inscriptionsCount, formInscriptions),
            generateSampleData(assistsCount, formAssists)
        ]);

        setEvent((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                inscriptions: newInscriptions,
                assists: newAssists
            };
        });

        setIsGenerating(false);
    };
    
    if(!isLoaded){
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

    if (!event && isLoaded) {
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
                <main className="h-full overflow-y-auto p-2 sm:p-4 md:p-8">
                    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <Link href="/events" className="sm:mr-4">
                                    <Button variant="outline" size="icon" className="flex justify-center items-center">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold">{event!.nombre || "Sin nombre"}</h1>
                                    <p className="text-sm sm:text-base text-muted-foreground">{event!.organizador || "Sin organizador"}</p>
                                </div>
                            </div>

                            <FormConfigButton
                                eventName={event!.nombre}
                                formAssists={formAssists!}
                                formInscriptions={formInscriptions!}
                                initialConfig={event!.formConfig}
                                onConfigSaved={handleFormConfigSave}
                                isChangeFormConfig={isChangeFormConfig}
                            />

                            <Button 
                                onClick={handleGenerateData}
                                disabled={isGenerating}
                                className="bg-primary hover:bg-primary/90 hidden"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        Generando datos...
                                    </>
                                ) : (
                                    "Generar datos aleatorios"
                                )}
                            </Button>
                        </div>

                        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as TabsEvent)} className="w-full">
                            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-4 h-fit">
                                <TabsTrigger value="summary">Resumen</TabsTrigger>
                                <TabsTrigger value="assists">Asistencias</TabsTrigger>
                                <TabsTrigger value="inscriptions">Inscripciones</TabsTrigger>
                            </TabsList>

                            <TabsContent value="summary" className="space-y-4 sm:space-y-6">
                                <Card>
                                    <CardHeader className="flex flex-col p-4 sm:p-6">
                                        <CardTitle className="text-lg sm:text-xl">Información del Evento</CardTitle>
                                        <CardDescription className="text-sm">Detalles generales del evento</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 sm:p-6">
                                        <EventInfo event={event!} scenery={scenery as Scenery} program={program as Programs} formConfig={formConfig!} />
                                    </CardContent>
                                </Card>

                                {event!.assists?.length || 0 > 0 || event!.inscriptions?.length || 0 > 0 ? (
                                    <Card className="overflow-hidden">
                                        <CardContent className="p-3 sm:p-4 md:p-8">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
                                                <div className="col-span-1 md:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="p-2 bg-muted rounded-lg">
                                                            <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm sm:text-base md:text-lg font-semibold">Estadísticas del Evento</h3>
                                                            <p className="text-xs sm:text-sm text-muted-foreground">Resumen de participación</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                                        <div className="bg-background p-3 sm:p-4 md:p-6 rounded-xl border">
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <div className="p-2 bg-muted rounded-lg">
                                                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Inscripciones</p>
                                                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                                                                        {event!.inscriptions?.length || 0}
                                                                    </h3>
                                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                                        {event!.cupos === "-1" 
                                                                            ? "Cupos ilimitados" 
                                                                            : `${event!.inscriptions?.length || 0} de ${event!.cupos} cupos ocupados`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-background p-3 sm:p-4 md:p-6 rounded-xl border">
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <div className="p-2 bg-muted rounded-lg">
                                                                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Asistencias</p>
                                                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                                                        {event!.assists?.length || 0}
                                                    </h3>
                                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                                        {event!.inscriptions?.length 
                                                                            ? `${Math.round((event!.assists?.length || 0) / event!.inscriptions.length * 100)}% de los inscritos asistieron`
                                                                            : "Sin asistencias registradas"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-background p-3 sm:p-4 md:p-6 rounded-xl border">
                                                    <div className="flex flex-col items-center justify-center h-full">
                                                        <div className="text-center">
                                                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                                                                {event!.inscriptions?.length 
                                                                    ? Math.round((event!.assists?.length || 0) / event!.inscriptions.length * 100)
                                                                    : 0}%
                                                            </div>
                                                            <p className="text-xs sm:text-sm text-muted-foreground">Tasa de Asistencia</p>
                                                            <div className="mt-3 sm:mt-4 w-full max-w-[150px] sm:max-w-[200px] h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-foreground rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${event!.inscriptions?.length 
                                                                            ? (event!.assists?.length || 0) / event!.inscriptions.length * 100
                                                                            : 0}%`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>

                                            <div className="mt-4 sm:mt-6 md:mt-8 bg-background p-3 sm:p-4 md:p-6 rounded-xl border">
                                                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    <span className="text-sm sm:text-base font-medium">Resumen de Participación</span>
                                                </div>
                                                <div className="space-y-1 sm:space-y-2">
                                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                                        {event!.inscriptions?.length 
                                                            ? `Este evento tiene ${event!.inscriptions.length} personas inscritas y ${event!.assists?.length || 0} han confirmado su asistencia. `
                                                            : 'Aún no hay inscripciones registradas. '}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                                        {event!.inscriptions?.length 
                                                            ? `La tasa de asistencia actual es del ${Math.round((event!.assists?.length || 0) / event!.inscriptions.length * 100)}%.`
                                                            : 'Las estadísticas se actualizarán cuando haya inscripciones.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                                            <div className="rounded-full bg-muted p-2 sm:p-3 mb-3 sm:mb-4">
                                                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-semibold mb-2">No hay datos para mostrar</h3>
                                            <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md mb-4 sm:mb-6">
                                                Este evento aún no tiene asistencias ni inscripciones registradas. Las estadísticas y gráficos se
                                                mostrarán cuando haya datos disponibles.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="assists" className="space-y-4 sm:space-y-6">
                                <Card>
                                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6">
                                        <div>
                                            <CardTitle className="text-lg sm:text-xl">Asistencias</CardTitle>
                                            <CardDescription className="text-sm">Lista de personas que asistieron al evento</CardDescription>
                                        </div>

                                        <div className="mt-4 sm:mt-0">
                                        <DataImportExport
                                            type="assists"
                                            eventId={eventId}
                                            data={filteredAssists}
                                            columns={getColumnsForm(formAssists) as Assists[]}
                                            fileName={`asistencias_evento_${event!.id}`}
                                            onImport={(data) => handleImportData("assists", data)}
                                        />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 sm:p-6">
                                        <DataTable
                                            type={currentTab}
                                            data={currentTab === "assists" ? filteredAssists : filteredInscriptions}
                                            columns={currentTab === "assists" ? getColumnsForm(formAssists) : getColumnsForm(formInscriptions)}
                                            pagination={currentTab === "assists" ? assistsPagination : inscriptionsPagination}
                                            onPageChange={(page) => handlePageChange(currentTab, page)}
                                            onRowsPerPageChange={(rows) => handleRowsPerPageChange(currentTab, rows)}
                                            onClearFilters={() => handleClearFilters(currentTab)}
                                            form={currentTab === "assists" ? formAssists : formInscriptions}
                                        />
                                    </CardContent>
                                </Card>

                                {filteredAssists.length > 0 && hasDistributionAssists && (
                                    <div className="space-y-4">
                                        <div className="flex justify-end">
                                            <div className="w-[200px]">
                                                <Select value={selectedAssistsDistribution} onValueChange={setSelectedAssistsDistribution}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Distribuir por..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getDistributionOptions(formAssists).map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            <ChartSection 
                                                title="Distribución por Campo" 
                                                data={assistData} 
                                                type="pie" 
                                                colors={COLORS}
                                            />
                                            <ChartSection 
                                                title="Distribución por Campo" 
                                                data={assistData} 
                                                type="bar" 
                                                colors={[COLORS[0]]}
                                            />
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="inscriptions" className="space-y-4 sm:space-y-6">
                                <Card>
                                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6">
                                        <div>
                                            <CardTitle className="text-lg sm:text-xl">Inscripciones</CardTitle>
                                            <CardDescription className="text-sm">Lista de personas inscritas al evento</CardDescription>
                                        </div>
                                        <div className="mt-4 sm:mt-0 max-sm:w-full">
                                            <DataImportExport
                                                type="inscriptions"
                                                eventId={eventId}
                                                data={filteredInscriptions}
                                                columns={getColumnsForm(formInscriptions) as Assists[]}
                                                fileName={`inscripciones_evento_${event!.id}`}
                                                onImport={(data) => handleImportData("inscriptions", data)}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 sm:p-6">
                                        <DataTable
                                            type={currentTab}
                                            data={currentTab === "assists" ? filteredAssists : filteredInscriptions}
                                            columns={currentTab === "assists" ? getColumnsForm(formAssists) : getColumnsForm(formInscriptions)}
                                            pagination={currentTab === "assists" ? assistsPagination : inscriptionsPagination}
                                            onPageChange={(page) => handlePageChange(currentTab, page)}
                                            onRowsPerPageChange={(rows) => handleRowsPerPageChange(currentTab, rows)}
                                            onClearFilters={() => handleClearFilters(currentTab)}
                                            form={currentTab === "assists" ? formAssists : formInscriptions}
                                        />
                                    </CardContent>
                                </Card>

                                {filteredInscriptions.length > 0 && hasDistributionInscriptions && (
                                    <div className="space-y-4">
                                        <div className="flex justify-end">
                                            <div className="w-[200px]">
                                                <Select value={selectedInscriptionsDistribution} onValueChange={setSelectedInscriptionsDistribution}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Distribuir por..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getDistributionOptions(formInscriptions).map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            <ChartSection 
                                                title="Distribución por Campo" 
                                                data={inscriptionData} 
                                                type="pie" 
                                                colors={COLORS}
                                            />
                                            <ChartSection 
                                                title="Distribución por Campo" 
                                                data={inscriptionData} 
                                                type="bar" 
                                                colors={[COLORS[3]]}
                                            />
                                        </div>
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