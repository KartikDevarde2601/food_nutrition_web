import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Search } from '@/components/search'
import { DishDetails } from '@/features/dishes/components/dish-details'
import { DishesProvider } from '@/features/dishes/components/dishes-provider'

export const Route = createFileRoute('/_authenticated/dishes/$id')({
  component: DishShow,
})

function DishShow() {
  const { id } = Route.useParams()

  return (
    <DishesProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <DishDetails dishId={id} />
      </Main>
    </DishesProvider>
  )
}
