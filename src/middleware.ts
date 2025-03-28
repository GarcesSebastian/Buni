import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const params = path.split('/').filter(Boolean);

    if (params[0] === 'forms') {
        const formType = params[1];
        const eventId = params[2];

        if (!eventId || !formType) {
            return NextResponse.redirect(new URL('/events', req.url));
        }

        try {
            const eventsCookie = req.cookies.get('events')?.value;
            if (!eventsCookie) {
                return NextResponse.redirect(new URL('/events', req.url));
            }

            const events = JSON.parse(eventsCookie);
            const event = events.find((e: any) => e.id === Number(eventId));

            if (!event) {
                return NextResponse.redirect(new URL('/events', req.url));
            }

            const formKey = `form${formType.charAt(0).toUpperCase() + formType.slice(1)}`;
            if (!event[formKey]) {
                return NextResponse.redirect(new URL(`/events/${eventId}`, req.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error('Error en middleware:', error);
            return NextResponse.redirect(new URL('/events', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/forms/:path*',
};
