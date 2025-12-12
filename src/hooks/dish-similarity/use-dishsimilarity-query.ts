import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { DishSimilarityApi } from '@/lib/api/dishes-similarity.api'
import {
  Dish,
  DishSimilarity,
  TransformedDish,
} from '@/features/dish-similarity/data/schema'

export function transformDishPairs(data: DishSimilarity[]): TransformedDish[] {
  const reversesimilarity = data.map((similarity) => {
    const dish1 = similarity.dish1
    const dish2 = similarity.dish2
    return {
      ...similarity,
      dish1: dish2,
      dish2: dish1,
    }
  })

  const mergeData = [...data, ...reversesimilarity]

  const map = new Map<
    number,
    {
      dish_id: number
      dish_name: string
      similarDishes: Dish[]
    }
  >()

  for (const { dish1, dish2 } of mergeData) {
    if (!map.has(dish1.dish_id)) {
      map.set(dish1.dish_id, {
        dish_id: dish1.dish_id,
        dish_name: dish1.dish_name,
        similarDishes: [],
      })
    }
    map.get(dish1.dish_id)!.similarDishes.push(dish2)
  }

  return Array.from(map.values())
    .sort((a, b) => a.dish_name.localeCompare(b.dish_name))
    .map((item) => ({
      ...item,
      similarDishes: item.similarDishes.sort((a, b) =>
        a.dish_name.localeCompare(b.dish_name)
      ),
    }))
}

export const dishsimilarityKeys = {
  all: ['dish-similarity'] as const,
  lists: () => [...dishsimilarityKeys.all, 'list'] as const,
  list: () => [...dishsimilarityKeys.lists()] as const,
  details: () => [...dishsimilarityKeys.all, 'detail'] as const,
  detail: (id: string | number) =>
    [...dishsimilarityKeys.details(), id] as const,
}

export function useDishSimilarityQuery(
  options?: Omit<
    UseQueryOptions<
      DishSimilarity[], // raw API data
      Error,
      TransformedDish[] // data after select()
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<
    DishSimilarity[], // raw data from api
    Error,
    TransformedDish[] // transformed data
  >({
    queryKey: dishsimilarityKeys.list(),

    queryFn: () => DishSimilarityApi.getSimilarity(),

    // fully typed transform
    select: transformDishPairs,

    ...options,
  })
}
