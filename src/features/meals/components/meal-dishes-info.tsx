import { useMemo, useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { useDishesQuery } from '@/hooks/dishes'
import { useDishesDetailsQuery } from '@/hooks/dishes/use-dish-query'
import { useMealDetailsQuery } from '@/hooks/meals/use-meals-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MealFormProvider } from '../context/meal-form-provider'
import { MealLoadingSkeleton } from './meal-loading-skeleton'
import { MealModelResults } from './meal-model-results'

interface MealDishesInfoProps {
  mealId: string
}

export function MealDishesInfo({ mealId }: MealDishesInfoProps) {
  const {
    data: mealDetails,
    isLoading: isLoadingMeal,
    error: mealError,
  } = useMealDetailsQuery(mealId)

  // Consolidated dishes query at parent level
  const { data: allDishesData, isLoading: isLoadingDishes } = useDishesQuery({
    limit: 100,
  })
  const allDishes = allDishesData?.data || []

  // State for selected model - lifted from MealModelResults
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)

  const meal = mealDetails?.[0]

  // Extract dish IDs for parallel fetching
  const dishIds = useMemo(() => {
    if (!meal) return []
    const mergedIds = meal.mergedIdentifierIds.map((i) =>
      i.dishes.map((d) => d.dishId)
    )
    return Array.from(new Set([...mergedIds.flat()]))
  }, [meal])

  // Parallel fetch dish details
  const dishQueries = useDishesDetailsQuery(dishIds)
  const isLoadingDishDetails = dishQueries.some((q) => q.isLoading)

  // Set initial selected model when meal loads
  useEffect(() => {
    if (meal && selectedModelId === null) {
      // Find first model that isn't model_id = 1
      const firstModel = meal.mergedIdentifierIds.find(
        (m) => Number(m.model_id) !== 1
      )
      if (firstModel) {
        setSelectedModelId(String(firstModel.model_id))
      }
    }
  }, [meal, selectedModelId])

  if (
    isLoadingMeal ||
    isLoadingDishes ||
    (dishIds.length > 0 && isLoadingDishDetails)
  ) {
    return <MealLoadingSkeleton />
  }

  if (mealError) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load meal details.</AlertDescription>
      </Alert>
    )
  }

  if (!meal) {
    return (
      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>Meal not found.</AlertDescription>
      </Alert>
    )
  }

  return (
    <MealFormProvider>
      <div className='p-4'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Left Column: Image + Nutrition Summaries */}

          <div className='mt-6 flex w-full items-start justify-center'>
            <img
              src={meal.image}
              alt={`Meal ${meal.mealId}`}
              className='border-border/50 h-auto max-h-[50vh] w-auto max-w-full rounded-lg border object-contain shadow-sm'
            />
          </div>

          {/* Right Column: Model Results */}
          <div className='space-y-4'>
            <MealModelResults
              modelsResult={meal.mergedIdentifierIds}
              feedback={meal.feedback}
              meal_id={meal.mealId}
              selectedModelId={selectedModelId}
              onModelChange={setSelectedModelId}
              allDishes={allDishes}
            />
          </div>
        </div>
      </div>
    </MealFormProvider>
  )
}
