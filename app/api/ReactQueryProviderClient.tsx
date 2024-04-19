'use client'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    }
});

const ReactQueryClientProvider = ( {children}  : PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

export default ReactQueryClientProvider;
