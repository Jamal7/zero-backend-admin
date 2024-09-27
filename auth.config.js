import CredentialsProvider from 'next-auth/providers/credentials';

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Authorizing with credentials:', credentials);

        const user = { email: 'zero@zero.com', password: '12345678' };

        if (credentials.email === user.email && credentials.password === user.password) {
          console.log('Credentials matched:', user);
          return { id: 1, name: 'Admin', email: user.email };
        } else {
          console.log('Invalid credentials provided');
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error', // This page will show authentication errors
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set correctly in .env.local
};
