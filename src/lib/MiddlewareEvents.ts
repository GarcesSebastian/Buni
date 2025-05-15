import { NextResponse, NextRequest } from "next/server";
import { getEvents } from "./DataSync";
import type { Event } from '@/types/Events';

const redirectToForms = async (params: string[], req: NextRequest) => {
    const formType = params[1];
    const eventId = params[2];

    if (!eventId || !formType) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (formType !== 'inscriptions' && formType !== 'assists') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    try {
        const events = await getEvents();
        const event = events.find((e) => e.id === eventId);

        if (!event) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        const formKey = `form${formType.charAt(0).toUpperCase() + formType.slice(1)}`;
        if (!event[formKey as keyof Event]) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Error en middleware:', error);
        return NextResponse.redirect(new URL('/', req.url));
    }
}

const redirectToDevTools = async () => {
    return NextResponse.next();
}

export { redirectToForms, redirectToDevTools };
