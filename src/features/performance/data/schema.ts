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

/**
 * TypeScript types inferred from the schemas
 */
export type PerDishMetric = z.infer<typeof PerDishMetricSchema>
export type OverallMetrics = z.infer<typeof OverallMetricsSchema>
export type DataType = z.infer<typeof DataSchema>
