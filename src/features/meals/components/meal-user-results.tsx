import { useMemo, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    type SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Dish } from '@/features/dishes/data/schema'
import { Identifier } from '../data/schema'
import { mealUserColumns, type UserResultRow } from './table-columns/meal-user-columns'

interface MealUserResultsProps {
    identifiers: (Identifier & { isAdmin: boolean; isUser: boolean })[]
    dishes: Dish[] | undefined
}

export function MealUserResults({
    identifiers,
    dishes,
}: MealUserResultsProps) {
    const [sorting, setSorting] = useState<SortingState>([])

    // 🔹 Prepare data for the table
    const tableData = useMemo<UserResultRow[]>(() => {
        if (!identifiers) return []
        // We can handle undefined dishes gracefully if needed, but assuming passed
        return identifiers.map((item) => {
            const dishData = dishes?.find((d) => d.dish_id === Number(item.dishId))
            return {
                ...item,
                dish_name: dishData ? dishData.dish_name : `Dish ${item.dishId}`,
            }
        })
    }, [identifiers, dishes])

    const table = useReactTable({
        data: tableData,
        columns: mealUserColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">User identifies dishes</h3>
            </div>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                        <TableCell key={cell.id}>
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
                                    colSpan={mealUserColumns.length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}
