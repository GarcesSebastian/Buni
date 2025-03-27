import { TabsEvent } from "@/app/events/[id]/page"
import { Event } from "@/types/Events"

interface FilterProps{
    type: TabsEvent
    column: string
    value: string
    functions: {
      setAssistsFilter: (value: any) => void
      setAssistsPagination: (value: any) => void
      setInscriptionsFilter: (value: any) => void
      setInscriptionsPagination: (value: any) => void
    }
    data: {
      assistsPagination: any,
      inscriptionsPagination: any,
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
    event.assists.forEach((a) => faculties.add(a.faculty))
    return Array.from(faculties)
}

export const handleFilter = ({type, column, value, functions, data}: FilterProps) => {
    if (type === "assists") {
    functions.setAssistsFilter((prev) => ({
        ...prev,
        [column]: value,
    }))

    functions.setAssistsPagination({
        ...data.assistsPagination,
        currentPage: 1,
    })
    } else {
    functions.setInscriptionsFilter((prev) => ({
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
      (acc, asistencia) => {
        const carrera = asistencia.carrera
        acc[carrera] = (acc[carrera] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const inscriptionsPorCarrera = inscriptionsFiltradas.reduce(
      (acc, inscripcion) => {
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