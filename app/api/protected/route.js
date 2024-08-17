import { authMiddleware } from '../../auth/authMiddleware';
import { NextResponse } from 'next/server';

// Rename the original function to avoid the conflict
async function getProtectedRoute(req) {
  // Protected route logic
  return NextResponse.json({ message: 'This is a protected route', user: req.user });
}

// Apply middleware to the renamed function and export it as GET
export const GET = authMiddleware(getProtectedRoute);
