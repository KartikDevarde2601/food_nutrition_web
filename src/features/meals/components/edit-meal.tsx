import { useMemo } from 'react'
import { useParams } from '@tanstack/react-router'
import { useMealDetailsQuery } from '@/hooks/meals/use-meals-query'
import { useDishesQuery } from '@/hooks/dishes/use-dish-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Identifier } from '../data/schema'
import { MealNutritionSummary } from './meal-nutrition-summary'
import { MealModelResults } from './meal-model-results'

export function EditMeal() {
    const { mealId } = useParams({ from: '/_authenticated/meals/$mealId' })
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
            {/* Main grid: image + table side by side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Image card */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardContent className="p-0 h-full">
                            <div className="w-full h-64 sm:h-80 md:h-96 lg:h-full overflow-hidden rounded-md">
                                <img
                                    src={meal.image}
                                    alt={`Meal ${meal.mealId}`}
                                    className="w-full h-full object-cover p-2 rounded-md"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table + Nutrition Summary */}
                <div className="lg:col-span-2 space-y-4">
                    <MealNutritionSummary mergedIdentifiers={mergedIdentifiers} dishes={dishes} />
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
                                            <TableCell colSpan={4} className="text-center">
                                                No dishes identified
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>


                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Model Results Section */}
            <div>
                <MealModelResults modelsResult={meal.modelsResult} dishes={dishes} />
            </div>
        </div>

    )
}
