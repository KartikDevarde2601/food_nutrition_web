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

// Types for Meal Details
export const IdentifierSchema = z.object({
  dishId: z.union([z.string(), z.number()]),
  weight: z.union([z.string(), z.number()]),
  position: z.string(),
})

export const UserIdentifierSchema = IdentifierSchema.extend({
  dishName: z.string(),
})

export type Identifier = z.infer<typeof IdentifierSchema>
export type UserIdentifier = z.infer<typeof UserIdentifierSchema>

export const ModelResultDishSchema = z.object({
  dish_id: z.number(),
  weight: z.number(),
  position: z.string(),
})

export type ModelResultDish = z.infer<typeof ModelResultDishSchema>

export const ModelResultSchema = z.object({
  model_id: z.string(),
  dishes: z.array(ModelResultDishSchema),
})

export type ModelResult = z.infer<typeof ModelResultSchema>

export const MealDetailSchema = z.object({
  mealId: z.number(),
  image: z.string(),
  modelsResult: z.array(ModelResultSchema),
  adminIdentifierIds: z.array(IdentifierSchema),
  userIdentifiersIds: z.array(IdentifierSchema),
  userIdentifiersNames: z.array(UserIdentifierSchema), 
})

export type MealDetail = z.infer<typeof MealDetailSchema>
