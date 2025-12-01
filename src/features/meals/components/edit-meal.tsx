import { useState, useMemo } from 'react'
import { useParams } from '@tanstack/react-router'
import { useMealDetailsQuery } from '../api/use-meal-details-query'
import { useDishesQuery } from '@/hooks/dishes/use-dish-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Identifier } from '../data/schema'

export function EditMeal() {
    const { mealId } = useParams({ from: '/_authenticated/meals/$mealId' })
    const { data: mealDetails, isLoading: isLoadingMeal, error: mealError } = useMealDetailsQuery(mealId)
    const { data: dishes, isLoading: isLoadingDishes } = useDishesQuery()
    const [selectedModelId, setSelectedModelId] = useState<string>('')

    const meal = mealDetails?.[0]

    // Merge identifiers
    const mergedIdentifiers = useMemo(() => {
        if (!meal) return []

        const adminIds = meal.adminIdentifierIds || []
        const userIds = meal.userIdentifiersIds || []

        // Get all unique dish IDs
        const allDishIds = Array.from(new Set([
            ...adminIds.map(i => i.dishId),
            ...userIds.map(i => i.dishId)
        ]))

        return allDishIds.map(dishId => {
            const adminItem = adminIds.find(i => i.dishId === dishId)
            const userItem = userIds.find(i => i.dishId === dishId)

            // Prefer admin item for details if available, otherwise user item
            const item = adminItem || userItem

            if (!item) return null
            return {
                ...item,
                isAdmin: !!adminItem,
                isUser: !!userItem
            }
        }).filter(Boolean) as (Identifier & { isAdmin: boolean; isUser: boolean })[]
    }, [meal])

    // Get unique models
    const models = useMemo(() => {
        if (!meal?.modelsResult) return []
        return meal.modelsResult.map(m => m.model_id)
    }, [meal])

    // Set default selected model
    useMemo(() => {
        if (models.length > 0 && !selectedModelId) {
            setSelectedModelId(models[0])
        }
    }, [models, selectedModelId])

    // Get results for selected model
    const selectedModelResult = useMemo(() => {
        if (!meal?.modelsResult || !selectedModelId) return null
        return meal.modelsResult.find(m => m.model_id === selectedModelId)
    }, [meal, selectedModelId])

    const getDishName = (dishId: string | number) => {
        if (!dishes) return 'Loading...'
        const dish = dishes.find(d => d.dish_id === Number(dishId))
        return dish ? dish.dish_name : `Dish ${dishId}`
    }

    if (isLoadingMeal || isLoadingDishes) {
        return <div className="p-4 space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[200px] w-full" />
        </div>
    }

    if (mealError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load meal details.
                </AlertDescription>
            </Alert>
        )
    }

    if (!meal) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>
                    Meal not found.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-4">

            {/* Left Column: Image & user identifiers dishnames */}
            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Meal Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-square relative rounded-md overflow-hidden bg-muted w-[70%] mx-auto">
                            <img
                                src={meal.image}
                                alt={`Meal ${meal.mealId}`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>User Identifiers Dish Names</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {meal.userIdentifiersNames.map((identifier, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="font-medium">{identifier.dishName}</span>
                                    <span className="text-muted-foreground">{identifier.weight}g</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6">
                {/* Merged Identifiers */}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Model Results</CardTitle>
                        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Model" />
                            </SelectTrigger>
                            <SelectContent>
                                {models.map(modelId => (
                                    <SelectItem key={modelId} value={modelId}>
                                        Model {modelId}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="mt-4">
                        {selectedModelResult ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Dish</TableHead>
                                        <TableHead>Weight (g)</TableHead>
                                        <TableHead>Position</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedModelResult.dishes.map((dish, index) => (
                                        <TableRow key={`${dish.dish_id}-${index}`}>
                                            <TableCell>{getDishName(dish.dish_id)}</TableCell>
                                            <TableCell>{dish.weight}</TableCell>
                                            <TableCell>{dish.position}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center text-muted-foreground py-4">
                                No model selected or no results available.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Identified Dishes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Dish</TableHead>
                                    <TableHead>Weight (g)</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Added By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mergedIdentifiers.map((item, index) => (
                                    <TableRow key={`${item.dishId}-${index}`}>
                                        <TableCell>{getDishName(item.dishId)}</TableCell>
                                        <TableCell>{item.weight}</TableCell>
                                        <TableCell>{item.position}</TableCell>
                                        <TableCell className="space-x-2">
                                            {item.isUser && <Badge variant="secondary">User</Badge>}
                                            {item.isAdmin && <Badge>Admin</Badge>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {mergedIdentifiers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No dishes identified</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Model Results */}

            </div>
        </div>
    )
}
