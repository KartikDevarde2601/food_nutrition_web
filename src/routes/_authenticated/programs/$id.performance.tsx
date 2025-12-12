import { createFileRoute } from '@tanstack/react-router'
import { Performance } from '@/features/performance'
import { z } from 'zod'

const performanceSearchSchema = z.object({
  model_one: z.number().int().positive().default(1),
  model_two: z.number().int().positive().default(2),
  groupSimilarDishes: z.number().default(1),
  groupSimilarMeals: z.number().default(1),
  meal_ids: z.array(z.number()).default([]),
})


export const Route = createFileRoute('/_authenticated/programs/$id/performance')({
  validateSearch: performanceSearchSchema,
  component: Performance,
  head: (ctx) => {
    return {
      meta: [
        {
          title: "Performance",
        },
      ],
    };
  },
})

