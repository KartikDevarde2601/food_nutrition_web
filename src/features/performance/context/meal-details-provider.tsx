import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

type MealDetailsDialogType = 'view'

type MealDetailsContextType = {
    open: MealDetailsDialogType | null
    setOpen: (str: MealDetailsDialogType | null) => void
    selectdishAndModels: {
        dishName: string
        modelOne: number
        modelTwo: number
        clickedModel: 1 | 2
    } | null
    setSelectdishAndModels: React.Dispatch<React.SetStateAction<{
        dishName: string
        modelOne: number
        modelTwo: number
        clickedModel: 1 | 2
    } | null>>
}

const MealDetailsContext = React.createContext<MealDetailsContextType | null>(null)

export function MealDetailsProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<MealDetailsDialogType>(null)
    const [selectdishAndModels, setSelectdishAndModels] = useState<{
        dishName: string
        modelOne: number
        modelTwo: number
        clickedModel: 1 | 2
    } | null>(null)

    return (
        <MealDetailsContext value={{ open, setOpen, selectdishAndModels, setSelectdishAndModels }}>
            {children}
        </MealDetailsContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMealDetails = () => {
    const mealDetailsContext = React.useContext(MealDetailsContext)

    if (!mealDetailsContext) {
        throw new Error('useMealDetails has to be used within <MealDetailsContext>')
    }

    return mealDetailsContext
}
