"use client";

import { ReactNode, useState } from "react";
import AuthProvider from "./SessionProvider";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Props {
    children: ReactNode;
}

export default function Providers({ children }: Props) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    );
}