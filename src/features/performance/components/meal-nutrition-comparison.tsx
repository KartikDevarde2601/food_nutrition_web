import React, { useMemo } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { MergeDish } from '../data/schema'
import { Dish } from '@/features/dishes/data/schema'

interface NutritionRow {
    type: string
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface MealNutritionComparisonProps {
    dishes: MergeDish[]
    allDishes: Dish[]
    modelOneName: string
    modelTwoName: string
}

const columns: ColumnDef<NutritionRow>[] = [
    {
        accessorKey: 'type',
        header: '',
        cell: ({ row }) => (
            <span className="font-medium">{row.getValue('type')}</span>
        ),
    },
    {
        accessorKey: 'calories',
        header: 'Calories',
        cell: ({ row }) => (
            <span>{Math.round(row.getValue('calories'))} kcal</span>
        ),
    },
    {
        accessorKey: 'protein',
        header: 'Protein',
        cell: ({ row }) => (
            <span>{Math.round(row.getValue('protein'))}g</span>
        ),
    },
    {
        accessorKey: 'carbs',
        header: 'Carbs',
        cell: ({ row }) => (
            <span>{Math.round(row.getValue('carbs'))}g</span>
        ),
    },
    {
        accessorKey: 'fat',
        header: 'Fat',
        cell: ({ row }) => (
            <span>{Math.round(row.getValue('fat'))}g</span>
        ),
    },
]

export const MealNutritionComparison = React.memo(function MealNutritionComparison({
    dishes,
    allDishes,
    modelOneName,
    modelTwoName,
}: MealNutritionComparisonProps) {
    const nutritionData = useMemo((): NutritionRow[] => {
        const calculateNutrition = (weightKey: 'userWeight' | 'modeloneWeight' | 'modeltwoWeight') => {
            const result = dishes.reduce(
                (acc: { calories: number; protein: number; carbs: number; fat: number }, item) => {
                    const dish = allDishes.find(d => String(d.dish_id) === String(item.dishId))
                    if (!dish) {
                        return acc
                    }

                    const weight = Number(item[weightKey]) || 0
                    if (weight === 0) return acc

                    const ratio = weight / 100
                    const itemCalories = ((dish.carbs_g * 4) + (dish.protein_g * 4) + (dish.fat_g * 9)) * ratio

                    return {
                        calories: acc.calories + itemCalories,
                        protein: acc.protein + (dish.protein_g * ratio),
                        carbs: acc.carbs + (dish.carbs_g * ratio),
                        fat: acc.fat + (dish.fat_g * ratio)
                    }
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            )
            return result
        }

        const userNut = calculateNutrition('userWeight')
        const m1Nut = calculateNutrition('modeloneWeight')
        const m2Nut = calculateNutrition('modeltwoWeight')

        return [
            { type: 'User', ...userNut },
            { type: modelOneName, ...m1Nut },
            { type: modelTwoName, ...m2Nut },
        ]
    }, [dishes, allDishes, modelOneName, modelTwoName])

    const table = useReactTable({
        data: nutritionData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full">
            <h3 className="text-xs font-semibold mb-2 text-muted-foreground/70 uppercase tracking-wider">
                Nutrition Comparison Summary
            </h3>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
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
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No nutrition data available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
})
