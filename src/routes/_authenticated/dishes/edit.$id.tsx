import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { DishForm } from '@/features/dishes/components/dish-form'
import { DishesProvider } from '@/features/dishes/components/dishes-provider'
import { DishesDialogs } from '@/features/dishes/components/dishes-dialogs'

export const Route = createFileRoute('/_authenticated/dishes/edit/$id')({
  component: EditDish,
})

function EditDish() {
  const navigate = useNavigate()

  const { id } = Route.useParams()

  return (
    <DishesProvider>
      <Header fixed>

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
            <h2 className="text-2xl font-bold tracking-tight">Edit Dish</h2>
            <p className="text-muted-foreground">
              Update the dish information
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <DishForm mode="edit" dishId={id} />
        </div>
      </Main>

      <DishesDialogs />
    </DishesProvider>
  )
}
