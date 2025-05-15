import type { Event, Scenery } from '@/types/Events';
import { Programs } from '@/types/Programs';
import { Form } from '@/types/Forms';

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

export async function getEvent(id: string): Promise<Event> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}

export async function getScenery(id: string): Promise<Scenery> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenery/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}

export async function getPrograms(id: string): Promise<Programs> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}

export async function getForm(id: string): Promise<Form> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}

export async function getDataForm(eventId: string, typeForm: string): Promise<{event: Event, form: Form, scenery: Scenery, date_now: Date}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms/${typeForm}/${eventId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los datos del formulario');
    }

    const data = await response.json();
    return data;
}
