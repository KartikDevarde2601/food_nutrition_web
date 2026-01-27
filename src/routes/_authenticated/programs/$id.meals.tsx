import { createFileRoute } from '@tanstack/react-router'
import { Meals } from '@/features/meals'
import z from 'zod'


const mealSearchSchema = z.object({
    page: z.number().optional().catch(1),
    pageSize: z.number().optional().catch(10),
    filter: z.string().optional().catch(''),
    view: z.enum(['grid', 'list']).default('grid'),
    weightfilter: z.enum(['less', 'greater', 'between']).optional().catch('greater'),
    weightMin: z.number().optional().catch(0),
    weightMax: z.number().optional().catch(10000),
})

export const Route = createFileRoute('/_authenticated/programs/$id/meals')({
    validateSearch: mealSearchSchema,
    component: Meals,
    head: () => {
        return {
            meta: [
                {
                    title: "Meals",
                },
            ],
        };
    },
})

