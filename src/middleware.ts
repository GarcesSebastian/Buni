import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    const storedEventsCookie = req.cookies.get("events")?.value;
    const storedEvents = storedEventsCookie ? JSON.parse(storedEventsCookie) : undefined;
    const eventFinded = storedEvents.find((evt:{id: string}) => evt.id == id);

    if(id == "1"){
        return NextResponse.next();
    }

    if(!eventFinded){
        //return NextResponse.redirect(new URL('/', req.url));
    }

    if (url.pathname.startsWith('/forms')) {
        if (id && eventFinded) {
            return NextResponse.next();
        }
        //return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/forms/:path*',
};
