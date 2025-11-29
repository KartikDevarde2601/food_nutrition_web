import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { modelsApi, type ModelDto } from '@/lib/api/models.api'

// Query keys factory for models
export const modelsKeys = {
  all: ['models'] as const,
  lists: () => [...modelsKeys.all, 'list'] as const,
  list: () => [...modelsKeys.lists()] as const,
  details: () => [...modelsKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...modelsKeys.details(), id] as const,
}

// Hook to fetch all models
export function useModelsQuery(
  options?: Omit<UseQueryOptions<ModelDto[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ModelDto[], Error>({
    queryKey: modelsKeys.list(),
    queryFn: () => modelsApi.getModels(),
    staleTime: 5 * 60 * 1000, // Models don't change often, cache for 5 minutes
    ...options,
  })
}

// Hook to fetch a single model by ID
export function useModelQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<ModelDto, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ModelDto, Error>({
    queryKey: modelsKeys.detail(id),
    queryFn: () => modelsApi.getModel(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Models don't change often, cache for 5 minutes
    ...options,
  })
}
