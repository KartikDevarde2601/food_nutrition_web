import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Separator } from '@/components/ui/separator'
import { DishMetric } from './components/dish-metric'
import { MealMetric } from './components/meal-metric'
import { PerformanceProvider } from './components/performance-provider'
import { useDishMetricQuery } from '@/hooks/performance/use-performance-matrix-query'
import { getRouteApi } from '@tanstack/react-router'

function PerformanceContent() {
    const route = getRouteApi('/_authenticated/performance/')
    const search = route.useSearch()

    // Fetch dish metric data
    const { data: dishMetricData, isLoading } = useDishMetricQuery({
        model_one: search.model_one,
        model_two: search.model_two,
        groupSimilar: search.groupSimilarDishes,
        programs: search.program_id,
        meals: search.meal_ids,
    })

    return (
        <>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 px-4 sm:gap-6 sm:px-6'>
                <MealMetric />
                <Separator className='my-4' />
                <DishMetric isLoading={isLoading} dishMetricData={dishMetricData} />
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
