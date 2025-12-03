import { apiClient } from '@/lib/api/client'

export interface PerformanceMatrixParams {
  startDate: string
  endDate: string
  groupSimilar: boolean
}

export interface MetricValues {
  '#cMeals'?: number
  '%cMeals'?: number
  MAE?: number
  RMSE?: number
  NMAE?: {
    protein?: number
    fat?: number
    carbs?: number
  }
  NRMSE?: {
    protein?: number
    fat?: number
    carbs?: number
  }
}

export interface ModelMetricResponse {
  modelId_one: string
  modelId_two: string
  metrics: MetricValues
}

export interface PerformanceMatrixData {
  rows: string[]
  cols: string[]
  data: Record<string, Record<string, MetricValues>>
}

export const performanceApi = {
  getMatrix: async (params: PerformanceMatrixParams): Promise<ModelMetricResponse[]> => {
    const response = await apiClient.get('/meals/metric/models', {
      params,
    })
    return response.data
  },
}
