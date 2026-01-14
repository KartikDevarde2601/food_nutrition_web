import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { userApi, type UserResponse } from '@/lib/api/user.api'

// Query keys factory for better cache management
export const userKeys = {
    all: ['user'] as const,
    me: () => [...userKeys.all, 'me'] as const,
}

// Hook to fetch current user
export function useUserQuery(
    options?: Omit<
        UseQueryOptions<UserResponse, Error>,
        'queryKey' | 'queryFn'
    >
) {
    return useQuery<UserResponse, Error>({
        queryKey: userKeys.me(),
        queryFn: () => userApi.getMe(),
        staleTime: 10 * 60 * 1000, // 10 minutes - data is fresh, won't refetch
        gcTime: 20 * 60 * 1000,   // 20 minutes - keep in cache even when unused
        ...options,
    })
}
