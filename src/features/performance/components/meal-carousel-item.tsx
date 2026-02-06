import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { useMealDetailsQuery } from '@/hooks/meals/use-meals-query'
import { useDishesDetailsQuery } from '@/hooks/dishes/use-dish-query'
import { MealDetailsTable } from './meal-details-table'
import { MealNutritionComparison } from './meal-nutrition-comparison'
import { MealDetail, MergeDish } from '../data/schema'
import { TransformedMealDetail } from '@/features/meals/data/schema'

// Helper to transform TransformedMealDetail to MealDetail for comparison
export const transformToMealDetail = (
    data: TransformedMealDetail,
    model1Id: string,
    model2Id: string,
    allDishes: any[]
): MealDetail => {
    console.log('transformealdetails', data)
    console.log(allDishes)
    const dishesMap = new Map<string, MergeDish>()

    // Get dish name helper
    const getDishName = (dishId: string | number) => {
        const dish = allDishes.find(d => String(d.dish_id) === String(dishId))
        if (dish) return dish.dish_name

        // Fallback to searching in userIdentifiersNames
        const userDish = data.userIdentifiersNames.find(d => String(d.dishId) === String(dishId))
        return userDish?.dishName || `Dish ${dishId}`
    }


    // Process Model 1
    const model1Result = data.mergedIdentifierIds.find(m => String(m.model_id) === model1Id)
    if (model1Result) {
        model1Result.dishes.forEach(d => {
            const dishId = String(d.dishId)
            const existing = dishesMap.get(dishId) || {
                dishId,
                dishName: getDishName(dishId),
                userWeight: d.userWeight,
                modeloneWeight: d.aiWeight ? d.aiWeight : 'N/A',
                modeltwoWeight: 'N/A',
                position: d.position,
                tag: d.tag
            }
            if (dishesMap.has(dishId)) {
                existing.modeloneWeight = d.aiWeight
            }
            dishesMap.set(dishId, existing)
        })
    }

    // Process Model 2
    const model2Result = data.mergedIdentifierIds.find(m => String(m.model_id) === model2Id)
    if (model2Result) {
        model2Result.dishes.forEach(d => {
            const dishId = String(d.dishId)
            if (dishesMap.has(dishId)) {
                const existing = dishesMap.get(dishId)!
                existing.modeltwoWeight = d.aiWeight
            } else {
                dishesMap.set(dishId, {
                    dishId,
                    dishName: getDishName(dishId),
                    userWeight: d.userWeight ? d.userWeight : 'N/A',
                    modeloneWeight: 'N/A',
                    modeltwoWeight: d.aiWeight ? d.aiWeight : 'N/A',
                    position: d.position,
                    tag: d.tag
                })
            }
        })
    }

    return {
        mealId: data.mealId,
        image: data.image,
        dishes: Array.from(dishesMap.values())
    }
}

export function MealCarouselItem({
    mealId,
    model1Id,
    model2Id,
    model1Name,
    model2Name,
    allDishes: initialAllDishes
}: {
    mealId: number,
    model1Id: string,
    model2Id: string,
    model1Name: string,
    model2Name: string,
    allDishes: any[]
}) {
    const { data: mealDetailsData, isLoading: isMealLoading } = useMealDetailsQuery(mealId)
    const mealData = mealDetailsData?.[0]

    // Extract all unique dish IDs from this meal
    const dishIds = useMemo(() => {
        if (!mealData) return []
        const ids = new Set<string | number>()
        mealData.mergedIdentifierIds.forEach(m => {
            m.dishes.forEach(d => ids.add(d.dishId))
        })
        return Array.from(ids)
    }, [mealData])

    // Fetch details for these specific dishes to ensure nutrition data is present
    const dishQueries = useDishesDetailsQuery(dishIds)
    const isDishesLoading = dishQueries.some(q => q.isLoading)

    // Combine initialAllDishes with newly fetched dishes
    const combinedDishes = useMemo(() => {
        const fetchedDishes = dishQueries
            .map(q => q.data)
            .filter((d): d is any => !!d)

        // Merge with initial list, prioritizing fresh details
        const map = new Map<number, any>()
        if (initialAllDishes) {
            initialAllDishes.forEach(d => map.set(d.dish_id, d))
        }
        fetchedDishes.forEach(d => map.set(d.dish_id, d))

        return Array.from(map.values())
    }, [initialAllDishes, dishQueries])

    if (isMealLoading || isDishesLoading) {
        return <div className="flex items-center justify-center p-8 h-96"><Loader2 className="animate-spin" /></div>
    }

    if (!mealData) return <div className="p-8 text-center text-muted-foreground">No details found.</div>

    const transformed = transformToMealDetail(mealData, model1Id, model2Id, combinedDishes)

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Image */}
                <div className="w-full flex items-start justify-center">
                    <img
                        src={transformed.image}
                        alt={`Meal ${mealId}`}
                        className="max-w-full max-h-[50vh] w-auto h-auto object-contain rounded-lg border border-border/50 shadow-sm"
                    />
                </div>

                {/* Right: Table */}
                <div className="space-y-4">
                    <MealNutritionComparison
                        dishes={transformed.dishes}
                        allDishes={combinedDishes}
                        modelOneName={model1Name}
                        modelTwoName={model2Name}
                    />
                    <MealDetailsTable
                        data={transformed.dishes}
                        modelOneName={model1Name}
                        modelTwoName={model2Name}
                    />
                </div>
            </div>
        </div>
    )
}
