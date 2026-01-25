import React from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { DishMetricTable } from './dish-metric-table'
import { ModelSelector } from './model-selector'
import { OverallMetricsDisplay } from './overall-metrics-display'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { usePerformance } from './performance-provider'
import { useDishMetricQuery } from '@/hooks/performance/use-performance-matrix-query'

const route = getRouteApi('/_authenticated/programs/$id/performance')


export function DishMetric() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { id } = route.useParams()

  const { data: dishMetricData, isLoading, isError } = useDishMetricQuery({
    model_one: search.model_one,
    model_two: search.model_two,
    groupSimilar: search.groupSimilarDishes,
    programs: Number(id),
    meals: search.meal_ids,
  })
  const { groupSimilarDishes, setGroupSimilarDishes } = usePerformance()

  const meal_ids_length = search.meal_ids.length


  // Sync state with URL params on mount and when URL changes
  React.useEffect(() => {
    setGroupSimilarDishes(search.groupSimilarDishes === 1)
  }, [search.groupSimilarDishes, setGroupSimilarDishes])

  // Handle switch toggle and update URL
  const handleGroupSimilarChange = (checked: boolean) => {
    setGroupSimilarDishes(checked)
    navigate({
      search: (prev) => ({
        ...prev,
        groupSimilarDishes: checked ? 1 : 0,
      }),
    })
  }

  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Dish Level
          </h2>
          <p className='text-muted-foreground'>
            {
              meal_ids_length > 0 ? <span> Analyze models performance metrics and comparisons for
                <span className='font-semibold text-lg'> {meal_ids_length}</span>  meals</span>
                : <span> Analyze models performance metrics and comparisons for all meals!</span>
            }
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <ModelSelector />
          <div className="flex items-end mt-5">
            <div className="flex items-center space-x-2">
              <Switch
                id="group-similar-dishes"
                className="scale-120 ml-2"
                checked={groupSimilarDishes}
                onCheckedChange={handleGroupSimilarChange}
              />
              <Label htmlFor="group-similar-dishes">Group Similar</Label>
            </div>

          </div>

        </div>
      </div>

      <OverallMetricsDisplay
        metrics={dishMetricData?.overallMetrics || null}
        isLoading={isLoading}
      />

      <DishMetricTable dishMetricData={dishMetricData} isLoading={isLoading} isError={isError} />
    </>

  )
}
