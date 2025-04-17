import { NextRequest, NextResponse } from 'next/server';
import type { Event } from '@/types/Events';

const publicPaths = [
    '/',
    '/forms/assists', 
    '/forms/inscriptions',
];

const isPublicPath = (path: string): boolean => {
    if (publicPaths.includes(path)) {
        return true;
    }

    if (path.startsWith('/forms/')) {
        const formType = path.split('/')[2];
        return formType === 'assists' || formType === 'inscriptions';
    }

    return false;
};

async function verifyTokenWithBackend(token: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const data = await response.json();
        return data.valid === true;
    } catch (error) {
        console.error('Error verificando token:', error);
        return false;
    }
}

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const params = path.split('/').filter(Boolean);
    const token = req.cookies.get('token')?.value;

    if (path === '/' && token) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (isPublicPath(path)) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    const isValidToken = await verifyTokenWithBackend(token);
    
    if (!isValidToken) {
        const response = NextResponse.redirect(new URL('/', req.url));
        response.cookies.delete('token');
        return response;
    }

    if (params[0] === 'forms') {
        const formType = params[1];
        const eventId = params[2];

        if (!eventId || !formType) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        try {
            const eventsCookie = req.cookies.get('events')?.value;
            if (!eventsCookie) {
                return NextResponse.redirect(new URL('/', req.url));
            }

            const events = JSON.parse(eventsCookie) as Event[];
            const event = events.find((e: Event) => e.id === Number(eventId));

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

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
