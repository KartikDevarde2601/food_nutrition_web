import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ModelResult } from '../data/schema'
import { Dish } from '@/features/dishes/data/schema'
import { useModelsQuery } from '@/hooks/programs'

interface MealModelResultsProps {
    modelsResult: ModelResult[]
    dishes: Dish[] | undefined
}

type Model = {
    model_id: string;
    name: string;
};

export function MealModelResults({ modelsResult, dishes }: MealModelResultsProps) {

    const [selectedModelId, setSelectedModelId] = useState<number | null>(null)
    const { data: allmodels, isLoading } = useModelsQuery();




    // 🔹 Handle loading
    if (isLoading || !allmodels) {
        return (
            <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                    Loading model list...
                </CardContent>
            </Card>
        )
    }

    // 🔹 Unique models based on results
    const models = useMemo<Model[]>(() => {
        const ids = new Set(modelsResult.map(m => Number(m.model_id)));
        return allmodels.filter(m => ids.has(Number(m.model_id)));
    }, [modelsResult, allmodels]);

    // 🔹 Set initial selected model
    useEffect(() => {
        if (selectedModelId === null && models.length > 0) {
            setSelectedModelId(Number(models[0].model_id));
        }
    }, [models, selectedModelId]);

    // 🔹 Find currently selected model's results
    const selectedModelResult = useMemo(() => {
        return modelsResult.find(m => Number(m.model_id) === selectedModelId) ?? null;
    }, [modelsResult, selectedModelId]);

    const getDishName = (dishId: string | number) => {
        if (!dishes) return 'Loading...'
        const dish = dishes.find(d => d.dish_id === Number(dishId))
        return dish ? dish.dish_name : `Dish ${dishId}`
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Model Results</CardTitle>

                <Select value={selectedModelId?.toString()} onValueChange={(value) => setSelectedModelId(Number(value))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                        {models.map(model => (
                            <SelectItem key={model.model_id} value={model.model_id.toString()}>
                                {model.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="mt-4">
                {selectedModelResult ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">


                        <div className="order-1 p-2">
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
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        No model selected or no results available.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
