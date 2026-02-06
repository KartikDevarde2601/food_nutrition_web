// zod-schema.ts
import { z } from 'zod'

/**
 * Schema for a single dish metrics object
 */
export const PerDishMetricSchema = z.object({
  dishName: z.string(),
  ['#dMatch']: z.number().int().nonnegative(),
  ['%dMatch']: z.number(),
  MAE: z.number().nullable(),
  RMSE: z.number().nullable(),
  MAPE: z.number().nullable(),
  m1AvgWeight: z.number().nullable(),
  m2AvgWeight: z.number().nullable(),
  m1Occurrences: z.number().int().nonnegative(),
  m2Occurrences: z.number().int().nonnegative(),
})

/**
 * Schema for the overallMetrics object
 */
export const OverallMetricsSchema = z.object({
  ['#dMatch']: z.number().int().nonnegative(),
  ['%dMatch']: z.number(),
  MAE: z.number(),
  RMSE: z.number(),
  MAPE: z.number(),
  totalUniqueDishes: z.number().int().nonnegative(),
})

/**
 * Root schema for the whole payload
 */
export const DataSchema = z.object({
  modelId_one: z.string(),
  modelId_two: z.string(),
  overallMetrics: OverallMetricsSchema,
  perDishMetrics: z.array(PerDishMetricSchema),
})


export const mergeDishes = z.object({
  dishId: z.union([z.string(), z.number()]),
  dishName: z.string(),
  userWeight: z.union([z.string(), z.number()]).optional(),
  modeloneWeight: z.union([z.string(), z.number()]).optional(),
  modeltwoWeight: z.union([z.string(), z.number()]).optional(),
  position: z.string().optional(),
  tag: z.enum(['user', 'ai', 'both']).optional(),
})

export type MergeDish = z.infer<typeof mergeDishes>

export const MealDetails = z.object({
  mealId: z.number(),
  image: z.string(),
  dishes: z.array(mergeDishes)
})

export type MealDetail = z.infer<typeof MealDetails>

/**
 * TypeScript types inferred from the schemas
 */
export type PerDishMetric = z.infer<typeof PerDishMetricSchema>
export type OverallMetrics = z.infer<typeof OverallMetricsSchema>
export type DataType = z.infer<typeof DataSchema>
