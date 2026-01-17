'use client';
import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    role: session?.user?.role,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === 'admin',
    isModerator: session?.user?.role === 'moderator',
    hasAdminAccess: session?.user?.role === 'admin' || session?.user?.role === 'moderator',
  };
};