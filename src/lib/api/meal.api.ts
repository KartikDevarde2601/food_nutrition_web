import {
  type Meal,
  type MealForm,
  type MealDetail,
  type MealCorrectionPayload
} from '@/features/meals/data/schema'
import { apiClient } from './client'

// ---------- Helpers ----------
function buildMealFormData(data: Partial<MealForm>) {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any)
    }
  })

  return formData
}

// ---------- API Service ----------
export const mealsApi = {
  // Get all meals
  async getMeals(params?: {
    program_id?: number
    startDate?: string
    endDate?: string
    weightFilter?: {
      mode?: 'less' | 'greater' | 'between'
      min?: number
      max?: number
    }
    dishName?: string
    modelIdOne?: number
    modelIdTwo?: number
    selectedModel?: number
    groupSimilar?: boolean
  }): Promise<Meal[]> {
    const queryParams: Record<string, any> = {}

    if (params?.program_id) queryParams.programs = params.program_id
    if (params?.startDate) queryParams.startDate = params.startDate
    if (params?.endDate) queryParams.endDate = params.endDate
    if (params?.dishName) queryParams.dishName = params.dishName
    if (params?.modelIdOne) queryParams.modelIdOne = params.modelIdOne
    if (params?.modelIdTwo) queryParams.modelIdTwo = params.modelIdTwo
    if (params?.selectedModel) queryParams.selectedModel = params.selectedModel
    if (params?.groupSimilar !== undefined) queryParams.groupSimilar = params.groupSimilar

    // Weight filter with dot notation
    if (params?.weightFilter) {
      if (params.weightFilter.mode) {
        queryParams['weightFilter.type'] = params.weightFilter.mode
      }
      if (params.weightFilter.min !== undefined) {
        queryParams['weightFilter.min'] = params.weightFilter.min
      }
      if (params.weightFilter.max !== undefined) {
        queryParams['weightFilter.max'] = params.weightFilter.max
      }
    }

    const response = await apiClient.get<Meal[]>('/meals', {
      params: queryParams,
    })
    return response.data
  },

  // Get single meal
  async getMeal(id: number | string): Promise<Meal> {
    const response = await apiClient.get<Meal>(`/meals/${id}`)
    return response.data
  },

  // Create new meal (multipart/form-data)
  async createMeal(data: MealForm): Promise<Meal> {
    const formData = buildMealFormData(data)

    const response = await apiClient.post<Meal>('/meals', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  },

  // Update existing meal (also multipart/form-data)
  async updateMeal(
    id: number | string,
    data: Partial<MealForm>
  ): Promise<Meal> {
    const formData = buildMealFormData(data)

    const response = await apiClient.patch<Meal>(`/meals/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  },

  // Delete meal
  async deleteMeal(id: number | string): Promise<void> {
    await apiClient.delete(`/meals/${id}`)
  },

  // Run models on meals
  async runModels(mealIds: number[], modelIds: number[]): Promise<void> {
    await apiClient.post('/meals/runmodel', {
      meals: mealIds,
      models: modelIds,
    })
  },

  // Get meal details
  async getMealDetails(id: number | string): Promise<MealDetail[]> {
    const response = await apiClient.get<MealDetail[]>(
      `/meals/details?meals=${id}`
    )
    return response.data
  },

  async correctMeal(payload: MealCorrectionPayload): Promise<any> {
    // Transform to backend-compatible payload
    // Only include dishes with tag 'user' or 'both', and map userWeight to weight
    const backendPayload = {
      meal_id: payload.meal_id,
      dishCorrection: payload.dishCorrection
        .filter((dish) => dish.tag === 'user' || dish.tag === 'both')
        .map((dish) => ({
          dishId: String(dish.dishId),
          weight: String(dish.userWeight ?? ''),
          position: dish.position,
        })),
      feedback: payload.feedback,
    }

    const response = await apiClient.post(
      'meals/user-correction',
      backendPayload
    )
    return response.data
  },

  // Save meal (multipart/form-data) - simplified endpoint
  async saveMeal(data: MealForm): Promise<Meal> {
    if (!data.user_id && !data.program_id) {
      throw new Error('User ID or Program ID is required')
    }
    const formData = new FormData()

    // Add image if provided
    if (data.image) {
      formData.append('image', data.image)
    }

    // Add program_id
    formData.append('program_id', data.program_id.toString())
    formData.append('user_id', data?.user_id?.toString() || '')

    // Add feedback if provided
    if (data.feedback) {
      formData.append('feedback', data.feedback)
    }

    // Add empty fields as per API spec
    formData.append('image_url', '')
    formData.append('modelsResult', '')
    formData.append('userIdentifiersIds', '')
    formData.append('userIdentifiersNames', '')

    const response = await apiClient.post<Meal>('/meals/save', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  },
}
