import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProgramsDialogs } from './components/programs-dialogs'
import { ProgramsPrimaryButtons } from './components/programs-primary-buttons'
import { ProgramsProvider, usePrograms } from './components/programs-provider'
import { ProgramsTable } from './components/programs-table'
import { ProgramsMutateDrawer } from './components/programs-mutate-drawer'

function ProgramsContent() {
  const { open, setOpen, currentRow } = usePrograms()

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
            <h2 className='text-2xl font-bold tracking-tight'>Programs</h2>
            <p className='text-muted-foreground'>
              Manage your nutrition programs here!
            </p>
          </div>
          <ProgramsPrimaryButtons />
        </div>
        <ProgramsTable />
      </Main>

      {/* Dialogs */}
      <ProgramsDialogs />

      {/* Create/Edit Drawer */}
      <ProgramsMutateDrawer
        open={open === 'create' || open === 'edit'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null)
          }
        }}
        currentRow={open === 'edit' ? currentRow : null}
      />
    </>
  )
}

export function Programs() {
  return (
    <ProgramsProvider>
      <ProgramsContent />
    </ProgramsProvider>
  )
}
