import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Search } from '@/components/search'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { MealsProvider } from '@/features/meals/components/meals-provider'
import { MealsDialogs } from '@/features/meals/components/meals-dialogs'

export const Route = createFileRoute('/_authenticated/meals/$mealId/edit')({
  component: EditMeal,
})

function EditMeal() {
  const navigate = useNavigate()


  return (
    <MealsProvider>
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
            onClick={() => navigate({ to: '/meals' })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Meal</h2>
            <p className="text-muted-foreground">
              Update the meal information
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <EditMeal />
        </div>
      </Main>

      <MealsDialogs />
    </MealsProvider>
  )
}
