import { useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Form } from '@/components/ui/form'
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Identifier } from '../data/schema'
import { mealUserFormSchema, type MealUserForm, type UserIdentifierForm } from '../data/meal-user-form-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { DishPopover } from '@/components/dishes-pop-over'
import { Trash2, Plus } from 'lucide-react'
import { useDishesQuery } from '@/hooks/dishes'
import { useDebounce } from '@/hooks/use-debounce'
import { useCorrectMealMutation } from '@/hooks/meals/use-meals-mutations'


interface MealUserResultsProps {
    identifiers: Identifier[]
    meal_id: number
}

export function MealUserResults({
    identifiers,
    meal_id
}: MealUserResultsProps) {
    // State for search functionality
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 300)

    const { mutate: correctMeal } = useCorrectMealMutation()



    // Query for the main dish selection (all dishes, no limit initially or default limit)
    const { data: allDishesData } = useDishesQuery({ limit: 100 })
    const allDishes = allDishesData?.data || []

    // Query for similar dishes search with limit 10
    const { data: searchDishesData, isLoading: isSearching } = useDishesQuery({
        search: debouncedSearch,
        limit: 100,
    })

    const searchDishes = searchDishesData?.data || []
    // Initialize form with existing identifiers
    const form = useForm<MealUserForm>({
        resolver: zodResolver(mealUserFormSchema),
        defaultValues: {
            identifiers: identifiers.map(id => ({
                dishId: id.dishId,
                weight: id.weight,
                position: id.position,
            })),
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'identifiers',
    })

    // Handle form submission
    const onSubmit = (data: MealUserForm) => {
        correctMeal({
            meal_id: meal_id,
            dishCorrection: data.identifiers,
        })
    }

    // Define columns with inline editing
    const columns: ColumnDef<UserIdentifierForm>[] = useMemo(() => [
        {
            accessorKey: 'dishId',
            header: 'Dish',
            cell: ({ row }) => {
                const index = row.index
                const error = form.formState.errors.identifiers?.[index]?.dishId?.message
                const currentValue = form.watch(`identifiers.${index}.dishId`)

                // Find selected dish
                const selectedDish = allDishes.find(d => d.dish_id === Number(currentValue))

                return (
                    <div className="flex flex-col">
                        <DishPopover
                            dishes={searchDishes.length > 0 ? searchDishes : allDishes}
                            selectedValue={selectedDish?.dish_id}
                            onSelect={(dishId) => {
                                form.setValue(`identifiers.${index}.dishId`, dishId)
                            }}
                            placeholder='Search dishes...'
                            buttonText={selectedDish?.dish_name || 'Select dish...'}
                            isLoading={isSearching}
                            enableSearch
                            searchValue={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                )
            },
        },
        {
            accessorKey: 'weight',
            header: 'Weight (g)',
            cell: ({ row }) => {
                const index = row.index
                const error = form.formState.errors.identifiers?.[index]?.weight?.message

                return (
                    <div className="flex flex-col">
                        <Input
                            type="number"
                            placeholder="Enter weight"
                            {...form.register(`identifiers.${index}.weight`)}
                            className={cn(error && 'border-red-500')}
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                )
            },
        },
        {
            accessorKey: 'position',
            header: 'Position',
            cell: ({ row }) => {
                const index = row.index
                const error = form.formState.errors.identifiers?.[index]?.position?.message

                return (
                    <div className="flex flex-col">
                        <Input
                            placeholder="Enter position"
                            {...form.register(`identifiers.${index}.position`)}
                            className={cn(error && 'border-red-500')}
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                )
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const index = row.index

                return (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )
            },
        },
    ], [form, allDishes, searchDishes, searchQuery, setSearchQuery, isSearching, remove])

    const table = useReactTable({
        data: fields,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    // Add new row
    const handleAddRow = () => {
        append({
            dishId: '',
            weight: '',
            position: '',
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">User identifies dishes</h3>
                    <Button
                        type="submit"
                        size="sm"
                        className="ml-auto"
                    >
                        Submit
                    </Button>
                </div>

                <div className='rounded-md border'>
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
                                        className='h-24 text-center'
                                    >
                                        No dishes added yet. Click "Add Row" to start.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddRow}
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row
                </Button>
            </form>
        </Form>
    )
}
