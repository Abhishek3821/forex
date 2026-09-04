// src/constant/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 1,
        },
    },
});
export default queryClient;
