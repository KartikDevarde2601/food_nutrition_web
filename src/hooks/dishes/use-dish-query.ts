import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { dishesApi } from '@/lib/api/dishes.api'
import { Dish } from '@/features/dishes/data/schema'

export const dishesKeys = {
  all: ['dishes'] as const,
  lists: () => [...dishesKeys.all, 'list'] as const,
  list: () => [...dishesKeys.lists()] as const,
  details: () => [...dishesKeys.all, 'details'] as const,
  detail: (id: string | number) => [...dishesKeys.details(), id] as const,
}

// Hook to fetch all programs
export function useDishesQuery(
  options?: Omit<UseQueryOptions<Dish[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Dish[], Error>({
    queryKey: dishesKeys.list(),
    queryFn: () => dishesApi.getDishes(),
    ...options,
  })
}


export function useDishQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<Dish, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Dish, Error>({
    queryKey: dishesKeys.detail(id),
    queryFn: () => dishesApi.getDish(id),
    enabled: !!id,
    ...options,
  })
}
