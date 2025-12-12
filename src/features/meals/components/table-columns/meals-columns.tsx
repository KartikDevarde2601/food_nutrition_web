import { Row, type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { Meal } from '../../data/schema'
import { formatDate } from '@/lib/formatdate'

const colors = [
  "bg-blue-300",
  "bg-green-300",
  "bg-purple-300",
  "bg-orange-300",
  "bg-pink-300",
];



const filterBaseCreatedAt = (row: Row<Meal>, columnId: string, filterValue: any) => {
  const dateValue = row.getValue(columnId) as string

  const dateTimestamp = new Date(dateValue).getTime()

  // If filterValue is not an array, return true (no filter applied)
  if (!Array.isArray(filterValue)) {
    return true
  }

  const [from, to] = filterValue

  // If both from and to are undefined, no filter is applied
  if (!from && !to) {
    return true
  }

  // If only 'from' is set, check if date is >= from
  if (from && !to) {
    return dateTimestamp >= from
  }

  // If only 'to' is set, check if date is <= to (end of day)
  if (!from && to) {
    // Add 24 hours to 'to' to include the entire day
    const toEndOfDay = to + 24 * 60 * 60 * 1000
    return dateTimestamp <= toEndOfDay
  }

  // If both are set, check if date is in range
  // Add 24 hours to 'to' to include the entire day
  const toEndOfDay = to + 24 * 60 * 60 * 1000
  return dateTimestamp >= from && dateTimestamp <= toEndOfDay
}

const filterBaseModels = (row: Row<Meal>, filterValue: any) => {
  // If no filter value, show all rows
  if (!filterValue) return true

  const { operator, modelIds } = filterValue
  const mealInferences = row.original.mealInferences

  switch (operator) {
    case 'isEmpty':
      return mealInferences.length === 0

    case 'isNotEmpty':
      return mealInferences.length > 0

    case 'hasAnyOf':
      // Show if meal contains at least one of the selected models
      if (!modelIds || modelIds.length === 0) return true
      return mealInferences.some((inference) =>
        modelIds.includes(inference.model.model_id)
      )

    case 'hasNoneOf':
      // Show if meal contains none of the selected models
      if (!modelIds || modelIds.length === 0) return true
      return !mealInferences.some((inference) =>
        modelIds.includes(inference.model.model_id)
      )

    default:
      return true
  }
}

export const mealsColumns: ColumnDef<Meal>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'mealId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Meal ID' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-[500px] truncate font-medium'>
          {row.getValue('mealId')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'imageUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    cell: ({ row }) => (
      <img
        src={row.getValue('imageUrl')}
        alt={row.getValue('mealId')}
        className='h-12 w-12 rounded-md object-cover'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Added By' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('userId')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => formatDate(row.getValue<Date>('createdAt')),
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => filterBaseCreatedAt(row, columnId, filterValue)
  },
  {
    accessorKey: 'mealInferences',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Models' />
    ),
    cell: ({ row }) => {
      const mealInferences = row.original.mealInferences
      return (
        <div className="flex flex-wrap gap-2">
          {mealInferences.map((inference, index) => {

            const colorClass = colors[index % colors.length];

            return (
              <Badge
                key={inference.model.model_id}
                variant="secondary"
                className={`hover:bg-secondary/80 flex items-center gap-1 pr-1 ${colorClass}`}
              >
                {inference.model.name}
              </Badge>
            );
          })}
        </div>
      )
    },
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue) => filterBaseModels(row, filterValue)
  },
]
