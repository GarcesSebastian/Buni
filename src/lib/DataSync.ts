import type { Event, Scenery } from '@/types/Events';
import { Programs } from '@/types/Programs';
import { Form } from '@/types/Forms';
import { apiFetch } from '@/lib/api/client';

export async function getEvents(): Promise<Event[]> {
    return apiFetch<Event[]>('/events', { auth: false });
}

export async function getEvent(id: string): Promise<Event> {
    return apiFetch<Event>(`/events/${id}`, { auth: false });
}

export async function getScenery(id: string): Promise<Scenery> {
    return apiFetch<Scenery>(`/scenery/${id}`, { auth: false });
}

export async function getPrograms(id: string): Promise<Programs> {
    return apiFetch<Programs>(`/programs/${id}`, { auth: false });
}

export async function getForm(id: string): Promise<Form> {
    return apiFetch<Form>(`/forms/${id}`, { auth: false });
}

export async function getDataForm(eventId: string, typeForm: string): Promise<{event: Event, form: Form, scenery: Scenery, date_now: Date, current: number}> {
    return apiFetch<{event: Event, form: Form, scenery: Scenery, date_now: Date, current: number}>(
        `/forms/${typeForm}/${eventId}`,
        { auth: false },
    );
}
