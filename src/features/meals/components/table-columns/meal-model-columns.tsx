
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type ModelResultDish } from '../../data/schema'

export type ModelResultRow = ModelResultDish & {
    dish_name: string
}

export const mealModelColumns: ColumnDef<ModelResultRow>[] = [
    {
        accessorKey: 'dish_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Dish' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='truncate font-medium p-2'>
                        {row.getValue('dish_name')}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'weight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Weight (g)' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex items-center'>
                    <span className='p-2'>{row.getValue('weight')}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'position',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Position' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex items-center'>
                    <span className='p-2'>{row.getValue('position')}</span>
                </div>
            )
        },
    },
]
