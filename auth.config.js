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
        alert('Authorizing with credentials:', credentials);

        const user = { email: 'zero@zero.com', password: '12345678' };

        if (credentials.email === user.email && credentials.password === user.password) {
          alert('Credentials matched:', user);
          return { id: 1, name: 'Admin', email: user.email };
        } else {
          alert('Invalid credentials provided');
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is correctly set
};
