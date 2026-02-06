import { Main } from '@/components/layout/main'
import { DishMetric } from './components/dish-metric'
import { MealMetric } from './components/meal-metric'
import { MealsDialog } from './components/meals-dailog'
import { PerformanceProvider } from './context/performance-provider'
import { MealDetailsProvider } from './context/meal-details-provider'

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
        <MealDetailsProvider>
            <PerformanceProvider>
                <PerformanceContent />
                <MealsDialog />
            </PerformanceProvider>
        </MealDetailsProvider>
    )
}
