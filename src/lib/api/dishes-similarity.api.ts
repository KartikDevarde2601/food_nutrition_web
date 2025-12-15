import { apiClient } from './client'
import { DishSimilarity, DeleteManySimilarityDto, DishSimilarityFormValues } from '@/features/dish-similarity/data/schema'

export const DishSimilarityApi = {
  async getSimilarity(): Promise<DishSimilarity[]> {
    const response = await apiClient.get<DishSimilarity[]>('/dishes/similarity')
    return response.data
  },


  async createSimilarity(data: DishSimilarityFormValues): Promise<String> {
    const payload = data.similar_dish_ids.map((dishId) => ({
      dish_id: data.dish_id,
      similar_dish_id: dishId,
    }))

    const payloadData = {
      data: payload
    }

    const response = await apiClient.post<String>(
      '/dishes/similarity/bulk',
      payloadData
    )
    return response.data
  },


  async deleteDishSimilarities(data: DeleteManySimilarityDto) {
    const response = await apiClient.delete('dishes/similarity/bulk', {
      data,
    })
    return response.data
  }



}

