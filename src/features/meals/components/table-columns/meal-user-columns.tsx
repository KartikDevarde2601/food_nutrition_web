
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { Identifier } from '../../data/schema'
import { Badge } from '@/components/ui/badge'

export type UserResultRow = Identifier & {
    dish_name: string
    isAdmin: boolean
    isUser: boolean
}

export const mealUserColumns: ColumnDef<UserResultRow>[] = [
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
    {
        id: 'source',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Source' />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex gap-1 p-2">
                    {row.original.isUser && <Badge variant="secondary" className="text-xs">User</Badge>}
                    {row.original.isAdmin && <Badge className="text-xs">Admin</Badge>}
                </div>
            )
        },
    },
]
