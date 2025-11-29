import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { dishesApi } from '@/lib/api/dishes.api'
import { Dish, DishForm } from '../../features/dishes/data/schema'
import { dishesKeys } from './use-dish-query'

export function useCreateDishMutation(
  options?: Omit<UseMutationOptions<Dish, Error, DishForm>, 'mutationFu'>
) {
  const queryClient = useQueryClient()

  return useMutation<Dish, Error, DishForm>({
    ...options,
    mutationFn: (data: DishForm) => dishesApi.createDish(data),
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate programs list to refetch
      queryClient.invalidateQueries({ queryKey: dishesKeys.list() })
      toast.success('Dish created successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      // Error handling is done globally in main.tsx
      options?.onError?.(error, variables, context, mutation)
    },
  })
}

export function useUpdateDishMutation(
  options?: Omit<
    UseMutationOptions<Dish, Error, { id: number; data: Partial<DishForm> }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<Dish, Error, { id: number; data: Partial<DishForm> }>({
    ...options,
    mutationFn: ({ id, data }) => dishesApi.updateDish(id, data),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: dishesKeys.list() })
      queryClient.invalidateQueries({
        queryKey: dishesKeys.detail(variables.id),
      })
      toast.success('Dish updated successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      options?.onError?.(error, variables, context, mutation)
    },
  })
}

export function useDeleteDishMutation(
  options?: Omit<UseMutationOptions<void, Error, string | number>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string | number>({
    ...options,
    mutationFn: (id) => dishesApi.deleteDish(id),
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate programs list to refetch
      queryClient.invalidateQueries({ queryKey: dishesKeys.list() })
      toast.success('Dish deleted successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      // Error handling is done globally in main.tsx
      options?.onError?.(error, variables, context, mutation)
    },
  })
}
