import { useMemo, useEffect } from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import { ModelAndUserIdentifier } from '../data/schema'
import { useModelsQuery } from '@/hooks/programs'
import { MealResults } from './meal-user-results'
import { Dish } from '@/features/dishes/data/schema'

interface MealModelResultsProps {
    modelsResult: ModelAndUserIdentifier[]
    meal_id: number
    feedback: string
    selectedModelId: string | null
    onModelChange: (modelId: string) => void
    allDishes: Dish[]
}

// Keeping local type compatible with what useModelsQuery likely returns or what the logic expects
type Model = {
    model_id: string | number
    name: string
}

export function MealModelResults({
    modelsResult,
    meal_id,
    feedback,
    selectedModelId,
    onModelChange,
    allDishes,
}: MealModelResultsProps) {
    const { data: allmodels, isLoading } = useModelsQuery({})

    // 🔹 Unique models based on results (excluding model_id = 1)
    const models = useMemo<Model[]>(() => {
        if (!allmodels) return []
        // Convert all IDs to numbers for consistent comparison
        const ids = new Set(modelsResult.map((m) => Number(m.model_id)))
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

    // 🔹 Set initial selected model if not set
    useEffect(() => {
        if (selectedModelId === null && models.length > 0) {
            onModelChange(String(models[0].model_id))
        }
    }, [models, selectedModelId, onModelChange])

    // 🔹 Handle loading
    if (isLoading || !allmodels || !allDishes.length) {
        return (
            <div className='py-6 text-center text-muted-foreground'>
                Loading model list...
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Tabs
                value={selectedModelId ?? undefined}
                onValueChange={(value) => onModelChange(value)}
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

                {/* Tab content for each model - lazy load only active tab */}
                {filteredModelsResult.map((modelResult) => (
                    selectedModelId === String(modelResult.model_id) && (
                        <TabsContent
                            key={modelResult.model_id}
                            value={String(modelResult.model_id)}
                        >
                            <MealResults
                                identifiers={modelResult.dishes}
                                meal_id={meal_id}
                                model_id={Number(modelResult.model_id)}
                                feedback={feedback}
                                allDishes={allDishes}
                            />
                        </TabsContent>
                    )
                ))}
            </Tabs>
        </div>
    )
}
