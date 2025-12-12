import { createFileRoute } from '@tanstack/react-router'
import { Meals } from '@/features/meals'
import z from 'zod'


const mealSearchSchema = z.object({
    page: z.number().optional().catch(1),
    pageSize: z.number().optional().catch(10),
    filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/programs/$id/meals')({
    validateSearch: mealSearchSchema,
    component: Meals,
    head: (ctx) => {
        return {
            meta: [
                {
                    title: "Meals",
                },
            ],
        };
    },
})

