import { useMemo } from 'react'
import { useMealDetailsQuery } from '@/hooks/meals/use-meals-query'
import { useDishesQuery } from '@/hooks/dishes/use-dish-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Identifier } from '../data/schema'
import { MealModelResults } from './meal-model-results'
import { MealUserResults } from './meal-user-results'

interface EditMealProps {
    mealId: string
}

export function EditMeal({ mealId }: EditMealProps) {
    const { data: mealDetails, isLoading: isLoadingMeal, error: mealError } = useMealDetailsQuery(mealId)
    const { data: dishes, isLoading: isLoadingDishes } = useDishesQuery()

    const meal = mealDetails?.[0]

    // Merge identifiers
    const mergedIdentifiers = useMemo(() => {
        if (!meal) return []

        const adminIds = meal.adminIdentifierIds || []
        const userIds = meal.userIdentifiersIds || []

        // Get all unique dish IDs
        const allDishIds = Array.from(new Set([
            ...adminIds.map(i => i.dishId),
            ...userIds.map(i => i.dishId)
        ]))

        return allDishIds.map(dishId => {
            const adminItem = adminIds.find(i => i.dishId === dishId)
            const userItem = userIds.find(i => i.dishId === dishId)

            // Prefer admin item for details if available, otherwise user item
            const item = adminItem || userItem

            if (!item) return null
            return {
                ...item,
                isAdmin: !!adminItem,
                isUser: !!userItem
            }
        }).filter(Boolean) as (Identifier & { isAdmin: boolean; isUser: boolean })[]
    }, [meal])

    if (isLoadingMeal || isLoadingDishes) {
        return <div className="p-4 space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[200px] w-full" />
        </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <div className="space-y-4">
                    <MealModelResults modelsResult={meal.modelsResult} dishes={dishes} />
                    <MealUserResults identifiers={mergedIdentifiers} dishes={dishes} />
                </div>
            </div>


        </div>
    )
}
