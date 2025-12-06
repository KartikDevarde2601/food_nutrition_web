import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Performance } from '@/features/performance'

const performanceSearchSchema = z.object({
  model_one: z.number().int().positive().default(1),
  model_two: z.number().int().positive().default(2),
  groupSimilarDishes: z.number().default(1),
  groupSimilarMeals: z.number().default(1),
  program_id: z.number(),
  meal_ids: z.array(z.number()).default([]),
})



export const Route = createFileRoute('/_authenticated/performance/')({
  validateSearch: performanceSearchSchema,
  component: Performance,
})
