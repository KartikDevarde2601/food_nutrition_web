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
  program_id: z.number({
    message: 'Program is required',
  }),
  feedback: z.string().optional(),
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

// Schema for transformed identifier with userWeight and aiWeight
export const TransformedIdentifierSchema = z.object({
  dishId: z.union([z.string(), z.number()]),
  userWeight: z.union([z.string(), z.number()]).optional(),
  aiWeight: z.union([z.string(), z.number()]).optional(),
  position: z.string(),
  tag: z.enum(['user', 'ai', 'both']).optional(),
})

export const MealCorrectionPayloadSchema = z.object({
  meal_id: z.number(),
  dishCorrection: z.array(TransformedIdentifierSchema),
})

export type MealCorrectionPayload = z.infer<typeof MealCorrectionPayloadSchema>

export type TransformedIdentifier = z.infer<typeof TransformedIdentifierSchema>

// Schema for each model's merged dishes (model dishes + user identifiers)
export const ModelAndUserIdentifierSchema = z.object({
  model_id: z.string(),
  dishes: z.array(TransformedIdentifierSchema),
})

export type ModelAndUserIdentifier = z.infer<typeof ModelAndUserIdentifierSchema>

// Schema for transformed meal detail with merged data
export const TransformedMealDetailSchema = z.object({
  mealId: z.number(),
  image: z.string(),
  mergedIdentifierIds: z.array(ModelAndUserIdentifierSchema),
  userIdentifiersNames: z.array(UserIdentifierSchema),
})

export type MealDetail = z.infer<typeof MealDetailSchema>
export type TransformedMealDetail = z.infer<typeof TransformedMealDetailSchema>
