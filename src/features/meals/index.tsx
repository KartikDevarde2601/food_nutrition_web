import { Main } from '@/components/layout/main'
import { MealsTable } from './components/meals-table'
import { MealsDialogs } from './components/meals-dialogs'

import { MealsProvider } from './components/meals-provider'

export function Meals() {
  return (
    <MealsProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <MealsTable />
      </Main>

      <MealsDialogs />
    </MealsProvider>
  )
}
