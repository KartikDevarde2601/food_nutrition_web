import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const dishSchema = z.object({
  dish_id: z.number(),
  dish_name: z.string(),
  description: z.string(),
  image_url: z.string(),
  carbs_g: z.number(),
  protein_g: z.number(),
  fat_g: z.number(),
  added_by: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Dish = z.infer<typeof dishSchema>

export const dishFormSchema = z.object({
  dish_id: z.number().optional(),
  dish_name: z.string(),
  description: z.string(),
  image: z.union([z.instanceof(File), z.string()]).optional().nullable(),
  carbs_g: z.number(),
  protein_g: z.number(),
  fat_g: z.number(),
  added_by: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type DishForm = z.infer<typeof dishFormSchema>
