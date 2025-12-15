import { UseQueryOptions, useQuery, useQueries } from '@tanstack/react-query'
import { dishesApi } from '@/lib/api/dishes.api'
import {
  type Dish,
  type PaginatedDish,
  type DishParams,
} from '@/features/dishes/data/schema'

export const dishesKeys = {
  all: ['dishes'] as const,
  lists: () => [...dishesKeys.all, 'list'] as const,
  list: (params?: DishParams) => [...dishesKeys.lists(), params] as const,
  details: () => [...dishesKeys.all, 'details'] as const,
  detail: (id: string | number) => [...dishesKeys.details(), id] as const,
}

// Hook to fetch all programs
export function useDishesQuery(
  params?: DishParams,
  options?: Omit<UseQueryOptions<PaginatedDish, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PaginatedDish, Error>({
    queryKey: dishesKeys.list(params),
    queryFn: () => dishesApi.getDishes(params),
    placeholderData: (previousData) => previousData,
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

export function useDishesDetailsQuery(ids: (string | number)[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: dishesKeys.detail(id),
      queryFn: () => dishesApi.getDish(id),
      enabled: !!id,
    })),
  })
}
