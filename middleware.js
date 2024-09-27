import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';



export function middleware(request) {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    // Check if the authorization header is present
    if (!authHeader) {
        return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    // Extract the token from the Bearer token format
    const token = authHeader.split(' ')[1]; 
    if (!token) {
        return NextResponse.json({ error: 'Token missing' }, { status: 401 });
    }

    // Verify and decode the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user information to the request
        request.user = decoded;
        return NextResponse.next();
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}

export const config = {
    matcher: ['/api/edit/:id'], // Apply this middleware to all API routes
};
