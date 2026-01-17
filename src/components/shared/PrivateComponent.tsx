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
    const { role, isLoading } = useAuth();

    // Prevent flash during loading
    if (isLoading) return null;

    // Check if user has required role
    if (!roles.includes(role || '')) return null;

    return <>{children}</>;
};