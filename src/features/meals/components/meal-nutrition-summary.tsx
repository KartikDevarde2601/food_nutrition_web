import { useMemo } from 'react'
import { Identifier } from '../data/schema'
import { Dish } from '@/features/dishes/data/schema'

interface MealNutritionSummaryProps {
    mergedIdentifiers: (Identifier & { isAdmin: boolean; isUser: boolean })[]
    dishes: Dish[] | undefined
}

export function MealNutritionSummary({ mergedIdentifiers, dishes }: MealNutritionSummaryProps) {
    const totalNutrition = useMemo(() => {
        if (!mergedIdentifiers || !dishes) return null

        return mergedIdentifiers.reduce((acc: { calories: number; protein: number; carbs: number; fat: number }, item) => {
            const dish = dishes.find(d => d.dish_id === Number(item.dishId))
            if (!dish) return acc

            const weight = Number(item.weight) || 0
            const ratio = weight / 100
            return {
                calories: acc.calories + ((dish.carbs_g * 4) + (dish.protein_g * 4) + (dish.fat_g * 9)) * ratio,
                protein: acc.protein + (dish.protein_g * ratio),
                carbs: acc.carbs + (dish.carbs_g * ratio),
                fat: acc.fat + (dish.fat_g * ratio)
            }
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
    }, [mergedIdentifiers, dishes])

    if (!totalNutrition) return null

    return (
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col p-2 bg-secondary/20 rounded-lg">
                <span className="text-xs text-muted-foreground uppercase font-bold">Calories</span>
                <span className="text-lg font-bold">{Math.round(totalNutrition.calories)}</span>
            </div>
            <div className="flex flex-col p-2 bg-secondary/20 rounded-lg">
                <span className="text-xs text-muted-foreground uppercase font-bold">Protein</span>
                <span className="text-lg font-bold">{Math.round(totalNutrition.protein)}g</span>
            </div>
            <div className="flex flex-col p-2 bg-secondary/20 rounded-lg">
                <span className="text-xs text-muted-foreground uppercase font-bold">Carbs</span>
                <span className="text-lg font-bold">{Math.round(totalNutrition.carbs)}g</span>
            </div>
            <div className="flex flex-col p-2 bg-secondary/20 rounded-lg">
                <span className="text-xs text-muted-foreground uppercase font-bold">Fat</span>
                <span className="text-lg font-bold">{Math.round(totalNutrition.fat)}g</span>
            </div>
        </div>
    )
}
