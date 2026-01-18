"use client";

import { ReactNode } from "react";
import AuthProvider from "./SessionProvider";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store/store';

interface Props {
    children: ReactNode;
}

export default function Providers({ children }: Props) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </PersistGate>
        </Provider>
    );
}