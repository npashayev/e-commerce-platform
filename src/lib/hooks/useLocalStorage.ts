'use client';
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(defaultValue);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(key);
            if (stored !== null) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setValue(JSON.parse(stored) as T);
            }
        } catch (err) {
            console.error(`Failed to parse localStorage key "${key}"`);
        }
        setIsInitialized(true);
    }, [key]);

    useEffect(() => {
        if (!isInitialized) return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error(`Failed to write localStorage key "${key}"`);
        }
    }, [key, value, isInitialized]);

    return [value, setValue] as const;
}