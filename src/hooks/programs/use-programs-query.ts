import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { programsApi, type ProgramResponse, } from '@/lib/api/programs.api'
import { type ProgramDetail } from '@/features/programs/data/schema'

// Query keys factory for better cache management
export const programsKeys = {
  all: ['programs'] as const,
  lists: () => [...programsKeys.all, 'list'] as const,
  list: () => [...programsKeys.lists()] as const,
  details: () => [...programsKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...programsKeys.details(), id] as const,
}

// Hook to fetch all programs
export function useProgramsQuery(
  options?: Omit<
    UseQueryOptions<ProgramResponse[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ProgramResponse[], Error>({
    queryKey: programsKeys.list(),
    queryFn: () => programsApi.getPrograms(),
    ...options,
  })
}

// Hook to fetch a single program by ID
export function useProgramQuery(
  id: string | number,
  options?: Omit<
    UseQueryOptions<ProgramDetail, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ProgramDetail, Error>({
    queryKey: programsKeys.detail(id),
    queryFn: () => programsApi.getProgram(id),
    enabled: !!id,
    ...options,
  })
}
