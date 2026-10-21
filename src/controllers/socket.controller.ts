import { User } from "@/hooks/auth/useUserData";
import { User as AuthUser } from "@/hooks/auth/useAuth";
import type { UpdateEventFormsPayload } from "@/types/contract.generated";
import type { Assists } from "@/types/Events";

export function handleUpdateUserData(data: User, setUser: (users: User) => void) {
  setUser(data)
}

export function handleUpdateUser(data: AuthUser, setUser: (user: AuthUser) => void) {
  setUser(data)
}

export function handleUpdateEventForm(data: UpdateEventFormsPayload, setUser: (user: User | ((prevUser: User) => User)) => void) {
  setUser((prevUser: User) => {
    const updatedUser = { ...prevUser }
    const updatedEvents = [...updatedUser.events]
    const eventIndex = updatedEvents.findIndex((event) => event.id === data.idEvent)

    const targetEvent = eventIndex !== -1 ? updatedEvents[eventIndex] : undefined

    if (targetEvent) {
      const eventUser = { ...targetEvent }
      const formKey = data.typeForm

      if (formKey in eventUser) {
        const currentForms = Array.isArray(eventUser[formKey])
          ? [...(eventUser[formKey] as Assists[])]
          : []

        eventUser[formKey] = [...currentForms, data.data as unknown as Assists]
        updatedEvents[eventIndex] = eventUser
      }

      updatedUser.events = updatedEvents
    }

    return updatedUser
  })
}
