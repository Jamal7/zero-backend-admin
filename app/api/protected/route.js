// app/api/protected/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export default async function handler(req, res) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Handle the request
  res.status(200).json({ message: 'Protected content' });
}
