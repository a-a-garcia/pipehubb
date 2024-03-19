'use client'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const queryClient = new QueryClient();

const ReactQueryClientProvider = ( {children}  : PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

export default ReactQueryClientProvider;