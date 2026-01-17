import { useMemo } from 'react'
import { ModelAndUserIdentifier } from '../data/schema'
import { Dish } from '@/features/dishes/data/schema'
import { MetricCard } from '@/components/metric-card'
import { Egg, Flame, Nut, Wheat } from 'lucide-react'
import { useMealFormContext } from '../context/meal-form-provider'

interface MealNutritionSummaryProps {
    mergedIdentifiers: ModelAndUserIdentifier
    dishes: Dish[] | undefined
    title?: string
    type: 'user' | 'ai'
}

export function MealNutritionSummary({ mergedIdentifiers, dishes, title, type }: MealNutritionSummaryProps) {
    const { getDishes } = useMealFormContext()

    const currentDishes = getDishes(String(mergedIdentifiers.model_id), mergedIdentifiers.dishes)

    const totalNutrition = useMemo(() => {
        if (!dishes) return null
        const dishData = currentDishes
        if (!dishData) return null

        return dishData.reduce(
            (acc: { calories: number; protein: number; carbs: number; fat: number }, item) => {
                const dish = dishes.find(d => d.dish_id === Number(item.dishId))
                if (!dish) return acc
                let weight = 0
                if (type === 'user') {
                    weight = Number(item.userWeight) || 0
                } else {
                    weight = Number(item.aiWeight) || 0
                }
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
    }, [currentDishes, dishes, type])

    if (!totalNutrition) return null

    const stats = [
        {
            name: 'Calories',
            value: Math.round(totalNutrition.calories) + " " + 'kcal',
            icon: Flame,
            footer: 'Calories'
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <MetricCard
                            key={i}
                            title={stat.name}
                            icon={Icon}
                            content={
                                <div className="flex-col h-full flex  justify-between">
                                    <div className="text-xl font-bold">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.footer}
                                    </p>
                                </div>
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
}
