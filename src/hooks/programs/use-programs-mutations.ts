import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  programsApi,
  type CreateProgramDto,
  type UpdateProgramDto,
  type ProgramResponse,
  type ProgramCreateResponse,
} from '@/lib/api/programs.api'
import { programsKeys } from './use-programs-query'

// Create program mutation
export function useCreateProgramMutation(
  options?: Omit<
    UseMutationOptions<ProgramCreateResponse, Error, CreateProgramDto>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<ProgramCreateResponse, Error, CreateProgramDto>({
    ...options,
    mutationFn: (data: CreateProgramDto) => programsApi.createProgram(data),
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate programs list to refetch
      queryClient.invalidateQueries({ queryKey: programsKeys.list() })
      toast.success('Program created successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      // Error handling is done globally in main.tsx
      options?.onError?.(error, variables, context, mutation)
    },
  })
}

// Update program mutation
export function useUpdateProgramMutation(
  options?: Omit<
    UseMutationOptions<
      ProgramResponse,
      Error,
      { id: string | number; data: UpdateProgramDto }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<
    ProgramResponse,
    Error,
    { id: string | number; data: UpdateProgramDto }
  >({
    ...options,
    mutationFn: ({ id, data }) => programsApi.updateProgram(id, data),
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: programsKeys.list() })
      queryClient.invalidateQueries({
        queryKey: programsKeys.detail(variables.id),
      })
      toast.success('Program updated successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      // Error handling is done globally in main.tsx
      options?.onError?.(error, variables, context, mutation)
    },
  })
}

// Delete program mutation
export function useDeleteProgramMutation(
  options?: Omit<UseMutationOptions<void, Error, string | number>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string | number>({
    ...options,
    mutationFn: (id) => programsApi.deleteProgram(id),
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate programs list to refetch
      queryClient.invalidateQueries({ queryKey: programsKeys.list() })
      toast.success('Program deleted successfully!')
      options?.onSuccess?.(data, variables, context, mutation)
    },
    onError: (error, variables, context, mutation) => {
      // Error handling is done globally in main.tsx
      options?.onError?.(error, variables, context, mutation)
    },
  })
}
