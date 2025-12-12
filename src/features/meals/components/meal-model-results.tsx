import { useState, useMemo, useEffect } from 'react'
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
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
import { ModelResult } from '../data/schema'
import { Dish } from '@/features/dishes/data/schema'
import { useModelsQuery } from '@/hooks/programs'
import { mealModelColumns, type ModelResultRow } from './table-columns/meal-model-columns'

interface MealModelResultsProps {
    modelsResult: ModelResult[]
    dishes: Dish[] | undefined
}

// Keeping local type compatible with what useModelsQuery likely returns or what the logic expects
type Model = {
    model_id: string | number
    name: string
}

export function MealModelResults({
    modelsResult,
    dishes,
}: MealModelResultsProps) {
    const [selectedModelId, setSelectedModelId] = useState<number | null>(null)
    const { data: allmodels, isLoading } = useModelsQuery()
    const [sorting, setSorting] = useState<SortingState>([])

    // 🔹 Unique models based on results
    const models = useMemo<Model[]>(() => {
        if (!allmodels) return []
        const ids = new Set(modelsResult.map((m) => Number(m.model_id)))
        // Filter allmodels where model_id matches the result IDs
        return allmodels.filter((m: any) => ids.has(Number(m.model_id)))
    }, [modelsResult, allmodels])

    // 🔹 Set initial selected model
    useEffect(() => {
        if (selectedModelId === null && models.length > 0) {
            setSelectedModelId(Number(models[0].model_id))
        }
    }, [models, selectedModelId])

    // 🔹 Find currently selected model's results
    const selectedModelResult = useMemo(() => {
        return modelsResult.find((m) => Number(m.model_id) === selectedModelId) ?? null
    }, [modelsResult, selectedModelId])

    // 🔹 Prepare data for the table
    const tableData = useMemo<ModelResultRow[]>(() => {
        if (!selectedModelResult || !dishes) return []
        return selectedModelResult.dishes.map((dish) => {
            const dishData = dishes.find((d) => d.dish_id === Number(dish.dish_id))
            return {
                ...dish,
                dish_name: dishData ? dishData.dish_name : `Dish ${dish.dish_id}`,
            }
        })
    }, [selectedModelResult, dishes])

    const table = useReactTable({
        data: tableData,
        columns: mealModelColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })

    // 🔹 Handle loading
    if (isLoading || !allmodels) {
        return (
            <div className='py-6 text-center text-muted-foreground'>
                Loading model list...
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Model Results</h3>
            </div>
            <Tabs
                value={selectedModelId?.toString()}
                onValueChange={(value) => setSelectedModelId(Number(value))}
                className="w-full"
            >
                <TabsList className='w-full'>
                    {models.map((model) => (
                        <TabsTrigger
                            key={model.model_id}
                            value={model.model_id.toString()}
                        >
                            {model.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {selectedModelResult ? (
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
                                        colSpan={mealModelColumns.length}
                                        className='h-24 text-center'
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className='text-center text-muted-foreground py-4'>
                    No model selected or no results available.
                </div>
            )}
        </div>
    )
}
