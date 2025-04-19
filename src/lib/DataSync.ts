import type { Event, Scenery } from '@/types/Events';
import { Faculty } from '@/types/Faculty';

export async function getEvents(): Promise<Event[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }); 

    const data = await response.json();
    return data;
}

export async function getEvent(id: number): Promise<Event> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}

export async function getScenery(id: number): Promise<Scenery> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenery/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}

export async function getFaculty(id: number): Promise<Faculty> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faculty/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}
