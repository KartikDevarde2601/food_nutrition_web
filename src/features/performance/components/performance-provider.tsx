import React, { useState } from 'react'

type PerformanceDialogType = null

interface PerformanceContextType {
    open: PerformanceDialogType
    setOpen: (str: PerformanceDialogType) => void
    activeMetric: string
    setActiveMetric: (metric: string) => void
    dateRange: {
        startDate: string
        endDate: string
    }
    setDateRange: (range: { startDate: string; endDate: string }) => void
    groupSimilarDishes: boolean
    setGroupSimilarDishes: (value: boolean) => void
    groupSimilarMeals: boolean
    setGroupSimilarMeals: (value: boolean) => void
    selectedModelOne: number
    setSelectedModelOne: (model: number) => void
    selectedModelTwo: number
    setSelectedModelTwo: (model: number) => void
}

const PerformanceContext = React.createContext<PerformanceContextType | null>(null)

interface PerformanceProviderProps {
    children: React.ReactNode
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
    const [open, setOpen] = useState<PerformanceDialogType>(null)
    const [activeMetric, setActiveMetric] = useState<string>('MAE')
    const [dateRange, setDateRange] = useState({
        startDate: '2025-01-01',
        endDate: '2025-12-31',
    })
    const [groupSimilarDishes, setGroupSimilarDishes] = useState(true)
    const [groupSimilarMeals, setGroupSimilarMeals] = useState(true)
    const [selectedModelOne, setSelectedModelOne] = useState<number>(1)
    const [selectedModelTwo, setSelectedModelTwo] = useState<number>(2)

    return (
        <PerformanceContext.Provider
            value={{
                open,
                setOpen,
                activeMetric,
                setActiveMetric,
                dateRange,
                setDateRange,
                groupSimilarDishes,
                setGroupSimilarDishes,
                groupSimilarMeals,
                setGroupSimilarMeals,
                selectedModelOne,
                setSelectedModelOne,
                selectedModelTwo,
                setSelectedModelTwo,
            }}
        >
            {children}
        </PerformanceContext.Provider>
    )
}

export function usePerformance() {
    const context = React.useContext(PerformanceContext)

    if (!context) {
        throw new Error('usePerformance must be used within a PerformanceProvider')
    }

    return context
}
