import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Meals } from '@/features/meals'

const mealSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
  program_id: z.number().optional(),
})

export const Route = createFileRoute('/_authenticated/meals/')({
  validateSearch: mealSearchSchema,
  component: Meals,
})
