import React, { useMemo } from 'react'
import { ModelAndUserIdentifier } from '../data/schema'
import { Dish } from '@/features/dishes/data/schema'
import { Egg, Flame, Nut, Wheat } from 'lucide-react'
import { useMealFormContext } from '../context/meal-form-provider'

interface MealNutritionSummaryProps {
    mergedIdentifiers: ModelAndUserIdentifier
    dishes: Dish[] | undefined
    dishesMap?: Map<number, Dish>
    title?: string
    type: 'user' | 'ai'
}

export const MealNutritionSummary = React.memo(function MealNutritionSummary({
    mergedIdentifiers,
    dishes,
    dishesMap,
    title,
    type
}: MealNutritionSummaryProps) {
    const { getDishes } = useMealFormContext()

    const currentDishes = getDishes(String(mergedIdentifiers.model_id), mergedIdentifiers.dishes)

    const totalNutrition = useMemo(() => {
        if (!dishes && !dishesMap) return null
        const dishData = currentDishes
        if (!dishData) return null

        return dishData.reduce(
            (acc: { calories: number; protein: number; carbs: number; fat: number }, item) => {
                // Use map for O(1) lookup if available, otherwise fall back to find
                const dish = dishesMap
                    ? dishesMap.get(Number(item.dishId))
                    : dishes?.find(d => d.dish_id === Number(item.dishId))
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
    }, [currentDishes, dishes, dishesMap, type])

    if (!totalNutrition) return null

    const stats = [
        {
            name: 'Calories',
            value: Math.round(totalNutrition.calories) + " " + 'kcal',
            icon: Flame,
            color: 'text-orange-500'
        },
        {
            name: 'Protein',
            value: Math.round(totalNutrition.protein) + 'g',
            icon: Egg,
            color: 'text-red-500'
        },
        {
            name: 'Carbs',
            value: Math.round(totalNutrition.carbs) + 'g',
            icon: Wheat,
            color: 'text-amber-500'
        },
        {
            name: 'Fat',
            value: Math.round(totalNutrition.fat) + 'g',
            icon: Nut,
            color: 'text-green-500'
        }
    ]

    return (
        <div className="w-full">
            {title && <h3 className="text-xs font-semibold mb-2 text-muted-foreground/70 uppercase tracking-wider">{title}</h3>}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <div key={i} className="flex items-center gap-2.5 bg-muted/40 px-4 py-2 rounded-xl border border-border/40 w-full">
                            <div className="flex items-center justify-center w-8 h-8 flex-shrink-0 rounded-lg bg-background shadow-sm border border-border/50">
                                <Icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <div className="flex flex-col min-w-0 py-0.5">
                                <span className="text-[11px] font-semibold text-muted-foreground/80 leading-tight truncate">{stat.name}</span>
                                <span className="text-[15px] font-bold tracking-tight leading-tight">{stat.value}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
})
