import { useMemo } from 'react'
import { useMealDetailsQuery } from '@/hooks/meals/use-meals-query'
import { useDishesQuery } from '@/hooks/dishes/use-dish-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Identifier } from '../data/schema'
import { MealModelResults } from './meal-model-results'

interface EditMealProps {
    mealId: string
}

export function EditMeal({ mealId }: EditMealProps) {
    const { data: mealDetails, isLoading: isLoadingMeal, error: mealError } = useMealDetailsQuery(mealId)
    const { data: dishes, isLoading: isLoadingDishes } = useDishesQuery()

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
        <div className="p-4 space-y-4">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-full">
                    <Card className="h-full flex flex-col">
                        <CardContent className="flex-1 p-4">
                            <div className="w-full h-full min-h-[400px] overflow-hidden rounded-md relative">
                                <img
                                    src={meal.image}
                                    alt={`Meal ${meal.mealId}`}
                                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Two Tables (Takes 50% width) */}
                <div className="space-y-4">
                    {/* Table 1: Identified Dishes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Identified Dishes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Dish</TableHead>
                                        <TableHead>Weight</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Source</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mergedIdentifiers.map((item, index) => (
                                        <TableRow key={`${item.dishId}-${index}`}>
                                            <TableCell className="font-medium">{getDishName(item.dishId)}</TableCell>
                                            <TableCell>{item.weight}g</TableCell>
                                            <TableCell>{item.position}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {item.isUser && <Badge variant="secondary" className="text-xs">User</Badge>}
                                                    {item.isAdmin && <Badge className="text-xs">Admin</Badge>}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {mergedIdentifiers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                No dishes identified
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <MealModelResults modelsResult={meal.modelsResult} dishes={dishes} />

                </div>
            </div>


        </div>
    )
}
