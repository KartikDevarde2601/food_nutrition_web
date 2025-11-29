import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { mealsApi } from '@/lib/api/meal.api'
import { Meal, MealForm } from '@/features/meals/data/schema'
import { mealsKeys } from './use-meals-query'

export function useCreateMealMutation(
  options?: Omit<UseMutationOptions<Meal, Error, MealForm>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation<Meal, Error, MealForm>({
    ...options,
    mutationFn: (data: MealForm) => mealsApi.createMeal(data),
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate meals list to refetch
      queryClient.invalidateQueries({ queryKey: mealsKeys.list() })
      toast.success('Meal created successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      // Error handling is done globally in main.tsx
      options?.onError?.(error, variables, context, mutation)
    },
  })
}

export function useUpdateMealMutation(
  options?: Omit<
    UseMutationOptions<Meal, Error, { id: number; data: Partial<MealForm> }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<Meal, Error, { id: number; data: Partial<MealForm> }>({
    ...options,
    mutationFn: ({ id, data }) => mealsApi.updateMeal(id, data),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: mealsKeys.list() })
      queryClient.invalidateQueries({
        queryKey: mealsKeys.detail(variables.id),
      })
      toast.success('Meal updated successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      options?.onError?.(error, variables, context, mutation)
    },
  })
}

export function useDeleteMealMutation(
  options?: Omit<UseMutationOptions<void, Error, string | number>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string | number>({
    ...options,
    mutationFn: (id) => mealsApi.deleteMeal(id),
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate meals list to refetch
      queryClient.invalidateQueries({ queryKey: mealsKeys.list() })
      toast.success('Meal deleted successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      // Error handling is done globally in main.tsx
      options?.onError?.(error, variables, context, mutation)
    },
  })
}
