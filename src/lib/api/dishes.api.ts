import { type Dish, type DishForm } from '@/features/dishes/data/schema'
import { apiClient } from './client'

// ---------- Helpers ----------
function buildDishFormData(data: Partial<DishForm>) {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any)
    }
  })

  return formData
}

// ---------- API Service ----------
export const dishesApi = {
  // Get all dishes
  async getDishes(): Promise<Dish[]> {
    const response = await apiClient.get<Dish[]>('/dishes')
    return response.data
  },

  // Get single dish
  async getDish(id: number | string): Promise<Dish> {
    const response = await apiClient.get<Dish>(`/dishes/${id}`)
    return response.data
  },

  // Create new dish (multipart/form-data)
  async createDish(data: DishForm): Promise<Dish> {
    const formData = buildDishFormData(data)

    const response = await apiClient.post<Dish>('/dishes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  },

  // Update existing dish (also multipart/form-data)
  async updateDish(
    id: number | string,
    data: Partial<DishForm>
  ): Promise<Dish> {
    const formData = buildDishFormData(data)

    const response = await apiClient.patch<Dish>(`/dishes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  },

  // Delete dish
  async deleteDish(id: number | string): Promise<void> {
    await apiClient.delete(`/dishes/${id}`)
  },
}
