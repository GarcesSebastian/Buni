import { Event } from "@/types/Events";
import { useState } from "react";
import { apiFetch, unwrap, type Envelope } from "@/lib/api/client";

const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);

    const getEvents = async () => {
        try {
            const data = await apiFetch<Event[]>("/events");

            if (!data || !Array.isArray(data)) {
                setEvents([]);
                return;
            }

            setEvents(data);
        } catch (error) {
            console.error(error);
            setEvents([]);
        }
    }

    const createEvent = async (event: Event) => {
        // State bug fix (design §5.2): do NOT set the array from the mutation response.
        // Return the unwrapped data and let socket rehydration update the list.
        const data = await apiFetch<Envelope<Event>>("/events", {
            method: "POST",
            body: JSON.stringify(event),
        });
        return unwrap(data);
    }

    const updateEvent = async (event: Event) => {
        try {
            // State bug fix (design §5.2): do NOT set the array from the mutation response.
            const data = await apiFetch<Envelope<Event>>(`/events/${event.id}`, {
                method: "PUT",
                body: JSON.stringify(event),
            });
            return unwrap(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteEvent = async (eventId: string) => {
        try {
            const data = await apiFetch<unknown>(`/events/${eventId}`, {
                method: "DELETE",
            });
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return { events, getEvents, createEvent, updateEvent, deleteEvent };
}

export default useEvents;
