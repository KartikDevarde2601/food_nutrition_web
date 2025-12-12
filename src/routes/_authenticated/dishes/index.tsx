import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Dishes } from '@/features/dishes'

const dishSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/dishes/')({
  validateSearch: dishSearchSchema,
  component: Dishes,
  head: (ctx) => {
    return {
      meta: [
        {
          title: "Dishes",
        },
      ],
    };
  },
})
