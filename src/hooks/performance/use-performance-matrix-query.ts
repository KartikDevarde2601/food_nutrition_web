import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  performanceApi,
  PerformanceMatrixParams,
  PerformanceMatrixData,
  DishMetricParams,
} from '@/lib/api/performance.api'
import { DataType } from '@/features/performance/data/schema'

export const usePerformanceMatrixQuery = (params: PerformanceMatrixParams) => {
  console.log("matrixQuery",params)
  return useQuery({
    queryKey: ['performance', 'matrix', params],
    queryFn: () => performanceApi.getMatrix(params),
    select: (data): PerformanceMatrixData => {
      // Extract unique model IDs
      const modelIds = new Set<string>()
      data.forEach((item) => {
        modelIds.add(item.modelId_one)
        modelIds.add(item.modelId_two)
      })

      const uniqueModels = Array.from(modelIds).sort()

      // Build the matrix data structure
      const matrixData: Record<string, Record<string, any>> = {}

      // Initialize all cells
      uniqueModels.forEach((rowId) => {
        matrixData[rowId] = {}
      })

      // Fill in the metrics
      data.forEach((item) => {
        const { modelId_one, modelId_two, metrics } = item

        // Store both directions (symmetric matrix)
        if (!matrixData[modelId_one]) matrixData[modelId_one] = {}
        if (!matrixData[modelId_two]) matrixData[modelId_two] = {}

        matrixData[modelId_one][modelId_two] = metrics
        matrixData[modelId_two][modelId_one] = metrics
      })

      return {
        rows: uniqueModels,
        cols: uniqueModels,
        data: matrixData,
      }
    },
  })
}

export function useDishMetricQuery(
  params: DishMetricParams,
  options?: Omit<UseQueryOptions<DataType, Error>, 'queryKey' | 'queryFu'>
) {
  return useQuery<DataType, Error>({
    queryKey: ['performance', 'dishlevel', params],
    queryFn: () => performanceApi.getDishMetric(params),
    ...options,
  })
}
