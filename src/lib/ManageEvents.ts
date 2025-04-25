import { Event } from "@/types/Events"
import { Form } from "@/types/Forms"

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
    selectedProgram: string, 
    assistsDistributionField: string | undefined,
    inscriptionsDistributionField: string | undefined,
    formAssists?: Form,
    formInscriptions?: Form
) => {
    if (!event?.assists || !event?.inscriptions || !assistsDistributionField || !inscriptionsDistributionField) return { assistData: [], inscriptionData: [] }

    const assistsFiltradas =
      selectedProgram === "todas"
        ? event.assists
        : event.assists.filter((a) => a.programs === selectedProgram)

    const inscriptionsFiltradas =
      selectedProgram === "todas"
        ? event.inscriptions
        : event.inscriptions.filter((i) => i.programs === selectedProgram)

    console.log(assistsFiltradas)
    console.log(assistsDistributionField)
    const assistsPorCampo = assistsFiltradas.reduce(
      (acc: Record<string, number>, asistencia) => {
        const valor = asistencia[assistsDistributionField]
        const campo = formAssists?.fields.find(c => c.id.split("_")[0] === assistsDistributionField)
        if (!valor) return acc
        
        if (campo?.type === "checkbox") {
          acc[valor === 1 ? "true" : "false"] = (acc[valor === 1 ? "true" : "false"] || 0) + 1
        } else if (campo?.type === "qualification") {
          const maxQualification = campo.maxQualification || 5
          if (typeof valor === "number" && valor >= 1 && valor <= maxQualification) {
            acc[valor.toString()] = (acc[valor.toString()] || 0) + 1
          }
        } else if (campo?.type === "checklist_single_grid" || campo?.type === "checklist_multiple_grid") {
          if (typeof valor === "object") {
            Object.entries(valor).forEach(([key, value]) => {
              if (campo.type === "checklist_single_grid") {
                acc[`${key}: ${value}`] = (acc[`${key}: ${value}`] || 0) + 1
              } else if (Array.isArray(value)) {
                value.forEach((v: string) => {
                  acc[`${key}: ${v}`] = (acc[`${key}: ${v}`] || 0) + 1
                })
              }
            })
          }
        } else {
          const key = typeof valor === "object" ? JSON.stringify(valor) : String(valor)
          acc[key] = (acc[key] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const inscriptionsPorCampo = inscriptionsFiltradas.reduce(
      (acc: Record<string, number>, inscripcion) => {
        const valor = inscripcion[inscriptionsDistributionField]
        const campo = formInscriptions?.fields.find(c => c.id.split("_")[0] === inscriptionsDistributionField)
        
        if (campo?.type === "checkbox") {
          acc[valor === 1 ? "true" : "false"] = (acc[valor === 1 ? "true" : "false"] || 0) + 1
        } else if (campo?.type === "qualification") {
          const maxQualification = campo.maxQualification || 5
          if (typeof valor === "number" && valor >= 1 && valor <= maxQualification) {
            acc[valor.toString()] = (acc[valor.toString()] || 0) + 1
          }
        } else if (campo?.type === "checklist_single_grid" || campo?.type === "checklist_multiple_grid") {
          if (typeof valor === "object") {
            Object.entries(valor).forEach(([key, value]) => {
              if (campo.type === "checklist_single_grid") {
                acc[`${key}: ${value}`] = (acc[`${key}: ${value}`] || 0) + 1
              } else if (Array.isArray(value)) {
                value.forEach((v: string) => {
                  acc[`${key}: ${v}`] = (acc[`${key}: ${v}`] || 0) + 1
                })
              }
            })
          }
        } else {
          const key = typeof valor === "object" ? JSON.stringify(valor) : String(valor)
          acc[key] = (acc[key] || 0) + 1
        }
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