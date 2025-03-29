import { TabsEvent } from "@/app/events/[id]/page"
import { Event } from "@/types/Events"

export const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#DC2626",
  "#4C1D95",
  "#065F46",
  "#92400E",
  "#1E3A8A",
];

export const getDataForCharts = (
    event: Event, 
    selectedFacultad: string, 
    assistsDistributionField: string = "carrera",
    inscriptionsDistributionField: string = "carrera"
) => {
    if (!event?.assists || !event?.inscriptions) return { assistData: [], inscriptionData: [] }

    const assistsFiltradas =
      selectedFacultad === "todas"
        ? event.assists
        : event.assists.filter((a) => a.facultad === selectedFacultad)

    const inscriptionsFiltradas =
      selectedFacultad === "todas"
        ? event.inscriptions
        : event.inscriptions.filter((i) => i.facultad === selectedFacultad)

    const assistsPorCampo = assistsFiltradas.reduce(
      (acc: Record<string, number>, asistencia) => {
        const valor = asistencia[assistsDistributionField]
        acc[valor] = (acc[valor] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const inscriptionsPorCampo = inscriptionsFiltradas.reduce(
      (acc: Record<string, number>, inscripcion) => {
        const valor = inscripcion[inscriptionsDistributionField]
        acc[valor] = (acc[valor] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const assistData = Object.entries(assistsPorCampo).map(([name, value]) => ({
      name,
      value,
    }))

    const inscriptionData = Object.entries(inscriptionsPorCampo).map(([name, value]) => ({
      name,
      value,
    }))

    return { assistData, inscriptionData }
  }