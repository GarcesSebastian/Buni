import { TabsEvent } from "@/app/events/[id]/page"
import { Event } from "@/types/Events"

interface FilterProps{
    type: TabsEvent
    column: string
    value: string
    functions: {
      setAssistsFilter: (value: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void
      setAssistsPagination: (value: Record<string, number>) => void
      setInscriptionsFilter: (value: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void
      setInscriptionsPagination: (value: Record<string, number>) => void
    }
    data: {
      assistsPagination: Record<string, number>,
      inscriptionsPagination: Record<string, number>,
    }
}

// Colores para gráficas
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

export const getFaculties = (event: Event) => {
    if (!event?.assists) return []

    const faculties = new Set<string>()
    event.assists.forEach((a) => faculties.add(String(a.faculty)))
    return Array.from(faculties)
}

export const handleFilter = ({type, column, value, functions, data}: FilterProps) => {
    if (type === "assists") {
      functions.setAssistsFilter((prev: Record<string, string>) => ({
        ...prev,
        [column]: value,
      }))

      functions.setAssistsPagination({
          ...data.assistsPagination,
          currentPage: 1,
      })
    } else {
      functions.setInscriptionsFilter((prev: Record<string, string>) => ({
          ...prev,
          [column]: value,
      }))

      functions.setInscriptionsPagination({
          ...data.inscriptionsPagination,
          currentPage: 1,
      })
    }
}

export const getDataForCharts = (event: Event, selectedFacultad: string) => {
    if (!event?.assists || !event?.inscriptions) return { assistData: [], inscriptionData: [] }

    const assistsFiltradas =
      selectedFacultad === "todas"
        ? event.assists
        : event.assists.filter((a) => a.facultad === selectedFacultad)

    const inscriptionsFiltradas =
      selectedFacultad === "todas"
        ? event.inscriptions
        : event.inscriptions.filter((i) => i.facultad === selectedFacultad)

    const assistsPorCarrera = assistsFiltradas.reduce(
      (acc: Record<string, number>, asistencia) => {
        const carrera = asistencia.carrera
        acc[carrera] = (acc[carrera] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const inscriptionsPorCarrera = inscriptionsFiltradas.reduce(
      (acc: Record<string, number>, inscripcion) => {
        const carrera = inscripcion.carrera
        acc[carrera] = (acc[carrera] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const assistData = Object.entries(assistsPorCarrera).map(([name, value]) => ({
      name,
      value,
    }))

    const inscriptionData = Object.entries(inscriptionsPorCarrera).map(([name, value]) => ({
      name,
      value,
    }))

    return { assistData, inscriptionData }
  }