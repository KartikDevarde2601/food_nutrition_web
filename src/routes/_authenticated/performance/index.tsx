import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Performance } from '@/features/performance'

const performanceSearchSchema = z.object({})

export const Route = createFileRoute('/_authenticated/performance/')({
  validateSearch: performanceSearchSchema,
  component: Performance,
})
