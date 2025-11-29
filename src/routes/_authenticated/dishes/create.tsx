import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Search } from '@/components/search'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { DishForm } from '@/features/dishes/components/dish-form'
import { DishesProvider } from '@/features/dishes/components/dishes-provider'
import { DishesDialogs } from '@/features/dishes/components/dishes-dialogs'

export const Route = createFileRoute('/_authenticated/dishes/create')({
  component: CreateDish,
})

function CreateDish() {
  const navigate = useNavigate()

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

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/dishes' })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Dish</h2>
            <p className="text-muted-foreground">
              Add a new dish to your collection
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl align-start" >
          <DishForm mode="create" />
        </div>
      </Main>

      <DishesDialogs />
    </DishesProvider>
  )
}
