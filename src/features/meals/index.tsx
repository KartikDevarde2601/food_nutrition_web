import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { MealsTable } from './components/meals-table'
import { MealsDialogs } from './components/meals-dialogs'
import { MealsPrimaryButtons } from './components/meals-primary-buttons'
import { MealsProvider } from './components/meals-provider'

export function Meals() {
  return (
    <MealsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Meals</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your meals!
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
