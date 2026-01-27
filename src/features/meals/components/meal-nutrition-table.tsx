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
import { ModelAndUserIdentifier } from '../data/schema'
import { Dish } from '@/features/dishes/data/schema'
import { useMealFormContext } from '../context/meal-form-provider'

interface NutritionRow {
    type: 'User' | 'AI'
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface MealNutritionTableProps {
    mergedIdentifiers: ModelAndUserIdentifier
    dishes: Dish[] | undefined
    dishesMap?: Map<number, Dish>
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

export const MealNutritionTable = React.memo(function MealNutritionTable({
    mergedIdentifiers,
    dishes,
    dishesMap,
}: MealNutritionTableProps) {
    const { getDishes } = useMealFormContext()

    const currentDishes = getDishes(String(mergedIdentifiers.model_id), mergedIdentifiers.dishes)

    const nutritionData = useMemo((): NutritionRow[] => {
        if (!dishes && !dishesMap) return []
        const dishData = currentDishes
        if (!dishData) return []

        const calculateNutrition = (type: 'user' | 'ai') => {
            return dishData.reduce(
                (acc: { calories: number; protein: number; carbs: number; fat: number }, item) => {
                    const dish = dishesMap
                        ? dishesMap.get(Number(item.dishId))
                        : dishes?.find(d => d.dish_id === Number(item.dishId))
                    if (!dish) return acc

                    let weight = 0
                    if (type === 'user') {
                        weight = Number(item.userWeight) || 0
                    } else {
                        weight = Number(item.aiWeight) || 0
                    }
                    const ratio = weight / 100
                    return {
                        calories: acc.calories + ((dish.carbs_g * 4) + (dish.protein_g * 4) + (dish.fat_g * 9)) * ratio,
                        protein: acc.protein + dish.protein_g * ratio,
                        carbs: acc.carbs + dish.carbs_g * ratio,
                        fat: acc.fat + dish.fat_g * ratio
                    }
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            )
        }

        const userNutrition = calculateNutrition('user')
        const aiNutrition = calculateNutrition('ai')

        return [
            { type: 'User', ...userNutrition },
            { type: 'AI', ...aiNutrition },
        ]
    }, [currentDishes, dishes, dishesMap])

    const table = useReactTable({
        data: nutritionData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (nutritionData.length === 0) return null

    return (
        <div className="w-full">
            <h3 className="text-xs font-semibold mb-2 text-muted-foreground/70 uppercase tracking-wider">
                Nutrition Summary
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
