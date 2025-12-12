import { useEffect, useState } from 'react'
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
import { cn } from '@/lib/utils'
import { useMealsQuery } from '@/hooks/meals'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { DataTableToolbar } from '@/components/data-table'
import { Meal } from '../data/schema'
import { MealsBulkActions } from './meals-bulk-actions'
import { MealsPrimaryButtons } from './meals-primary-buttons'
import { mealsColumns as columns } from './table-columns/meals-columns'
import { useMeals } from './meals-provider'
import { MealCard } from './meal-card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { EditMeal } from './edit-meal'
import { Card } from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { LayoutGrid, LayoutList } from 'lucide-react'

const route = getRouteApi('/_authenticated/programs/$id/meals')




export function MealsTable() {
  const { id } = route.useParams()
  const { setOpen, setCurrentRow } = useMeals()
  const { data: meals = [], isLoading, isError } = useMealsQuery({ program_id: Number(id) })

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [selectedMealId, setSelectedMealId] = useState<string | null>(null)
  const [lastSelectedMealId, setLastSelectedMealId] = useState<string | null>(null)

  // Synced with URL states (updated to match route search schema defaults)
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
  } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
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

  // Show loading state
  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-muted-foreground'>Loading meals...</div>
      </div>
    )
  }

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

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <Tabs defaultValue="grid" className="flex flex-col flex-1">
        <div className='sticky top-16 z-30 bg-background pb-4'>
          <div className='flex flex-wrap items-end justify-between gap-2 mb-4'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Meals</h2>
              <p className='text-muted-foreground'>
                Here&apos;s a list of your meals!
              </p>
            </div>
            <MealsPrimaryButtons />
          </div>
          <div className='flex items-center justify-between'>
            <div className="mb-4">
              <DataTableToolbar
                table={table}
                searchfilterEnable={false}
                selectAllEnable={true}
                dateFilters={[
                  {
                    columnId: 'createdAt',
                    title: 'Created At',
                    multiple: true,
                  },
                ]}
                modelFilters={[
                  {
                    columnId: 'mealInferences',
                    title: 'Models',
                  },
                ]}
              />
            </div>
            <div>
              <TabsList>
                <TabsTrigger value="grid">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <LayoutList className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </div>
          </div>


        </div>

        <TabsContent value="grid" className='flex-1 overflow-y-auto min-h-0'>
          {table.getRowModel().rows?.length ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8'>
              {table.getRowModel().rows.map((row) => (
                <MealCard
                  key={row.id}
                  row={row}
                  onClick={() => setSelectedMealId(String(row.original.mealId))}
                  isLastSelected={lastSelectedMealId === String(row.original.mealId)}
                />
              ))}
            </div>
          ) : (
            <div className='flex h-24 items-center justify-center border rounded-md text-muted-foreground'>
              No results.
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className='flex-1 overflow-y-auto min-h-0'>
          {table.getRowModel().rows?.length ? (
            <div className='flex flex-col gap-6'>
              {table.getRowModel().rows.map((row) => (
                <Card key={row.id} className="overflow-hidden">
                  <EditMeal
                    mealId={String(row.original.mealId)}
                  />
                </Card>
              ))}
            </div>
          ) : (
            <div className='flex h-24 items-center justify-center border rounded-md text-muted-foreground'>
              No results.
            </div>
          )}
        </TabsContent>
      </Tabs>
      <MealsBulkActions table={table} program_id={Number(id)} />

      <Dialog open={!!selectedMealId} onOpenChange={(open) => {
        if (!open) {
          setLastSelectedMealId(selectedMealId)
          setSelectedMealId(null)
        }
      }}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[95vw] max-h-[90vh] overflow-y-auto">
          {selectedMealId && <EditMeal mealId={selectedMealId} />}
        </DialogContent>
      </Dialog>
    </div >
  )
}
