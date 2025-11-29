import { Program } from '@/features/programs/data/schema'
import { apiClient } from './client'

// Types based on backend DTOs
export interface CreateProgramDto {
  name: string
  description: string
  defaultModelId: number
}

export interface UpdateProgramDto {
  name?: string
  description?: string
  defaultModelId?: number
}

export interface ProgramResponse extends Program {}

export interface ProgramCreateResponse {
  id: string
  name: string
  description: string
  defaultModelId: number
}

// Programs API Service
export const programsApi = {
  // Get all programs
  async getPrograms(): Promise<ProgramResponse[]> {
    const response = await apiClient.get<ProgramResponse[]>('/programs')
    return response.data
  },

  // Get single program by ID
  async getProgram(id: string | number): Promise<ProgramResponse> {
    const response = await apiClient.get<ProgramResponse>(`/programs/${id}`)
    return response.data
  },

  // Create new program
  async createProgram(data: CreateProgramDto): Promise<ProgramCreateResponse> {
    const response = await apiClient.post<ProgramCreateResponse>(
      '/programs',
      data
    )
    return response.data
  },

  // Update existing program
  async updateProgram(
    id: string | number,
    data: UpdateProgramDto
  ): Promise<ProgramResponse> {
    const response = await apiClient.patch<ProgramResponse>(
      `/programs/${id}`,
      data
    )
    return response.data
  },

  // Delete program
  async deleteProgram(id: string | number): Promise<void> {
    await apiClient.delete(`/programs/${id}`)
  },
}
