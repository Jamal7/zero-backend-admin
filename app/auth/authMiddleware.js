'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import jwt from 'jsonwebtoken';

const authMiddleware = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/'); // Redirect to login if not logged in
      } else {
        try {
          jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        } catch (error) {
          localStorage.removeItem('token');  // Clear any invalid token
          router.push('/');  // Redirect to login if token is invalid
        }
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  // Set the display name for better debugging
  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default authMiddleware;
