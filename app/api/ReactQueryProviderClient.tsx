'use client'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 300000,
            gcTime: 300000
        }
    }
});

const ReactQueryClientProvider = ( {children}  : PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

export default ReactQueryClientProvider;