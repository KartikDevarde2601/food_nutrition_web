import { z } from 'zod'

// Model schema
export const modelSchema = z.object({
  model_id: z.number(),
  name: z.string(),
  description: z.string(),
})

export type Model = z.infer<typeof modelSchema>

export const programSchema = z.object({
  id: z.number(), // or z.string() if you convert IDs to strings
  name: z.string(),
  description: z.string(),

  earliestDate: z.union([z.string(), z.date()]).optional(),
  latestDate: z.union([z.string(), z.date()]).optional(),

  defaultModel: modelSchema.optional(),
  dishes: z.number().optional(),
  meals: z.number().optional(),
})

export type ProgramDetail = z.infer<typeof programSchema>

export type Program = z.infer<typeof programSchema>

export const programFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  default_model_id: z.number().optional(),
})

export type ProgramFormValues = z.infer<typeof programFormSchema>
