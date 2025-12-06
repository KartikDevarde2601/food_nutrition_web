import { type Meal, type MealForm, type MealDetail } from '@/features/meals/data/schema'
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
    await apiClient.post('/meals/run-models', { mealIds, modelIds })
  },

  // Get meal details
  async getMealDetails(id: number | string): Promise<MealDetail[]> {
    const response = await apiClient.get<MealDetail[]>(`/meals/details?meals=${id}`)
    return response.data
  },
}
