import { useMemo } from 'react'
import { useMealDetailsQuery } from '@/hooks/meals/use-meals-query'
import { useDishesDetailsQuery } from '@/hooks/dishes/use-dish-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

import { MealLoadingSkeleton } from './meal-loading-skeleton'
import { MealModelResults } from './meal-model-results'

interface MealDishesInfoProps {
    mealId: string
}

export function MealDishesInfo({ mealId }: MealDishesInfoProps) {
    const { data: mealDetails, isLoading: isLoadingMeal, error: mealError } = useMealDetailsQuery(mealId)



    const meal = mealDetails?.[0]

    // Extract dish IDs for parallel fetching
    const dishIds = useMemo(() => {
        if (!meal) return []
        const mergedIds = meal.mergedIdentifierIds.map(i => i.dishes.map(d => d.dishId))
        return Array.from(new Set([
            ...mergedIds.flat(),
        ]))
    }, [meal])

    // Parallel fetch dish details
    const dishQueries = useDishesDetailsQuery(dishIds)
    const isLoadingDishes = dishQueries.some(q => q.isLoading)
    // const dishesData = useMemo(() => dishQueries.map(q => q.data).filter(Boolean) as Dish[], [dishQueries])

    if (isLoadingMeal || (dishIds.length > 0 && isLoadingDishes)) {
        return <MealLoadingSkeleton />
    }

    if (mealError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load meal details.
                </AlertDescription>
            </Alert>
        )
    }

    if (!meal) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>
                    Meal not found.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="h-full">
                    <div className="w-full h-full min-h-[400px] overflow-hidden rounded-md relative">
                        <img
                            src={meal.image}
                            alt={`Meal ${meal.mealId}`}
                            className="absolute inset-0 w-full h-full object-cover rounded-md"
                        />
                    </div>
                </div>

                {/* Right Column: Two Tables (Takes 50% width) */}
                <div className="space-y-4 ">
                    <MealModelResults modelsResult={meal.mergedIdentifierIds} feedback={meal.feedback} meal_id={meal.mealId} />
                </div>
            </div>
        </div>
    )
}
