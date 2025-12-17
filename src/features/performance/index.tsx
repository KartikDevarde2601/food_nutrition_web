import { Main } from '@/components/layout/main'
import { DishMetric } from './components/dish-metric'
import { MealMetric } from './components/meal-metric'
import { PerformanceProvider } from './components/performance-provider'

function PerformanceContent() {

    return (
        <Main className='flex flex-col gap-8'>
            <div className='flex flex-col gap-4'>
                <MealMetric />
            </div>
            <div className='flex flex-col gap-4'>
                <DishMetric />
            </div>
        </Main>
    )
}

export function Performance() {
    return (
        <PerformanceProvider>
            <PerformanceContent />
        </PerformanceProvider>
    )
}
