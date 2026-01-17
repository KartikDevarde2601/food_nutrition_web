import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { TransformedIdentifier } from '../data/schema'


interface MealFormContextValue {
    // Current form values for dishes (keyed by model_id)
    formDishes: Map<string, TransformedIdentifier[]>
    // Update dishes for a specific model
    updateFormDishes: (modelId: string, dishes: TransformedIdentifier[]) => void
    // Get dishes for a model (returns form values if available, else original)
    getDishes: (modelId: string, originalDishes: TransformedIdentifier[]) => TransformedIdentifier[]
}


const MealFormContext = createContext<MealFormContextValue | null>(null)

export function MealFormProvider({ children }: { children: ReactNode }) {
    const [formDishes, setFormDishes] = useState<Map<string, TransformedIdentifier[]>>(new Map())

    // Stable callback that won't change reference
    const updateFormDishes = useCallback((modelId: string, dishes: TransformedIdentifier[]) => {
        console.log('Updating form dishes for model', modelId, dishes)
        setFormDishes(prev => {
            const next = new Map(prev)
            next.set(modelId, dishes)
            return next
        })
    }, [])

    // This needs to read from current state, so we pass formDishes
    const getDishes = useCallback((modelId: string, originalDishes: TransformedIdentifier[]) => {
        return formDishes.get(modelId) || originalDishes
    }, [formDishes])

    // Value object - getDishes changes when formDishes changes (needed for reactivity)
    const value: MealFormContextValue = {
        formDishes,
        updateFormDishes,
        getDishes,
    }

    return (
        <MealFormContext.Provider value={value}>
            {children}
        </MealFormContext.Provider>

    )
}


export function useMealFormContext() {
    const context = useContext(MealFormContext)
    if (!context) {
        throw new Error('useMealFormContext must be used within MealFormProvider')
    }
    return context
}