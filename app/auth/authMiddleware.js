import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function authMiddleware(handler) {
  return async (req) => {
    try {
      const authorizationHeader = req.headers.get('authorization');
      if (!authorizationHeader) {
        return NextResponse.json({ error: 'Access denied, token missing!' }, { status: 401 });
      }

      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        return NextResponse.json({ error: 'Access denied, token missing!' }, { status: 401 });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Call the next handler
      return handler(req);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token!' }, { status: 401 });
    }
  };
}
