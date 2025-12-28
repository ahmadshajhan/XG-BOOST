import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'secret-key-change-me' });
    const { pathname } = req.nextUrl;

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // Redirect to dashboard if logged in and visiting login
    if (pathname === '/login' && token) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
};
