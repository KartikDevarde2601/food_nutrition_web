import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { DishSimilarity } from '@/features/dish-similarity'


const dishSimilaritySearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/similarity/')({
  validateSearch: dishSimilaritySearchSchema,
  component: DishSimilarity,
  head: (ctx) => {
        return {
            meta: [
                {
                    title: "Dish Similarity",
                },
            ],
        };
    },
})
