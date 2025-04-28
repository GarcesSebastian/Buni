import { Event } from "@/types/Events";
import { useState } from "react";
import Cookies from "js-cookie";

const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);

    const getEvents = async () => {  
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();

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
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(event)
            });
            const data = await response.json();

            if (response.ok) {  
                setEvents(data);
                return data;
            }

            throw new Error(data.error || 'Error al crear el evento');
        } catch (error) {
            throw error;
        }
    }

    const updateEvent = async (event: Event) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${event.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(event)
            });
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteEvent = async (eventId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return { events, getEvents, createEvent, updateEvent, deleteEvent };
}

export default useEvents;