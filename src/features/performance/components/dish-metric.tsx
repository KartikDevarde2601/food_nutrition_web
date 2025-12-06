import React from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'

import { DishMetricTable } from './dish-metric-table'
import { ModelSelector } from './model-selector'
import { OverallMetricsDisplay } from './overall-metrics-display'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { usePerformance } from './performance-provider'

const route = getRouteApi('/_authenticated/performance/')

interface DishMetricProps {
  isLoading: boolean
  dishMetricData: any
}

export function DishMetric({ isLoading, dishMetricData }: DishMetricProps) {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { groupSimilarDishes, setGroupSimilarDishes } = usePerformance()

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
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Dish Level
          </h2>
          <p className='text-muted-foreground'>
            Analyze dish level model performance metrics and comparisons!
          </p>
        </div>

        <ModelSelector />
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

      <OverallMetricsDisplay
        metrics={dishMetricData?.overallMetrics || null}
        isLoading={isLoading}
      />

      <DishMetricTable />
    </Main>

  )
}
