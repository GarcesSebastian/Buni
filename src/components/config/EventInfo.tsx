import { Calendar, ClipboardCheck, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Event, Scenery } from "@/types/Events"
import { Programs } from "@/types/Programs"
import { FormConfig } from "@/types/Events"

interface EventInfoProps {
    event: Event,
    scenery: Scenery,
    program: Programs,
    formConfig: FormConfig
}

export const EventInfo = ({ event, scenery, program, formConfig }: EventInfoProps) => {
    
    const formatDate = (dateString: string) => {
        if (!dateString) return "No configurado"
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Fecha de Inicio</p>
                            <p className="text-sm sm:text-base">{new Date(event.horarioInicio).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Fecha de Fin</p>
                            <p className="text-sm sm:text-base">{new Date(event.horarioFin).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Escenario</p>
                            <p className="text-sm sm:text-base">{scenery?.name || "Sin escenario"}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                        <div>
                            <Badge variant="outline" className="text-xs sm:text-sm">
                                {event.cupos === "-1" ? "Cupos ilimitados" : `${event.cupos} cupos`}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div>
                            <p className="text-sm font-medium">Programa</p>
                            <Badge variant="outline" className="text-xs sm:text-sm">
                                {program?.name || "Sin programa"}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div>
                            <p className="text-sm font-medium">Estado</p>
                            <Badge variant={event.state === "true" ? "default" : "secondary"} className="text-xs sm:text-sm">
                                {event.state === "true" ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {formConfig && (formConfig.inscriptions.enabled || formConfig.assists.enabled) && (
            <div className="mt-6 pt-6 border-t">
                <h3 className="text-base font-medium mb-4 flex items-center">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Disponibilidad de Formularios
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formConfig.inscriptions.enabled && (
                    <div className="bg-muted/30 p-3 rounded-lg border">
                    <div className="flex items-center mb-2">
                        <ClipboardCheck className="h-4 w-4 mr-2 text-primary" />
                        <h4 className="text-sm font-medium">Formulario de Inscripciones</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                        <p className="flex items-center text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 inline" />
                        <span className="font-medium mr-1">Inicio:</span> {formatDate(formConfig.inscriptions.startDate)}
                        </p>
                        <p className="flex items-center text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 inline" />
                        <span className="font-medium mr-1">Fin:</span> {formatDate(formConfig.inscriptions.endDate)}
                        </p>
                    </div>
                    </div>
                )}

                {formConfig.assists.enabled && (
                    <div className="bg-muted/30 p-3 rounded-lg border">
                    <div className="flex items-center mb-2">
                        <ClipboardCheck className="h-4 w-4 mr-2 text-primary" />
                        <h4 className="text-sm font-medium">Formulario de Asistencias</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                        <p className="flex items-center text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 inline" />
                        <span className="font-medium mr-1">Inicio:</span> {formatDate(formConfig.assists.startDate)}
                        </p>
                        <p className="flex items-center text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 inline" />
                        <span className="font-medium mr-1">Fin:</span> {formatDate(formConfig.assists.endDate)}
                        </p>
                    </div>
                    </div>
                )}
                </div>
            </div>
            )}
        </>
    )
}