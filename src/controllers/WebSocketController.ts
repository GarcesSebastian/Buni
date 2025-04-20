import { User } from "@/hooks/auth/useUserData";
import { UpdateUserDataPayLoad, UpdateEventFormPayLoad } from "@/hooks/server/useWebSocket";

export function handleUpdateUserData(data: UpdateUserDataPayLoad, setUser: (users: User) => void) {
    setUser(data.users)
}

export function handleUpdateEventForm(data: UpdateEventFormPayLoad, setUser: (user: User | ((prevUser: User) => User)) => void) {
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