'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client with optimized defaults
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data is considered fresh for 1 minute
                staleTime: 60 * 1000,
                // Cache data for 5 minutes after becoming unused
                gcTime: 5 * 60 * 1000,
                // Retry failed requests 2 times
                retry: 2,
                // Refetch on window focus for fresh data
                refetchOnWindowFocus: true,
                // Don't refetch on reconnect if data is fresh
                refetchOnReconnect: 'always',
            },
            mutations: {
                // Retry mutations once
                retry: 1,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always create a new query client
        return makeQueryClient();
    } else {
        // Browser: reuse the same query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

interface QueryProviderProps {
    children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} position="bottom" />
            )}
        </QueryClientProvider>
    );
}

export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
