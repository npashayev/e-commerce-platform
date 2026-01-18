import { signOut } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { clearUser } from '@/lib/store/slices/userSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);

  const logout = async () => {
    // Clear Redux user state
    dispatch(clearUser());

    // Sign out from NextAuth
    await signOut({ callbackUrl: '/' });
  };

  return {
    user,
    role: user?.role || '',
    isAuthenticated: user !== null,
    logout,
  };
};