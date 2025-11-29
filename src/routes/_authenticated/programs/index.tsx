import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Programs } from '@/features/programs'

const programSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/programs/')({
  validateSearch: programSearchSchema,
  component: Programs,
})
