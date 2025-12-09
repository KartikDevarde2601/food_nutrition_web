import { useMemo } from 'react'
import { Identifier } from '../data/schema'
import { Dish } from '@/features/dishes/data/schema'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Egg, Flame, Nut, Wheat } from 'lucide-react'

interface MealNutritionSummaryProps {
    mergedIdentifiers?: (Identifier & { isAdmin: boolean; isUser: boolean })[]
    modelDishes?: { dish_id: string | number; weight: number }[]
    dishes: Dish[] | undefined
    title?: string
}

export function MealNutritionSummary({ mergedIdentifiers, modelDishes, dishes, title }: MealNutritionSummaryProps) {
    const totalNutrition = useMemo(() => {
        if (!dishes) return null
        const dishData = mergedIdentifiers || modelDishes
        if (!dishData) return null

        return dishData.reduce(
            (acc: { calories: number; protein: number; carbs: number; fat: number }, item) => {
                const dishId = 'dishId' in item ? item.dishId : item.dish_id
                const dish = dishes.find(d => d.dish_id === Number(dishId))
                if (!dish) return acc

                const weight = Number(item.weight) || 0
                const ratio = weight / 100
                return {
                    calories: acc.calories + ((dish.carbs_g * 4) + (dish.protein_g * 4) + (dish.fat_g * 9)) * ratio,
                    protein: acc.protein + dish.protein_g * ratio,
                    carbs: acc.carbs + dish.carbs_g * ratio,
                    fat: acc.fat + dish.fat_g * ratio
                }
            },
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        )
    }, [mergedIdentifiers, modelDishes, dishes])

    if (!totalNutrition) return null

    const stats = [
        {
            name: 'Calories',
            value: Math.round(totalNutrition.calories) + " " + 'kcal',
            icon: Flame,
            footer: 'Total energy'
        },
        {
            name: 'Protein',
            value: Math.round(totalNutrition.protein) + 'g',
            icon: Egg,
            footer: 'Muscle building'
        },
        {
            name: 'Carbs',
            value: Math.round(totalNutrition.carbs) + 'g',
            icon: Wheat,
            footer: 'Energy source'
        },
        {
            name: 'Fat',
            value: Math.round(totalNutrition.fat) + 'g',
            icon: Nut,
            footer: 'Healthy fats'
        }
    ]

    return (
        <div className="w-full">
            {title && <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{title}</h3>}
            <div className="flex flex-wrap lg:flex-nowrap gap-2">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card
                            key={i}
                            className="w-1/2 sm:w-1/2 lg:w-auto flex-1 p-2"
                        >
                            <CardHeader className="flex items-center justify-between pb-1">
                                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="py-1">
                                <div className="text-lg font-bold text-center">{stat.value}</div>
                            </CardContent>
                            <CardFooter>
                                <div className="text-xs text-center text-muted-foreground pb-1">{stat.footer}</div>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
