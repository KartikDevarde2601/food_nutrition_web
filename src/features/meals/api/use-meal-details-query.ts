import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { mealsApi } from '@/lib/api/meal.api'
import { MealDetail } from '@/features/meals/data/schema'

export const mealDetailsKeys = {
  all: ['meal-details'] as const,
  detail: (id: string | number) => [...mealDetailsKeys.all, id] as const,
}

export function useMealDetailsQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<MealDetail[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MealDetail[], Error>({
    queryKey: mealDetailsKeys.detail(id),
    queryFn: () => mealsApi.getMealDetails(id),
    enabled: !!id,
    ...options,
  })
}
