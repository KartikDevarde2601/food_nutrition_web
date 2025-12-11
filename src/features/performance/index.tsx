import { Main } from '@/components/layout/main'
import { Separator } from '@/components/ui/separator'
import { DishMetric } from './components/dish-metric'
import { MealMetric } from './components/meal-metric'
import { PerformanceProvider } from './components/performance-provider'

function PerformanceContent() {

    return (
        <>
            <Main className='flex flex-1 flex-col gap-4 px-4 sm:gap-6 sm:px-6'>
                <MealMetric />
                <Separator className='my-4' />
                <DishMetric />
            </Main>
        </>
    )
}

export function Performance() {
    return (
        <PerformanceProvider>
            <PerformanceContent />
        </PerformanceProvider>
    )
}
