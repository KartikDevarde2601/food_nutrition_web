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
                    <span className='max-w-[500px] truncate font-medium p-2'>
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
                title='MAE'
                className='w-full'
            />
        ),
        cell: ({ row }) => {
            const value = row.getValue('MAE') as number | null
            return (
                <div className='flex w-full items-center p-2'>
                    <span>{value !== null ? Number.isInteger(value.toFixed(2)) ? value.toFixed(2) : value : 'N/A'}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'RMSE',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='RMSE'
                className='w-full'
            />
        ),
        cell: ({ row }) => {
            const value = row.getValue('RMSE') as number | null
            return (
                <div className='flex w-full items-center p-2'>
                    <span>{value !== null ? Number.isInteger(value.toFixed(2)) ? value.toFixed(2) : value : 'N/A'}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'm1Occurrences',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Model 1 Count'
                className='w-full'
            />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex w-full items-center p-2'>
                    <span>{row.getValue('m1Occurrences')}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'm2Occurrences',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Model 2 Count'
                className='w-full'
            />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex w-full items-center p-2'>
                    <span>{row.getValue('m2Occurrences')}</span>
                </div>
            )
        },
    },
]
