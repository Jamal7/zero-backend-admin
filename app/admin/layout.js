// src/app/admin/layout.js
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
    return null;
  }

  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
