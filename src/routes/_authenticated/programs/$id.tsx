import { format } from 'date-fns'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useProgramQuery } from '@/hooks/programs/use-programs-query'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProgramsDialogs } from '@/features/programs/components/programs-dialogs'
import { ProgramsProvider } from '@/features/programs/components/programs-provider'

export const Route = createFileRoute('/_authenticated/programs/$id')({
  component: ProgramDetails,
})

function ProgramDetails() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  // Fetch program data from API
  const { data: program, isLoading, isError } = useProgramQuery(id)

  if (isLoading) {
    return (
      <ProgramsProvider>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => navigate({ to: '/programs' })}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Loading...</h2>
            </div>
          </div>
        </Main>

        <ProgramsDialogs />
      </ProgramsProvider>
    )
  }

  if (isError || !program) {
    return (
      <ProgramsProvider>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => navigate({ to: '/programs' })}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Program Not Found
              </h2>
              <p className='text-muted-foreground'>
                The program you're looking for doesn't exist
              </p>
            </div>
          </div>
        </Main>

        <ProgramsDialogs />
      </ProgramsProvider>
    )
  }

  return (
    <ProgramsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6 sm:gap-8'>
        {/* Header with back button and actions */}
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => navigate({ to: '/programs' })}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>
                {program.name}
              </h1>
              <p className='text-muted-foreground'>Program Information</p>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Program Details Section */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Description */}
            <div className='space-y-2'>
              <h2 className='text-lg font-semibold'>Description</h2>
              <p className='text-muted-foreground leading-relaxed'>
                {program.description}
              </p>
            </div>

            {/* Statistics Grid */}
            <div className='grid gap-4 sm:grid-cols-2'>
              {/* Dishes Count */}
              <div className='bg-card space-y-2 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm font-medium'>
                    Total Dishes
                  </span>
                </div>
                <div className='text-2xl font-bold'>{program.dishes || 0}</div>
                <p className='text-muted-foreground text-xs'>
                  Available in this program
                </p>
              </div>

              {/* Meals Count */}
              <div className='bg-card space-y-2 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm font-medium'>
                    Total Meals
                  </span>
                </div>
                <div className='text-2xl font-bold'>{program.meals || 0}</div>
                <p className='text-muted-foreground text-xs'>
                  Available in this program
                </p>
              </div>
            </div>

            {/* Date Range */}
            {(program.earliestDate || program.latestDate) && (
              <div className='bg-muted/30 space-y-3 rounded-lg border p-4'>
                <h3 className='font-semibold'>Date Range</h3>
                <div className='grid gap-3 sm:grid-cols-2'>
                  {program.earliestDate && (
                    <div className='bg-background flex justify-between rounded-md px-3 py-2'>
                      <span className='text-muted-foreground text-sm'>
                        Start Date
                      </span>
                      <span className='text-sm font-medium'>
                        {format(new Date(program.earliestDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  {program.latestDate && (
                    <div className='bg-background flex justify-between rounded-md px-3 py-2'>
                      <span className='text-muted-foreground text-sm'>
                        End Date
                      </span>
                      <span className='text-sm font-medium'>
                        {format(new Date(program.latestDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Model Information Section */}
          <div className='space-y-6'>
            <div className='bg-card space-y-4 rounded-lg border p-6'>
              <h2 className='text-lg font-semibold'>Default Model</h2>

              {program.default_model?.model_id ? (
                <div className='space-y-3'>
                  <div className='space-y-1'>
                    <p className='text-muted-foreground text-sm'>Model Name</p>
                    <p className='font-medium'>{program.default_model.model_id}</p>
                  </div>

                  <div className='space-y-1'>
                    <p className='text-muted-foreground text-sm'>Description</p>
                    <p className='text-sm leading-relaxed'>
                      {program.default_model.description}
                    </p>
                  </div>

                  <div className='space-y-1'>
                    <p className='text-muted-foreground text-sm'>Model ID</p>
                    <p className='font-mono text-sm'>
                      {program.default_model.model_id}
                    </p>
                  </div>
                </div>
              ) : (
                <p className='text-muted-foreground text-sm'>
                  No default model assigned
                </p>
              )}
            </div>

            {/* Program Details */}
            <div className='bg-muted/30 space-y-3 rounded-lg border p-4'>
              <h3 className='font-semibold'>Details</h3>
              <div className='space-y-2'>
                <div className='bg-background flex justify-between rounded-md px-3 py-2'>
                  <span className='text-muted-foreground text-sm'>
                    Program ID
                  </span>
                  <span className='text-sm font-medium'>{program.program_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main>

      <ProgramsDialogs />
    </ProgramsProvider>
  )
}
