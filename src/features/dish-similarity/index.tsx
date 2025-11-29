import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DishesSimilarityDialogs } from './componets/dish-similarity-dailogs'
import { DishSimilarityPrimaryButtons } from './componets/dish-similarity-primary-button'
import { DishesSimilarityProvider } from './componets/dish-similarity-provider'
import { DishSimilarityTable } from './componets/dish-similarity-table'
import { DishSimilarityMutateDrawer } from './componets/dish-similarity-mutate-drawer'
import { useDishesSimilarity } from './componets/dish-similarity-provider'

export function DishSimilarity() {
  return (
    <DishesSimilarityProvider>
      <DishSimilarityContent />
    </DishesSimilarityProvider>
  )
}

function DishSimilarityContent() {
  const { open, setOpen } = useDishesSimilarity()
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

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Dishes Similarity Analysis</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your dishes!
            </p>
          </div>
          <DishSimilarityPrimaryButtons />
        </div>
        <DishSimilarityTable />
      </Main>

      <DishesSimilarityDialogs />
      <DishSimilarityMutateDrawer
        open={open === 'create' || open === 'edit'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null)
          }
        }}
      />
    </>
  )
}
