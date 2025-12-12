import { Outlet } from '@tanstack/react-router'
import { SkipToMain } from '@/components/skip-to-main'
import { Header } from './header'
import { TopNav } from './top-nav'
import { Separator } from '@/components/ui/separator'


type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <>
      <SkipToMain />
      <Header fixed>
        <TopNav />
      </Header>
      <Separator className='fixed top-16 left-0 right-0 z-40' />
      <div className='flex h-[100dvh] flex-col ml-6 mr-6 pt-16'>
        {children ?? <Outlet />}
      </div>
    </>
  )
}
