import { createFileRoute } from '@tanstack/react-router'
import { useProgramQuery } from '@/hooks/programs/use-programs-query'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProgramsDialogs } from '@/features/programs/components/programs-dialogs'
import { ProgramsProvider } from '@/features/programs/components/programs-provider'
import { ProgramDetailsComponent } from '@/features/programs/components/programs-details-page'

export const Route = createFileRoute('/_authenticated/programs/$id')({
  component: ProgramDetails,
})

function ProgramDetailsContent() {
  const { id } = Route.useParams()
  const { data: program, isLoading, isError } = useProgramQuery(id)

  if (isLoading) return <div>Loading...</div>
  if (isError || !program) return <div>Program not found</div>

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <ProgramDetailsComponent program={program} />
      <ProgramsDialogs />
    </>


  )
}

export function ProgramDetails() {
  return (
    <ProgramsProvider>
      <ProgramDetailsContent />
    </ProgramsProvider>
  )
}
