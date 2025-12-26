import { type Meal, type MealForm, type MealDetail } from '@/features/meals/data/schema'
import { apiClient } from './client'
import { MealCorrectionPayload } from '@/features/meals/data/meal-user-form-schema'

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
  async getMeals(params?: { program_id?: number }): Promise<Meal[]> {
    const queryParams = params?.program_id
      ? { programs: params.program_id }
      : {}

    const response = await apiClient.get<Meal[]>('/meals', { params: queryParams })
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
    await apiClient.post('/meals/runmodels', { meals: mealIds, models: modelIds })
  },

  // Get meal details
  async getMealDetails(id: number | string): Promise<MealDetail[]> {
    const response = await apiClient.get<MealDetail[]>(`/meals/details?meals=${id}`)
    return response.data
  },


  async correctMeal(payload: MealCorrectionPayload): Promise<any> {
    const response = await apiClient.post('meals/user-correction', payload)
    return response.data
  },

  // Save meal (multipart/form-data) - simplified endpoint
  async saveMeal(data: MealForm): Promise<Meal> {
    const formData = new FormData()

    // Add image if provided
    if (data.image) {
      formData.append('image', data.image)
    }

    // Add program_id
    formData.append('program_id', data.program_id.toString())

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
  }
}
