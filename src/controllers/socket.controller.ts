import { User } from "@/hooks/auth/useUserData";

export function handleUpdateUserData(data: User, setUser: (users: User) => void) {
    setUser(data)
}

export function handleUpdateEventForm(data: { idEvent: string, typeForm: string, data: Record<string, string | number> }, setUser: (user: User | ((prevUser: User) => User)) => void) {
  setUser((prevUser: User) => {
    const updatedUser = { ...prevUser }
    const updatedEvents = [...updatedUser.events]
    const eventIndex = updatedEvents.findIndex((event) => event.id === data.idEvent)
    
    if (eventIndex !== -1) {
      const eventUser = { ...updatedEvents[eventIndex] }
      const formKey = data.typeForm as 'assists' | 'inscriptions'
      
      if (formKey in eventUser) {
        const currentForms = Array.isArray(eventUser[formKey]) 
          ? [...eventUser[formKey]] 
          : []
        
        eventUser[formKey] = [...currentForms, data.data]
        updatedEvents[eventIndex] = eventUser
      }
      
      updatedUser.events = updatedEvents
    }

    return updatedUser
  })
}