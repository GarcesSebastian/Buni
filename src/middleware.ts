import { NextRequest, NextResponse } from 'next/server';
import redirectToForms from './lib/MiddlewareEvents';

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
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
        if (params[0] === 'forms') {
            return redirectToForms(params, req);
        }

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

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/dashboard', "/forms/:path*"],
};
