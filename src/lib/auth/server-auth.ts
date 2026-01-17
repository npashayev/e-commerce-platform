import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function requireAuth(requiredRoles?: string[]) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  if (requiredRoles && !requiredRoles.includes(session.user.role)) {
    redirect('/');
  }

  return session;
}

export async function getUserRole() {
  const session = await getServerSession(authOptions);
  return session?.user?.role;
}