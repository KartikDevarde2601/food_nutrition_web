import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { mealsApi } from '@/lib/api/meal.api'
import { Meal, MealDetail, TransformedMealDetail, TransformedIdentifier, ModelAndUserIdentifier } from '@/features/meals/data/schema'





const tranformation = (data: MealDetail[]): TransformedMealDetail[] => {
  // Helper function to compute tag based on userWeight and aiWeight
  const computeTag = (userWeight: string | number | undefined, aiWeight: string | number | undefined): 'user' | 'ai' | 'both' => {
    const hasUser = userWeight !== undefined && userWeight !== 0 && userWeight !== ''
    const hasAi = aiWeight !== undefined && aiWeight !== 0 && aiWeight !== ''
    if (hasUser && hasAi) return 'both'
    if (hasUser) return 'user'
    return 'ai'
  }

  return data.map((meal) => {
    // Step 1: Create base union of admin + user identifiers
    // Use number keys for consistent comparison (dishId can be string or number)
    const baseIdentifierMap = new Map<number, TransformedIdentifier>()

    // Add admin identifiers first (set userWeight, aiWeight = undefined)
    meal.adminIdentifierIds.forEach((identifier) => {
      const dishIdKey = Number(identifier.dishId)
      if (!baseIdentifierMap.has(dishIdKey)) {
        baseIdentifierMap.set(dishIdKey, {
          dishId: identifier.dishId,
          userWeight: identifier.weight || 0,
          aiWeight: undefined,
          position: identifier.position,
          tag: 'user', // Initially set as user
        })
      }
    })

    // Add user identifiers (only if dishId not already present)
    meal.userIdentifiersIds.forEach((identifier) => {
      const dishIdKey = Number(identifier.dishId)
      if (!baseIdentifierMap.has(dishIdKey)) {
        baseIdentifierMap.set(dishIdKey, {
          dishId: identifier.dishId,
          userWeight: identifier.weight || 0,
          aiWeight: undefined,
          position: identifier.position,
          tag: 'user', // Initially set as user
        })
      }
    })

    // Step 2: For EACH model, create a separate union with model dishes
    const mergedIdentifierIds: ModelAndUserIdentifier[] = meal.modelsResult.map((modelResult) => {
      // Clone the base map for this model
      const modelIdentifierMap = new Map<number, TransformedIdentifier>(baseIdentifierMap)

      // Union with this model's dishes
      modelResult.dishes.forEach((dish) => {
        const dishIdKey = Number(dish.dish_id)
        if (modelIdentifierMap.has(dishIdKey)) {
          // Update existing entry with aiWeight from this model
          const existing = modelIdentifierMap.get(dishIdKey)!
          modelIdentifierMap.set(dishIdKey, {
            ...existing,
            aiWeight: dish.weight,
            tag: 'both', // User already had this dish, now AI also has it
          })
        } else {
          // Add new entry with aiWeight, userWeight = undefined
          modelIdentifierMap.set(dishIdKey, {
            dishId: dish.dish_id,
            userWeight: 0,
            aiWeight: dish.weight,
            position: dish.position,
            tag: 'ai', // Only AI has this dish
          })
        }
      })

      // Final pass: recompute tags for all dishes to ensure correctness
      const dishesWithTags = Array.from(modelIdentifierMap.values()).map((dish) => ({
        ...dish,
        tag: computeTag(dish.userWeight, dish.aiWeight),
      }))

      return {
        model_id: modelResult.model_id,
        dishes: dishesWithTags,
      }
    })

    return {
      mealId: meal.mealId,
      image: meal.image,
      mergedIdentifierIds,
      userIdentifiersNames: meal.userIdentifiersNames,
      feedback: meal.feedback,
    }
  })
}


export const mealsKeys = {
  all: ['meals'] as const,
  lists: () => [...mealsKeys.all, 'list'] as const,
  list: () => [...mealsKeys.lists()] as const,
  details: () => [...mealsKeys.all, 'details'] as const,
  detail: (id: string | number) => [...mealsKeys.details(), id] as const,
}

// Hook to fetch all meals
export function useMealsQuery(
  params?: {
    program_id?: number
    weightFilter?: {
      mode?: 'less' | 'greater' | 'between'
      min?: number
      max?: number
    }
  },
  options?: Omit<UseQueryOptions<Meal[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Meal[], Error>({
    queryKey: [
      ...mealsKeys.list(),
      params?.program_id,
      params?.weightFilter?.mode,
      params?.weightFilter?.min,
      params?.weightFilter?.max,
    ] as const,
    queryFn: () => mealsApi.getMeals(params),
    ...options,
  })
}

// Hook to fetch a single meal by ID
export function useMealQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<Meal, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Meal, Error>({
    queryKey: mealsKeys.detail(id),
    queryFn: () => mealsApi.getMeal(id),
    enabled: !!id,
    ...options,
  })
}

export function useMealDetailsQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<MealDetail[], Error, TransformedMealDetail[]>, 'queryKey' | 'queryFn' | 'select'>
) {
  return useQuery<MealDetail[], Error, TransformedMealDetail[]>({
    queryKey: mealsKeys.detail(id),
    queryFn: () => mealsApi.getMealDetails(id),
    enabled: !!id,
    select: (data: MealDetail[]): TransformedMealDetail[] => {
      return tranformation(data)
    },
    ...options,
  })
}

