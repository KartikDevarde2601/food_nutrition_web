import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const ModelSchema = z.object({
  model_id: z.number(),
  name: z.string(),
})

export type Model = z.infer<typeof ModelSchema>


export const MealSchema = z.object({
  mealId: z.number(),
  imageUrl: z.string(),
  userId: z.number(),
  createdAt: z.string(),
  mealInferences: z.array(z.object({
    model: ModelSchema
  }))
})

export type Meal = z.infer<typeof MealSchema>

export const MealFormSchema = z.object({
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
})

export type MealForm = z.infer<typeof MealFormSchema>
