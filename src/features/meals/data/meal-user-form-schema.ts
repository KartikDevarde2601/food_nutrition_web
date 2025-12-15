import { z } from 'zod'

export const userIdentifierFormSchema = z.object({
    dishId: z.union([z.string(), z.number()]).refine(
        (val) => val !== '' && val !== 0,
        { message: 'Please select a dish' }
    ),
    weight: z.union([z.string(), z.number()]).refine(
        (val) => {
            const num = typeof val === 'string' ? parseFloat(val) : val
            return !isNaN(num) && num > 0
        },
        { message: 'Weight must be a positive number' }
    ),
    position: z.string().min(1, 'Position is required'),
})

export const mealUserFormSchema = z.object({
    identifiers: z.array(userIdentifierFormSchema),
})

export type UserIdentifierForm = z.infer<typeof userIdentifierFormSchema>
export type MealUserForm = z.infer<typeof mealUserFormSchema>
