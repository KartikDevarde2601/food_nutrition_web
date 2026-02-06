import React from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { MetricMatrixTable } from './metric-matrix-table'
import { MetricSelector } from './metric-selector'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { usePerformance } from '../context/performance-provider'

const route = getRouteApi('/_authenticated/programs/$id/performance')

export function MealMetric() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { groupSimilarMeals, setGroupSimilarMeals } = usePerformance()

  const meal_ids_length = search.meal_ids.length

  // Sync state with URL params on mount and when URL changes
  React.useEffect(() => {
    setGroupSimilarMeals(search.groupSimilarMeals === 1)
  }, [search.groupSimilarMeals, setGroupSimilarMeals])

  // Handle switch toggle and update URL
  const handleGroupSimilarChange = (checked: boolean) => {
    setGroupSimilarMeals(checked)
    navigate({
      search: (prev) => ({
        ...prev,
        groupSimilarMeals: checked ? 1 : 0,
      }),
    })
  }

  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Meal Level</h2>
          <p className='text-muted-foreground'>
            {
              meal_ids_length > 0 ? <span> Analyze models performance metrics and comparisons for
                <span className='font-semibold text-lg'> {meal_ids_length}</span>  meals</span>
                : <span> Analyze models performance metrics and comparisons for all meals!</span>
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MetricSelector />
          <div className="flex items-center space-x-2">
            <Switch
              id="group-similar-meals"
              className="scale-120 ml-2"
              checked={groupSimilarMeals}
              onCheckedChange={handleGroupSimilarChange}
            />
            <Label htmlFor="group-similar-meals">Group Similar</Label>
          </div>
        </div>

      </div>
      <MetricMatrixTable />
    </>

  )
}

