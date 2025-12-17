import { Main } from '@/components/layout/main'
import { MealsTable } from './components/meals-table'
import { MealsDialogs } from './components/meals-dialogs'
import { useProgramQuery } from '@/hooks/programs/use-programs-query'
import { MealsProvider } from './components/meals-provider'
import { getRouteApi } from '@tanstack/react-router'
import { MealsPrimaryButtons } from './components/meals-primary-buttons'

export function Meals() {
  const route = getRouteApi('/_authenticated/programs/$id/meals')
  const { id } = route.useParams()
  const { data: program } = useProgramQuery(Number(id))

  return (
    <MealsProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Meals</h2>
            <p className='text-muted-foreground'>
              List of meals in <span className="font-bold">{program?.name}</span> program
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
