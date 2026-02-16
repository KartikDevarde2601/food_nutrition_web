import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type MergeDish } from '../data/schema'

export const getColumns = (items: {
  modelOneName: string
  modelTwoName: string
}): ColumnDef<MergeDish>[] => [
  {
    accessorKey: 'dishName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dish Name' />
    ),
    cell: ({ row }) => (
      <div className='flex w-full items-center p-2 font-medium'>
        {row.getValue('dishName')}
      </div>
    ),
  },
  {
    accessorKey: 'userWeight',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='GT Weight' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('userWeight') as number | null
      return (
        <div className='flex w-full items-center p-2'>
          <span>{value !== null ? value : 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'modeloneWeight',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={items.modelOneName} />
    ),
    cell: ({ row }) => {
      const value = row.getValue('modeloneWeight') as number | null
      return (
        <div className='flex w-full items-center p-2'>
          <span>{value !== null ? value : 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'modeltwoWeight',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={items.modelTwoName} />
    ),
    cell: ({ row }) => {
      const value = row.getValue('modeltwoWeight') as number | null
      return (
        <div className='flex w-full items-center p-2'>
          <span>{value !== null ? value : 'N/A'}</span>
        </div>
      )
    },
  },
]
