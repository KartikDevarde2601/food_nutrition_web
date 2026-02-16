import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
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
import { useVirtualizer } from '@tanstack/react-virtual'
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
import { useGridColumns } from '../context/use-grid-columns'
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

  // Grid column count from responsive hook (renamed to avoid shadowing table columns)
  const gridColCount = useGridColumns()
  const { rows } = table.getRowModel()

  const gridParentRef = useRef<HTMLDivElement>(null)
  const listParentRef = useRef<HTMLDivElement>(null)

  const activeView = view || 'grid'

  // Calculate total virtual rows for grid (items per row = gridColCount)
  const gridRowCount = Math.ceil(rows.length / gridColCount)

  const gridVirtualizer = useVirtualizer({
    count: activeView === 'grid' ? gridRowCount : 0,
    getScrollElement: () => gridParentRef.current,
    estimateSize: useCallback(() => 140, []),
    overscan: 10,
  })

  const listVirtualizer = useVirtualizer({
    count: activeView === 'list' ? rows.length : 0,
    getScrollElement: () => listParentRef.current,
    estimateSize: useCallback(() => 800, []),
    overscan: 10,
  })

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

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-muted-foreground'>Loading meals...</div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4 overflow-hidden'
      )}
    >
      {/* Tabs wrapping toolbar + content so TabsList can sit in toolbar row */}
      <Tabs
        value={activeView}
        onValueChange={(value) =>
          navigate({
            search: (prev) => ({ ...prev, view: value as 'grid' | 'list' }),
          })
        }
        className='flex flex-1 flex-col gap-4 overflow-hidden'
      >
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
          <TabsList className='flex w-fit items-center gap-2'>
            <TabsTrigger value='grid'>
              <LayoutGrid className='h-4 w-4' />
            </TabsTrigger>
            <TabsTrigger value='list'>
              <LayoutList className='h-4 w-4' />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Grid View */}
        <TabsContent
          value='grid'
          className='min-h-0 flex-1 overflow-y-auto'
          ref={gridParentRef}
        >
          {rows.length > 0 ? (
            <div
              style={{
                height: `${gridVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {gridVirtualizer.getVirtualItems().map((virtualRow) => {
                const start = virtualRow.index * gridColCount
                const end = start + gridColCount
                const rowItems = rows.slice(start, end)

                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    className='grid gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8'
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      paddingBottom: '1rem',
                    }}
                  >
                    {rowItems.map((row) => (
                      <MealCard
                        enableCheckbox={true}
                        key={row.id}
                        row={row}
                        onClick={() =>
                          setSelectedMealId(String(row.original.mealId))
                        }
                        isLastSelected={
                          lastSelectedMealId === String(row.original.mealId)
                        }
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='text-muted-foreground flex h-24 items-center justify-center rounded-md border'>
              No results.
            </div>
          )}
        </TabsContent>

        {/* List View */}
        <TabsContent
          value='list'
          className='min-h-0 flex-1 overflow-y-auto'
          ref={listParentRef}
        >
          {rows.length > 0 ? (
            <div
              style={{
                height: `${listVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {listVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      paddingBottom: '1.5rem',
                    }}
                  >
                    <Card className='overflow-hidden'>
                      <MealDishesInfo mealId={String(row.original.mealId)} />
                    </Card>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='text-muted-foreground flex h-24 items-center justify-center rounded-md border'>
              No results.
            </div>
          )}
        </TabsContent>
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
