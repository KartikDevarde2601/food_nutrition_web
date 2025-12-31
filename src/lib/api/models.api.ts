import { type Model } from '@/features/programs/data/schema'
import { apiClient } from './client'

export interface ModelDto extends Model {}

export interface GetModelsParams {
  programId?: number
  includeGT?: boolean
}

// Models API Service
export const modelsApi = {
  // Get all available models
  async getModels(params: GetModelsParams): Promise<ModelDto[]> {
    const response = await apiClient.get<ModelDto[]>('/models', { params })
    return response.data
  },

  // Get single model by ID
  async getModel(id: string | number): Promise<ModelDto> {
    const response = await apiClient.get<ModelDto>(`/models/${id}`)
    return response.data
  },
}
