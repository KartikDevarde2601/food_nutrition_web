import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { useDishesDetailsQuery } from '@/hooks/dishes/use-dish-query'
import { useMealDetailsQuery } from '@/hooks/meals/use-meals-query'
import { type Dish } from '@/features/dishes/data/schema'
import { type TransformedMealDetail } from '@/features/meals/data/schema'
import { type MealDetail, type MergeDish } from '../data/schema'
import { MealDetailsTable } from './meal-details-table'
import { MealNutritionComparison } from './meal-nutrition-comparison'

// Helper to transform TransformedMealDetail to MealDetail for comparison
const transformToMealDetail = (
  data: TransformedMealDetail,
  model1Id: string,
  model2Id: string,
  allDishes: Dish[]
): MealDetail => {
  const dishesMap = new Map<string, MergeDish>()

  // Helper to get dish name
  const getDishName = (dishId: string | number) => {
    const dish = allDishes.find((d) => String(d.dish_id) === String(dishId))
    if (dish) return dish.dish_name

    const userDish = data.userIdentifiersNames.find(
      (d) => String(d.dishId) === String(dishId)
    )
    return userDish?.dishName || `Dish ${dishId}`
  }

  // Helper to validate weights (allows 0, but replaces null/undefined/'' with 'N/A')
  const formatWeight = (val: number | string | null | undefined) =>
    val !== null && val !== undefined && val !== '' ? val : 'N/A'

  // Process Model 1
  const model1Result = data.mergedIdentifierIds.find(
    (m) => String(m.model_id) === model1Id
  )
  if (model1Result) {
    model1Result.dishes.forEach((d) => {
      const dishId = String(d.dishId)
      dishesMap.set(dishId, {
        dishId,
        dishName: getDishName(dishId),
        userWeight: formatWeight(d.userWeight),
        modeloneWeight: formatWeight(d.aiWeight),
        modeltwoWeight: 'N/A', // Default for now
        position: d.position,
        tag: d.tag,
      })
    })
  }

  // Process Model 2
  const model2Result = data.mergedIdentifierIds.find(
    (m) => String(m.model_id) === model2Id
  )
  if (model2Result) {
    model2Result.dishes.forEach((d) => {
      const dishId = String(d.dishId)
      const existing = dishesMap.get(dishId)

      if (existing) {
        existing.modeltwoWeight = formatWeight(d.aiWeight)
      } else {
        dishesMap.set(dishId, {
          dishId,
          dishName: getDishName(dishId),
          userWeight: formatWeight(d.userWeight),
          modeloneWeight: 'N/A',
          modeltwoWeight: formatWeight(d.aiWeight),
          position: d.position,
          tag: d.tag,
        })
      }
    })
  }

  return {
    ...data,
    dishes: Array.from(dishesMap.values()),
  }
}

export function MealCarouselItem({
  mealId,
  model1Id,
  model2Id,
  model1Name,
  model2Name,
  allDishes: initialAllDishes,
}: {
  mealId: number
  model1Id: string
  model2Id: string
  model1Name: string
  model2Name: string
  allDishes: Dish[]
}) {
  const { data: mealDetailsData, isLoading: isMealLoading } =
    useMealDetailsQuery(mealId)
  const mealData = mealDetailsData?.[0]

  // Extract all unique dish IDs from this meal
  const dishIds = useMemo(() => {
    if (!mealData) return []
    const ids = new Set<string | number>()
    mealData.mergedIdentifierIds.forEach((m) => {
      m.dishes.forEach((d) => ids.add(d.dishId))
    })
    return Array.from(ids)
  }, [mealData])

  // Fetch details for these specific dishes to ensure nutrition data is present
  const dishQueries = useDishesDetailsQuery(dishIds)
  const isDishesLoading = dishQueries.some((q) => q.isLoading)

  // Combine initialAllDishes with newly fetched dishes
  const combinedDishes = useMemo(() => {
    const fetchedDishes = dishQueries
      .map((q) => q.data)
      .filter((d): d is any => !!d)

    // Merge with initial list, prioritizing fresh details
    const map = new Map<number, any>()
    if (initialAllDishes) {
      initialAllDishes.forEach((d) => map.set(d.dish_id, d))
    }
    fetchedDishes.forEach((d) => map.set(d.dish_id, d))

    return Array.from(map.values())
  }, [initialAllDishes, dishQueries])

  if (isMealLoading || isDishesLoading) {
    return (
      <div className='flex h-96 items-center justify-center p-8'>
        <Loader2 className='animate-spin' />
      </div>
    )
  }

  if (!mealData)
    return (
      <div className='text-muted-foreground p-8 text-center'>
        No details found.
      </div>
    )

  const transformed = transformToMealDetail(
    mealData,
    model1Id,
    model2Id,
    combinedDishes
  )

  return (
    <div className='max-h-[80vh] overflow-y-auto p-4'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Left: Image */}
        <div className='flex w-full items-center justify-center'>
          <img
            src={transformed.image}
            alt={`Meal ${mealId}`}
            className='border-border/50 h-auto max-h-[50vh] w-auto max-w-full rounded-lg border object-contain shadow-sm'
          />
        </div>

        {/* Right: Table */}
        <div className='space-y-4'>
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
