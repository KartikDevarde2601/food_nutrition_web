import { useEffect, useState, useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { LayoutGrid, LayoutList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMealsQuery } from '@/hooks/meals'
import { useDebounce } from '@/hooks/use-debounce'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTableToolbar } from '@/components/data-table'
import type { WeightFilterMode } from '@/components/data-table'
import { MealCard } from '@/components/meal-card'
import { useMeals } from '../context/meals-provider'
import { Meal } from '../data/schema'
import { MealDishesInfo } from './meal-dishes-info'
import { MealsBulkActions } from './meals-bulk-actions'
import { mealsColumns as columns } from './table-columns/meals-columns'

const route = getRouteApi('/_authenticated/programs/$id/meals')

export function MealsTable() {
  const { id } = route.useParams()
  const {
    view,
    weightfilter = 'greater',
    weightMin = 0,
    weightMax = 10000,
  } = route.useSearch()
  const navigate = route.useNavigate()
  const { setOpen, setCurrentRow } = useMeals()

  // Debounce weight filter values for API calls (500ms)
  const weightFilterParams = useMemo(
    () => ({
      mode: weightfilter as 'less' | 'greater' | 'between',
      min: weightMin,
      max: weightMax,
    }),
    [weightfilter, weightMin, weightMax]
  )

  const debouncedWeightFilter = useDebounce(weightFilterParams, 500)

  const {
    data: meals = [],
    isLoading,
    isError,
  } = useMealsQuery({
    program_id: Number(id),
    weightFilter: debouncedWeightFilter,
  })

  // Handler for weight range filter changes
  const handleWeightFilterChange = (filter: {
    weightFilter: WeightFilterMode
    weightMin: number
    weightMax: number
  }) => {
    navigate({
      search: (prev) => ({
        ...prev,
        weightfilter: filter.weightFilter,
        weightMin: filter.weightMin,
        weightMax: filter.weightMax,
      }),
    })
  }

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [selectedMealId, setSelectedMealId] = useState<string | null>(null)
  const [lastSelectedMealId, setLastSelectedMealId] = useState<string | null>(
    null
  )

  // Synced with URL states (updated to match route search schema defaults)
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
  } = useTableUrlState({
    search: route.useSearch(),
    navigate,
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: [],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: meals,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, _columnId, filterValue) => {
      const id = String(row.getValue('mealId')).toLowerCase()
      const searchValue = String(filterValue).toLowerCase()

      return id.includes(searchValue)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange,
    onColumnFiltersChange,
  })

  // Listen for delete meal events from action buttons
  useEffect(() => {
    const handleDeleteMeal = (event: Event) => {
      const customEvent = event as CustomEvent<Meal>
      setCurrentRow(customEvent.detail)
      setOpen('delete')
    }

    window.addEventListener('delete-meal', handleDeleteMeal)
    return () => {
      window.removeEventListener('delete-meal', handleDeleteMeal)
    }
  }, [setCurrentRow, setOpen])

  // Show error state
  if (isError) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-destructive'>
          Failed to load meals. Please try again.
        </div>
      </div>
    )
  }

  // Content to render based on loading state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex h-96 items-center justify-center'>
          <div className='text-muted-foreground'>Loading meals...</div>
        </div>
      )
    }

    return (
      <>
        <TabsContent value='grid' className='min-h-0 flex-1 overflow-y-auto'>
          {table.getRowModel().rows?.length ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8'>
              {table.getRowModel().rows.map((row) => (
                <MealCard
                  enableCheckbox={true}
                  key={row.id}
                  row={row}
                  onClick={() => setSelectedMealId(String(row.original.mealId))}
                  isLastSelected={
                    lastSelectedMealId === String(row.original.mealId)
                  }
                />
              ))}
            </div>
          ) : (
            <div className='text-muted-foreground flex h-24 items-center justify-center rounded-md border'>
              No results.
            </div>
          )}
        </TabsContent>

        <TabsContent value='list' className='min-h-0 flex-1 overflow-y-auto'>
          {table.getRowModel().rows?.length ? (
            <div className='flex flex-col gap-6'>
              {table.getRowModel().rows.map((row) => (
                <Card key={row.id} className='overflow-hidden'>
                  <MealDishesInfo mealId={String(row.original.mealId)} />
                </Card>
              ))}
            </div>
          ) : (
            <div className='text-muted-foreground flex h-24 items-center justify-center rounded-md border'>
              No results.
            </div>
          )}
        </TabsContent>
      </>
    )
  }

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      {/* Toolbar outside of Tabs to prevent re-render on loading */}
      <div className='flex items-center justify-between'>
        <DataTableToolbar
          table={table}
          searchfilterEnable={false}
          selectAllEnable={true}
          dateFilters={[
            {
              columnId: 'createdAt',
              title: 'Date Filter',
              multiple: true,
            },
          ]}
          modelFilters={[
            {
              columnId: 'mealInferences',
              title: 'Models',
            },
          ]}
          weightRangeFilter={{
            title: 'filter by whole weight',
            min: 0,
            max: 2000,
            step: 10,
            unit: 'g',
            weightFilter: weightfilter as WeightFilterMode,
            weightMin,
            weightMax,
            onFilterChange: handleWeightFilterChange,
          }}
          onReset={() => {
            handleWeightFilterChange({
              weightFilter: 'greater',
              weightMin: 0,
              weightMax: 2000,
            })
          }}
        />
        <Tabs
          value={view || 'grid'}
          onValueChange={(value) =>
            navigate({
              search: (prev) => ({ ...prev, view: value as 'grid' | 'list' }),
            })
          }
        >
          <TabsList className='flex items-center gap-2'>
            <TabsTrigger value='grid'>
              <LayoutGrid className='h-4 w-4' />
            </TabsTrigger>
            <TabsTrigger value='list'>
              <LayoutList className='h-4 w-4' />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tabs content area with loading inside */}
      <Tabs
        value={view || 'grid'}
        onValueChange={(value) =>
          navigate({
            search: (prev) => ({ ...prev, view: value as 'grid' | 'list' }),
          })
        }
        className='flex flex-1 flex-col'
      >
        {renderContent()}
      </Tabs>
      <MealsBulkActions table={table} program_id={Number(id)} />

      <Dialog
        open={!!selectedMealId}
        onOpenChange={(open) => {
          if (!open) {
            setLastSelectedMealId(selectedMealId)
            setSelectedMealId(null)
          }
        }}
      >
        <DialogContent className='flex h-[90vh] max-h-[90vh] w-[95vw] max-w-[90vw] flex-col sm:max-w-[950vw]'>
          <DialogHeader>
            <DialogTitle>Meal Details with nutrition info</DialogTitle>
          </DialogHeader>
          <div className='min-h-0 flex-1 overflow-y-auto'>
            {selectedMealId && <MealDishesInfo mealId={selectedMealId} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
