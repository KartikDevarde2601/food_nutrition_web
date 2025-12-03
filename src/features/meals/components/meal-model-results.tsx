import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ModelResult } from '../data/schema'
import { Dish } from '@/features/dishes/data/schema'

interface MealModelResultsProps {
    modelsResult: ModelResult[]
    dishes: Dish[] | undefined
}

export function MealModelResults({ modelsResult, dishes }: MealModelResultsProps) {
    const [selectedModelId, setSelectedModelId] = useState<string>('')

    // Get unique models
    const models = useMemo(() => {
        if (!modelsResult) return []
        return modelsResult.map(m => m.model_id)
    }, [modelsResult])

    // Set default selected model
    useMemo(() => {
        if (models.length > 0 && !selectedModelId) {
            setSelectedModelId(models[0])
        }
    }, [models, selectedModelId])

    // Get results for selected model
    const selectedModelResult = useMemo(() => {
        if (!modelsResult || !selectedModelId) return null
        return modelsResult.find(m => m.model_id === selectedModelId)
    }, [modelsResult, selectedModelId])

    const getDishName = (dishId: string | number) => {
        if (!dishes) return 'Loading...'
        const dish = dishes.find(d => d.dish_id === Number(dishId))
        return dish ? dish.dish_name : `Dish ${dishId}`
    }

    return (
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
    )
}
