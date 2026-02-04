import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableDateFilter } from './date-filtering'
import { DataTableModelFilter } from './data-table-model-filter'
import { DataTableWeightRangeFilter, type WeightFilterMode } from './weight-range-filter'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchfilterEnable?: boolean
  searchPlaceholder?: string
  searchKey?: string
  selectAllEnable?: boolean
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  dateFilters?: {
    columnId: string
    title: string
    multiple?: boolean
  }[]
  modelFilters?: {
    columnId: string
    title: string
  }[]
  weightRangeFilter?: {
    title: string
    min?: number
    max?: number
    step?: number
    unit?: string
    weightFilter: WeightFilterMode
    weightMin: number
    weightMax: number
    onFilterChange: (filter: {
      weightFilter: WeightFilterMode
      weightMin: number
      weightMax: number
    }) => void
  }
  onReset?: () => void
}

export function DataTableToolbar<TData>({
  table,
  searchfilterEnable = true,
  searchPlaceholder = 'Filter...',
  searchKey,
  selectAllEnable = false,
  filters = [],
  dateFilters = [],
  modelFilters = [],
  weightRangeFilter,
  onReset,
}: DataTableToolbarProps<TData>) {

  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  return (
    <div className='flex items-center gap-4'>
      {searchfilterEnable && (
        searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className='h-8 w-[250px] lg:w-[300px]'
          />
        )
      )}

      {filters.map((filter) => {
        const column = table.getColumn(filter.columnId)
        if (!column) return null
        return (
          <DataTableFacetedFilter
            key={filter.columnId}
            column={column}
            title={filter.title}
            options={filter.options}
          />
        )
      })}

      {dateFilters.map((filter) => {
        const column = table.getColumn(filter.columnId)
        if (!column) return null
        return (
          <DataTableDateFilter
            key={filter.columnId}
            column={column}
            title={filter.title}
            multiple={filter.multiple}
          />
        )
      })}

      {modelFilters.map((filter) => {
        const column = table.getColumn(filter.columnId)
        if (!column) return null
        return (
          <DataTableModelFilter
            key={filter.columnId}
            column={column}
            title={filter.title}
          />
        )
      })}

      {weightRangeFilter && (
        <DataTableWeightRangeFilter
          title={weightRangeFilter.title}
          min={weightRangeFilter.min}
          max={weightRangeFilter.max}
          step={weightRangeFilter.step}
          unit={weightRangeFilter.unit}
          weightFilter={weightRangeFilter.weightFilter}
          weightMin={weightRangeFilter.weightMin}
          weightMax={weightRangeFilter.weightMax}
          onFilterChange={weightRangeFilter.onFilterChange}
        />
      )}

      {selectAllEnable && (
        <div className="flex items-center gap-3 border-1 border-dashed rounded-lg p-2">
          <Checkbox id="select-all"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
          />
          <Label htmlFor="select-all">Select All</Label>
        </div>
      )}

      {isFiltered && (
        <Button
          variant='ghost'
          onClick={() => {
            table.resetColumnFilters()
            table.setGlobalFilter('')
            onReset?.()
          }}
          className='h-8 px-2 lg:px-3'
        >
          Reset
          <Cross2Icon className='ms-2 h-4 w-4' />
        </Button>
      )}
    </div>
  )
}
