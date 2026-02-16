import { getRouteApi } from '@tanstack/react-router'
import { useProgramQuery } from '@/hooks/programs/use-programs-query'
import { Main } from '@/components/layout/main'
import { MealsDialogs } from './components/meals-dialogs'
import { MealsPrimaryButtons } from './components/meals-primary-buttons'
import { MealsTable } from './components/meals-table'
import { MealsProvider } from './context/meals-provider'

export function Meals() {
  const route = getRouteApi('/_authenticated/programs/$id/meals')
  const { id } = route.useParams()
  const { data: program } = useProgramQuery(Number(id))

  return (
    <MealsProvider>
      <Main className='flex flex-1 flex-col gap-2 overflow-hidden sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Meals</h2>
            <p className='text-muted-foreground'>
              List of meals in{' '}
              <span className='font-bold'>{program?.name}</span> program
            </p>
          </div>
          <MealsPrimaryButtons />
        </div>
        <MealsTable />
      </Main>
      <MealsDialogs />
    </MealsProvider>
  )
}
