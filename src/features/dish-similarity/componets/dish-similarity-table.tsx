import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { useDishSimilarityQuery } from '@/hooks/dish-similarity/use-dishsimilarity-query'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { TransformedDish } from '../data/schema'
import { dishColumns as columns } from './dish-similarity-columns'
import { useDishesSimilarity } from './dish-similarity-provider'

const route = getRouteApi('/_authenticated/dish_similarity/')

export function DishSimilarityTable() {
  const { setOpen, setCurrentRow } = useDishesSimilarity()

  // Fetch programs data
  const { data: similarity = [], isLoading, isError } = useDishSimilarityQuery()
  console.log(similarity)

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Synced with URL states
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 30 },
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: [],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: similarity,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, _columnId, filterValue) => {
      const id = String(row.original.dish_id).toLowerCase()
      const name = String(row.original.dish_name).toLowerCase()
      const searchValue = String(filterValue).toLowerCase()

      return id.includes(searchValue) || name.includes(searchValue)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
  })

  const pageCount = table.getPageCount()
  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  // Listen for edit similarity events from action buttons
  useEffect(() => {
    const handleEditSimilarity = (event: Event) => {
      const customEvent = event as CustomEvent<TransformedDish>
      setCurrentRow(customEvent.detail)
      setOpen('edit')
    }

    window.addEventListener('edit-similarity', handleEditSimilarity)
    return () => {
      window.removeEventListener('edit-similarity', handleEditSimilarity)
    }
  }, [setCurrentRow, setOpen])

  // Listen for delete similarity events from action buttons
  useEffect(() => {
    const handleDeleteSimilarity = (event: Event) => {
      const customEvent = event as CustomEvent<TransformedDish>
      setCurrentRow(customEvent.detail)
      setOpen('delete')
    }

    window.addEventListener('delete-similarity', handleDeleteSimilarity)
    return () => {
      window.removeEventListener('delete-similarity', handleDeleteSimilarity)
    }
  }, [setCurrentRow, setOpen])

  // Show loading state
  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-muted-foreground'>Loading DishSimilarity...</div>
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-destructive'>
          Failed to load Dish Similarity . Please try again.
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
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter by dish name'
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
