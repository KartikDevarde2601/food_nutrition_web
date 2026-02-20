import { getRouteApi } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { useMealDetails } from '../context/meal-details-provider'
import { type PerDishMetric } from '../data/schema'

const route = getRouteApi('/_authenticated/programs/$id/performance')

export const dishMetricColumns: ColumnDef<PerDishMetric>[] = [
  {
    accessorKey: 'dishName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dish Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate p-2 font-medium'>
            {row.getValue('dishName')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: '#dMatch',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='# Matches'
        className='w-full'
      />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-full items-center p-2'>
          <span>{Number(row.getValue('#dMatch'))}</span>
        </div>
      )
    },
  },
  {
    accessorKey: '%dMatch',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='% Match'
        className='w-full'
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue('%dMatch') as number
      return (
        <div className='flex w-full items-center p-2'>
          <span>{value}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'MAE',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='MAE (g)'
        className='w-full'
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue('MAE') as number | null
      return (
        <div className='flex w-full items-center p-2'>
          <span>{value !== null ? value : 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'RMSE',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='RMSE (g)'
        className='w-full'
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue('RMSE') as number | null
      return (
        <div className='flex w-full items-center p-2'>
          <span>{value !== null ? value : 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'MAPE',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='MAPE (%)'
        className='w-full'
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue('MAPE') as number | null
      return (
        <div className='flex w-full items-center p-2'>
          <span>{value !== null ? value : 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'm1AvgWeight',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='m1AvgWeight (g)'
        className='w-full'
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue('m1AvgWeight') as number | null
      return (
        <div className='flex w-full items-center p-2'>
          <span>{value !== null ? value : 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'm2AvgWeight',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='m2AvgWeight (g)'
        className='w-full'
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue('m2AvgWeight') as number | null
      return (
        <div className='flex w-full items-center p-2'>
          <span>{value !== null ? value : 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'm1Occurrences',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='M1 Count'
        className='w-full'
      />
    ),
    cell: ({ row }) => {
      const search = route.useSearch()
      const { setSelectdishAndModels } = useMealDetails()
      const dishName = row.getValue('dishName') as string

      return (
        <div className='flex w-full items-center p-2'>
          <a
            href='javascript:void(0)'
            className='cursor-pointer underline text-[#0000EE] visited:text-[#551A8B] active:text-[#EE0000] transition-colors'
            onClick={(e) => {
              e.stopPropagation()
              setSelectdishAndModels({
                dishName,
                modelOne: search.model_one,
                modelTwo: search.model_two,
                clickedModel: 1,
              })
            }}
          >
            {row.getValue('m1Occurrences')}
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: 'm2Occurrences',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='M2 Count'
        className='w-full'
      />
    ),
    cell: ({ row }) => {
      const search = route.useSearch()
      const { setSelectdishAndModels } = useMealDetails()
      const dishName = row.getValue('dishName') as string
      return (
        <div className='flex w-full items-center p-2'>
          <a
            href='javascript:void(0)'
            className='cursor-pointer underline text-[#0000EE] visited:text-[#551A8B] active:text-[#EE0000] transition-colors'
            onClick={(e) => {
              e.stopPropagation()
              setSelectdishAndModels({
                dishName,
                modelOne: search.model_one,
                modelTwo: search.model_two,
                clickedModel: 2,
              })
            }}
          >
            {row.getValue('m2Occurrences')}
          </a>
        </div>
      )
    },
  },
]
