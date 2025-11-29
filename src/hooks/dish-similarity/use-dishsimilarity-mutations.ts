import { useMutation, useQueryClient ,UseMutationOptions} from '@tanstack/react-query'
import { toast } from 'sonner'
import {dishsimilarityKeys} from './use-dishsimilarity-query'
import { DishSimilarityApi } from '@/lib/api/dishes-similarity.api'
import { DishSimilarityFormValues ,DeleteManySimilarityDto} from '@/features/dish-similarity/data/schema'





export function useCreateDishSimilarityMutation(
  options?: Omit<
    UseMutationOptions<String, Error, DishSimilarityFormValues>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<String,Error, DishSimilarityFormValues>({
    ...options,
    mutationFn: (data: DishSimilarityFormValues) => DishSimilarityApi.createSimilarity(data),
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate programs list to refetch
      queryClient.invalidateQueries({ queryKey: dishsimilarityKeys.list() })
      toast.success('Program created successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      // Error handling is done globally in main.tsx
      options?.onError?.(error, variables, context, mutation)
    },
  })
}




export const useDeleteDishSimilarityMutation = (
    options?: Omit<UseMutationOptions<String, Error, DeleteManySimilarityDto>, 'mutationFn'>
      
) => {
  const queryClient = useQueryClient()

  return useMutation<String,Error, DeleteManySimilarityDto>({
    ...options,
    mutationFn: (data: DeleteManySimilarityDto) => DishSimilarityApi.deleteDishSimilarities(data),
    onSuccess: (data, variables, context, mutation) => {
          queryClient.invalidateQueries({ queryKey: dishsimilarityKeys.list() })
          toast.success('Dish similarities deleted successfully!')
          options?.onSuccess?.(data, variables, context, mutation)
        },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to delete dish similarities'
      )
    },
  })
}
