import z from "zod"


export const dishSimilarityFormSchema = z.object({
  dish_id: z.number().min(1, 'Dish is required'),
  similar_dish_id: z.number().min(1, 'Similar dishes are required'),
})

export type DishSimilarityFormValues = z.infer<typeof dishSimilarityFormSchema>



export type Dish = {
  dish_id: number
  dish_name: string
}

export type DishSimilarity = {
  id: number
  dish1: Dish
  dish2: Dish
}

export type TransformedDish = {
    dish_id: number
    dish_name: string
    similarDishes: Dish[]
}


export type DishIdPair = {
  dishID_1: number
  dishID_2: number
}

export type DeleteManySimilarityDto = {
  pairs: DishIdPair[]
}