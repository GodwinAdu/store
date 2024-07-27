import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.TOKEN_SECRET);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token'); // Assuming token info is stored in cookies

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    let userRole = null;

    if (token) {
        try {
            const { payload } = await jwtVerify(token.value, SECRET_KEY);
            userRole = payload.role; // Adjust according to your token structure
        } catch (error) {
            console.error('Invalid token:', error);
        }
    }

    // Public routes
    if (pathname === '/pos') {
        return NextResponse.next();
    }

    // Admin routes
    const adminRoutes = [
        '/dashboard',
        '/dashboard/users',
        '/dashboard/products',
        '/dashboard/purchases',
        '/dashboard/sales',
        '/dashboard/orders',
        '/dashboard/expenses',
        '/dashboard/stocks',
        '/dashboard/reports'
    ];

    if (adminRoutes.includes(pathname)) {
        if (userRole) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/pos', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/pos']
};
