import { apiClient } from '@/lib/api/client'
import { DataType } from '@/features/performance/data/schema'

export interface PerformanceMatrixParams {
  startDate: string
  endDate: string
  groupSimilar: boolean
  programs: number
  meals?: number[]
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

export interface DishMetricParams {
  model_one: number
  model_two: number
  groupSimilar: number
  programs: number
  meals?: number[]
}

export const performanceApi = {
  getMatrix: async (
    params: PerformanceMatrixParams
  ): Promise<ModelMetricResponse[]> => {
    const response = await apiClient.get('/meals/metric/models', {
      params,
    })
    return response.data
  },

  getDishMetric: async (params: DishMetricParams): Promise<DataType> => {
    const response = await apiClient.get('/meals/metric/dish', {
      params,
      paramsSerializer: {
        indexes: null,
      },
    })
    return response.data
  },
}
