import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type PerDishMetric } from '../data/schema'

export const dishMetricColumns: ColumnDef<PerDishMetric>[] = [
    {
        accessorKey: 'dishName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Dish Name' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-[500px] truncate font-medium'>
                        {row.getValue('dishName')}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: '#dMatch',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='# Matches' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex w-[100px] items-center'>
                    <span>{row.getValue('#dMatch')}</span>
                </div>
            )
        },
    },
    {
        accessorKey: '%dMatch',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='% Match' />
        ),
        cell: ({ row }) => {
            const value = row.getValue('%dMatch') as number
            return (
                <div className='flex w-[100px] items-center'>
                    <span>{value}%</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'MAE',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='MAE' />
        ),
        cell: ({ row }) => {
            const value = row.getValue('MAE') as number | null
            return (
                <div className='flex w-[100px] items-center'>
                    <span>{value !== null ? value.toFixed(2) : 'N/A'}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'RMSE',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='RMSE' />
        ),
        cell: ({ row }) => {
            const value = row.getValue('RMSE') as number | null
            return (
                <div className='flex w-[100px] items-center'>
                    <span>{value !== null ? value.toFixed(2) : 'N/A'}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'm1Occurrences',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Model 1 Count' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex w-[120px] items-center'>
                    <span>{row.getValue('m1Occurrences')}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'm2Occurrences',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Model 2 Count' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex w-[120px] items-center'>
                    <span>{row.getValue('m2Occurrences')}</span>
                </div>
            )
        },
    },
]
