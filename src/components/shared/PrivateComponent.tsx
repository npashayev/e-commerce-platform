'use client';
import { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

interface PrivateComponentProps {
    children: ReactNode;
    roles: string[];
}

export const PrivateComponent = ({
    children,
    roles,
}: PrivateComponentProps) => {
    const { role, isAuthenticated } = useAuth();

    // Check if user is authenticated and has required role
    if (!isAuthenticated || !roles.includes(role)) return null;

    return <>{children}</>;
};