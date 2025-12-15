import { useMemo } from 'react'
import { useMealDetailsQuery } from '@/hooks/meals/use-meals-query'
import { useDishesDetailsQuery } from '@/hooks/dishes/use-dish-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Dish } from '@/features/dishes/data/schema'
import { MealModelResults } from './meal-model-results'
import { MealUserResults } from './meal-user-results'
import { MealLoadingSkeleton } from './meal-loading-skeleton'
import { Identifier } from '../data/schema'

interface EditMealProps {
    mealId: string
}

export function EditMeal({ mealId }: EditMealProps) {
    const { data: mealDetails, isLoading: isLoadingMeal, error: mealError } = useMealDetailsQuery(mealId)

    const meal = mealDetails?.[0]

    // Extract dish IDs for parallel fetching
    const dishIds = useMemo(() => {
        if (!meal) return []
        const adminIds = meal.adminIdentifierIds || []
        const userIds = meal.userIdentifiersIds || []
        const modelIds = meal.modelsResult?.map((m) => m.dishes.map(d => d.dish_id)) || []
        return Array.from(new Set([
            ...adminIds.map(i => i.dishId),
            ...userIds.map(i => i.dishId),
            ...modelIds.flat()
        ]))
    }, [meal])

    // Parallel fetch dish details
    const dishQueries = useDishesDetailsQuery(dishIds)
    const isLoadingDishes = dishQueries.some(q => q.isLoading)
    const dishesData = useMemo(() => dishQueries.map(q => q.data).filter(Boolean) as Dish[], [dishQueries])

    // Merge identifiers
    const mergedIdentifiers = useMemo(() => {
        if (!meal) return []

        const adminIds = meal.adminIdentifierIds || []
        const userIds = meal.userIdentifiersIds || []

        const identifierMap = new Map()
        adminIds.forEach(id => identifierMap.set(id.dishId, id))
        userIds.forEach(id => identifierMap.set(id.dishId, id))

        return Array.from(identifierMap.values()) as Identifier[]
    }, [meal])

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
                    <MealModelResults modelsResult={meal.modelsResult} dishes={dishesData} />
                    <MealUserResults identifiers={mergedIdentifiers} meal_id={meal.mealId} />
                </div>
            </div>
        </div>
    )
}
