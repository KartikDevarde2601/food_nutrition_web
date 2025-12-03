import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { mealsApi } from '@/lib/api/meal.api'
import { Meal } from '@/features/meals/data/schema'
import { MealDetail } from '@/features/meals/data/schema'


export const mealsKeys = {
  all: ['meals'] as const,
  lists: () => [...mealsKeys.all, 'list'] as const,
  list: () => [...mealsKeys.lists()] as const,
  details: () => [...mealsKeys.all, 'details'] as const,
  detail: (id: string | number) => [...mealsKeys.details(), id] as const,
}

// Hook to fetch all meals
export function useMealsQuery(
  options?: Omit<UseQueryOptions<Meal[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Meal[], Error>({
    queryKey: mealsKeys.list(),
    queryFn: () => mealsApi.getMeals(),
    ...options,
  })
}

// Hook to fetch a single meal by ID
export function useMealQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<Meal, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Meal, Error>({
    queryKey: mealsKeys.detail(id),
    queryFn: () => mealsApi.getMeal(id),
    enabled: !!id,
    ...options,
  })
}



export function useMealDetailsQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<MealDetail[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MealDetail[], Error>({
    queryKey: mealsKeys.detail(id),
    queryFn: () => mealsApi.getMealDetails(id),
    enabled: !!id,
    ...options,
  })
}
