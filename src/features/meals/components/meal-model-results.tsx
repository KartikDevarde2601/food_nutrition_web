import { useState, useMemo, useEffect } from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import { ModelAndUserIdentifier } from '../data/schema'
import { useModelsQuery } from '@/hooks/programs'
import { MealResults } from './meal-user-results'
import { MealNutritionSummary } from './meal-nutrition-summary'
import { useDishesQuery } from '@/hooks/dishes'
import { MealFormProvider, useMealFormContext } from '../context/meal-form-provider'

interface MealModelResultsProps {
    modelsResult: ModelAndUserIdentifier[]
    meal_id: number
}

// Keeping local type compatible with what useModelsQuery likely returns or what the logic expects
type Model = {
    model_id: string | number
    name: string
}

export function MealModelResults({
    modelsResult,
    meal_id,
}: MealModelResultsProps) {
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
    const { data: allmodels, isLoading } = useModelsQuery({})
    const { data: allDishesData } = useDishesQuery({ limit: 100 })

    // 🔹 Unique models based on results (excluding model_id = 1)
    const models = useMemo<Model[]>(() => {
        if (!allmodels) return []
        // Convert all IDs to numbers for consistent comparison
        const ids = new Set(modelsResult.map((m) => Number(m.model_id)))
        console.log('modelsResult:', modelsResult, 'ids:', ids, 'allmodels:', allmodels)
        // Filter allmodels where model_id matches the result IDs, excluding model_id = 1
        return allmodels.filter((m: any) => {
            const modelId = Number(m.model_id)
            return ids.has(modelId) && modelId !== 1
        })
    }, [modelsResult, allmodels])

    // 🔹 Filter modelsResult to exclude model_id = 1
    const filteredModelsResult = useMemo(() => {
        return modelsResult.filter((m) => Number(m.model_id) !== 1)
    }, [modelsResult])

    // 🔹 Set initial selected model
    useEffect(() => {
        if (selectedModelId === null && models.length > 0) {
            setSelectedModelId(String(models[0].model_id))
        }
    }, [models, selectedModelId])

    // 🔹 Handle loading
    if (isLoading || !allmodels || !allDishesData?.data) {
        return (
            <div className='py-6 text-center text-muted-foreground'>
                Loading model list...
            </div>
        )
    }

    return (
        <MealFormProvider>
            <div className="space-y-4">
                <Tabs
                    value={selectedModelId ?? undefined}
                    onValueChange={(value) => setSelectedModelId(value)}
                    className="w-full"
                >
                    <TabsList className='w-full'>
                        {models.map((model) => (
                            <TabsTrigger
                                key={model.model_id}
                                value={String(model.model_id)}
                            >
                                {model.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Tab content for each model */}
                    {filteredModelsResult.map((modelResult) => {
                        return (
                            <TabsContent
                                key={modelResult.model_id}
                                value={String(modelResult.model_id)}
                            >
                                <div className="flex flex-col gap-4 pb-4">
                                    <MealNutritionSummary
                                        mergedIdentifiers={modelResult}
                                        dishes={allDishesData?.data}
                                        type="user"
                                        title='User Nutrition Summary'
                                    />
                                    <MealNutritionSummary
                                        mergedIdentifiers={modelResult}
                                        dishes={allDishesData?.data}
                                        type="ai"
                                        title='AI Nutrition Summary'
                                    />
                                </div>

                                <MealResults
                                    identifiers={modelResult.dishes}
                                    meal_id={meal_id}
                                    model_id={Number(modelResult.model_id)}
                                />
                            </TabsContent>
                        )
                    })}
                </Tabs>
            </div>
        </MealFormProvider>
    )
}
