import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DishesDialogs } from './components/dishes-dialogs'
import { DishesPrimaryButtons } from './components/dishes-primary-buttons'
import { DishesProvider } from './components/dishes-provider'
import { DishesTable } from './components/dishes-table'

export function Dishes() {
  return (
    <DishesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Dishes</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your dishes!
            </p>
          </div>
          <DishesPrimaryButtons />
        </div>
        <DishesTable />
      </Main>

      <DishesDialogs />
    </DishesProvider>
  )
}
