import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Overview from '../components/adminCompnents/OverView/Overview';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return <Overview session={session} />;
}
